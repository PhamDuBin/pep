# PEP アーキテクチャ設計書

## 1. システム構成図

**技術選定の理由:**
- **Cloud Run**: サーバーレス・従量課金・自動スケール (0→N)
- **Supabase**: DB/Auth/Storage/Realtimeを一括提供、運用コスト削減
- **OpenAI**: GPT-4によるRFI草案生成の品質

```mermaid
graph TB
    subgraph Frontend["Frontend (別チーム管理)"]
        FE[/"Angular 21<br/>Firebase Hosting"/]
    end

    subgraph Backend["Backend (FastAPI)"]
        CR[["Cloud Run<br/>asia-northeast1"]]
    end

    subgraph Supabase["Supabase (BaaS)"]
        Auth([Supabase Auth<br/>JWT発行])
        DB[(PostgreSQL<br/>+ pgvector)]
        Storage[(Storage<br/>S3互換)]
        RT{{Realtime<br/>WebSocket}}
    end

    subgraph External["External Services"]
        AI[/OpenAI API<br/>GPT-4/]
        Pay[/Stripe API<br/>決済/]
    end

    FE -->|"認証"| Auth
    FE -->|"REST API"| CR
    FE -.->|"リアルタイム通知"| RT

    CR -->|"CRUD"| DB
    CR -->|"ファイル操作"| Storage
    CR -->|"AI生成"| AI
    CR -->|"決済処理"| Pay

    Auth -->|"ユーザー情報"| DB

    classDef frontend fill:#4285F4,stroke:#1967D2,color:#fff
    classDef backend fill:#34A853,stroke:#1E8E3E,color:#fff
    classDef supabase fill:#3ECF8E,stroke:#24B47E,color:#fff
    classDef external fill:#FBBC04,stroke:#F29900,color:#000

    class FE frontend
    class CR backend
    class Auth,DB,Storage,RT supabase
    class AI,Pay external
```

---

## 2. データベース設計 (ER図)

**制約事項:**
- すべてのテーブルに **RLS (Row Level Security)** 必須
- 主キーは **UUID** を使用
- `auth.users` は Supabase Auth が管理（直接操作不可）

```mermaid
erDiagram
    auth_users ||--|| profiles : "1:1"
    profiles }o--|| organizations : "belongs_to"
    organizations ||--o{ vendor_contracts : "has"
    profiles ||--o{ projects : "creates"
    profiles ||--o{ chat_sessions : "owns"
    projects ||--o{ project_vendors : "has"
    projects ||--o{ rfi_responses : "receives"
    organizations ||--o{ project_vendors : "participates"
    organizations ||--o{ rfi_responses : "submits"
    chat_sessions ||--o{ chat_messages : "contains"

    auth_users {
        uuid id PK "Supabase管理"
        string email UK
        timestamp created_at
    }

    profiles {
        uuid id PK "= auth.users.id"
        uuid org_id FK
        string display_name
        enum role "Admin | Member"
        enum status "Active | Inactive"
        timestamp created_at
        timestamp updated_at
    }

    organizations {
        uuid id PK
        string name
        enum type "Buyer | Vendor"
        enum status "Active | Inactive"
        timestamp created_at
        timestamp updated_at
    }

    vendor_contracts {
        uuid id PK
        uuid org_id FK
        enum status "Active | Expired | Cancelled"
        date start_date
        date end_date
    }

    projects {
        uuid id PK
        uuid buyer_org_id FK
        uuid created_by FK
        string title
        text body
        enum status "Draft | InDiscussion | Closed"
        timestamp started_at
        timestamp created_at
        timestamp updated_at
    }

    project_vendors {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        enum notify_status "Pending | Sent | Read"
        timestamp created_at
    }

    rfi_responses {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        text response_body
        enum status "Draft | Submitted"
        timestamp submitted_at
        timestamp created_at
    }

    chat_sessions {
        uuid id PK
        uuid user_id FK
        uuid project_id FK "nullable"
        boolean presentation_mode
        timestamp created_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK
        enum role "user | assistant | system"
        text content
        jsonb metadata
        vector_1536 embedding "pgvector"
        timestamp created_at
    }
```

---

## 3. 認証フロー

**ポイント:**
- JWTは **Supabase Auth** が発行・検証
- バックエンドは **Service Role Key** でDB操作

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Angular
    participant Auth as Supabase Auth
    participant API as Cloud Run<br/>(FastAPI)
    participant DB as PostgreSQL

    rect rgb(240, 248, 255)
        Note over User, Auth: ログイン処理
        User->>FE: メール/パスワード入力
        FE->>Auth: POST /auth/v1/token<br/>{email, password}
        Auth->>Auth: パスワード検証
        Auth-->>FE: {access_token, refresh_token}
        FE->>FE: localStorage に保存
    end

    rect rgb(240, 255, 240)
        Note over User, DB: API呼び出し
        User->>FE: プロジェクト作成
        FE->>API: POST /api/projects<br/>Authorization: Bearer {JWT}
        API->>Auth: GET /auth/v1/user<br/>JWT検証
        Auth-->>API: {user_id, email, ...}
        API->>DB: INSERT INTO projects
        DB-->>API: 作成結果
        API-->>FE: 201 Created<br/>{project_id}
    end
```

---

## 4. RFI生成フロー (AI連携)

**ポイント:**
- OpenAI API は **ストリーミング対応**
- 生成結果は **embedding** として保存（将来の類似検索用）

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Angular
    participant API as Cloud Run
    participant AI as OpenAI API
    participant DB as PostgreSQL

    rect rgb(255, 250, 240)
        Note over User, DB: RFI草案生成
        User->>FE: プロジェクト概要入力<br/>"材木卸問屋のDX推進"
        FE->>API: POST /api/rfi/ai-suggest<br/>{prompt, project_id}

        API->>AI: POST /v1/chat/completions<br/>{model: "gpt-4", messages: [...]}
        AI-->>API: Stream: "背景として..."
        AI-->>API: Stream: "目的は..."
        AI-->>API: Stream: [DONE]

        API->>DB: INSERT INTO chat_messages<br/>{role: "assistant", content}
        API->>AI: POST /v1/embeddings<br/>{input: content}
        AI-->>API: {embedding: [0.1, 0.2, ...]}
        API->>DB: UPDATE chat_messages<br/>SET embedding = [...]

        API-->>FE: 200 OK<br/>{content, message_id}
        FE-->>User: RFI草案表示
    end
```

---

## 5. プロジェクト状態遷移

**制約:**
- `Draft → InDiscussion`: Vendor選択必須
- `InDiscussion → Closed`: 手動のみ（自動クローズなし）
- 一度 `Closed` になると再オープン不可

```mermaid
stateDiagram-v2
    [*] --> Draft: POST /projects

    Draft --> Draft: PUT /projects/{id}<br/>内容編集
    Draft --> InDiscussion: POST /projects/{id}/start-discussion<br/>Vendor選択 + 送信

    InDiscussion --> InDiscussion: チャット協議<br/>RFI回答受信
    InDiscussion --> Closed: POST /projects/{id}/close<br/>完了処理

    Closed --> [*]

    note right of Draft
        Buyer が RFI 草案を作成中
        AI チャットで内容をブラッシュアップ
    end note

    note right of InDiscussion
        Vendor に RFI を送信済み
        チャットで協議中
    end note

    note right of Closed
        プロジェクト完了
        変更不可
    end note
```

---

## 6. RFI回答の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Draft: Vendor が回答開始

    Draft --> Draft: PUT /rfi/{id}/responses/{rid}<br/>下書き更新
    Draft --> Submitted: POST /rfi/{id}/responses/{rid}/submit<br/>回答提出

    Submitted --> [*]

    note right of Draft
        Vendor が回答を作成中
        何度でも編集可能
    end note

    note right of Submitted
        Buyer に回答を提出済み
        以降は編集不可
    end note
```

---

## 7. API エンドポイント一覧

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/projects` | プロジェクト一覧 | UC11 |
| `POST` | `/api/projects` | プロジェクト作成 | UC06 |
| `GET` | `/api/projects/{id}` | プロジェクト詳細 | UC07 |
| `PUT` | `/api/projects/{id}` | プロジェクト更新 | UC07 |
| `POST` | `/api/projects/{id}/start-discussion` | 送信開始 | UC07 |
| `POST` | `/api/projects/{id}/close` | 完了 | UC10 |
| `POST` | `/api/rfi/ai-suggest` | AI草案生成 | UC06 |
| `GET` | `/api/rfi/{project_id}/responses` | 回答一覧 | UC10 |
| `POST` | `/api/rfi/{project_id}/responses` | 回答提出 | UC08 |
| `POST` | `/api/chat/sessions` | セッション作成 | - |
| `POST` | `/api/chat/sessions/{id}/messages` | メッセージ送信 | UC06, UC09 |
| `POST` | `/api/slides/generate` | スライド生成 | - |
| `POST` | `/api/webhooks/stripe` | Stripe通知 | UC13-15 |

---

## 8. CI/CD パイプライン

```mermaid
graph LR
    subgraph Dev["開発環境"]
        LC[ローカル開発]
    end

    subgraph CI["GitLab CI/CD"]
        Push[git push]
        Test[pytest<br/>テスト実行]
        Build[Docker Build]
    end

    subgraph Prod["本番環境"]
        CR[Cloud Run<br/>FastAPI]
        SB[Supabase<br/>DB/Auth]
    end

    LC --> Push
    Push --> Test
    Test -->|pass| Build
    Build --> CR
    Push -.->|migration| SB

    classDef ci fill:#FC6D26,stroke:#E24329,color:#fff
    class Push,Test,Build ci
```

---

## 9. セキュリティチェックリスト

- [ ] Supabase RLSポリシー設定（全テーブル）
- [ ] Cloud Run IAM設定（最小権限）
- [ ] CORS設定（許可オリジン限定）
- [ ] Stripe Webhook署名検証
- [ ] 環境変数の秘匿管理（Secret Manager）
- [ ] Rate Limiting（API Gateway or Cloud Armor）

---

## 10. コスト見積もり

| 規模 | Supabase | Cloud Run | 合計/月 |
|------|----------|-----------|---------|
| ~100 users | $0 | $0 | **$0** |
| ~1,000 users | $25 | ~$10 | **~$35** |
| ~10,000 users | $25 | ~$50 | **~$75** |

※ OpenAI API は従量課金（別途）

---

## 参考資料

- [ユースケース一覧](./UC/index.md)
- [Supabase Docs](https://supabase.com/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
