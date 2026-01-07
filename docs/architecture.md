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

## 7. 決済・サブスクリプション (Payments)

**設計方針:**
- Stripe Webhook処理は **Supabase RPC (Stored Function)** でトランザクションと冪等性を担保
- FastAPI側は署名検証とRPC呼び出しのみ（複数回のDB操作禁止）
- RPC関数は `SECURITY INVOKER` で実装（Service Role Keyで呼び出すためDEFINER不要）

**テーブル構成:**
- `stripe_event_logs`: 処理済みイベントID記録（重複処理防止）
- `organizations.stripe_customer_id`: Stripe顧客ID紐付け

```mermaid
sequenceDiagram
    autonumber
    participant Stripe
    participant API as Cloud Run<br/>(FastAPI)
    participant RPC as Supabase RPC<br/>(handle_stripe_webhook)
    participant DB as PostgreSQL

    rect rgb(255, 245, 238)
        Note over Stripe, DB: Webhook受信 → トランザクション処理
        Stripe->>API: POST /api/webhooks/stripe<br/>Stripe-Signature: t=...,v1=...

        API->>API: stripe.Webhook.construct_event()<br/>署名検証

        alt 署名検証失敗
            API-->>Stripe: 400 Bad Request
        else 署名検証成功
            API->>RPC: SELECT handle_stripe_webhook(<br/>  event_id, event_type,<br/>  customer_id, payload<br/>)

            RPC->>DB: BEGIN TRANSACTION

            RPC->>DB: SELECT FROM stripe_event_logs<br/>WHERE event_id = $1
            alt 既に処理済み
                RPC->>DB: ROLLBACK
                RPC-->>API: {status: 'already_processed'}
            else 未処理
                RPC->>DB: INSERT INTO stripe_event_logs
                RPC->>DB: UPDATE organizations<br/>SET status = 'Active'<br/>WHERE stripe_customer_id = $1
                RPC->>DB: COMMIT
                RPC-->>API: {status: 'success'}
            end

            API-->>Stripe: 200 OK
        end
    end
```

**対応イベント:**

| Event Type | 処理内容 |
|------------|----------|
| `invoice.payment_succeeded` | 組織ステータスを `Active` に更新 |
| `invoice.payment_failed` | 組織ステータスを `PaymentFailed` に更新 |
| `customer.subscription.deleted` | 組織ステータスを `Cancelled` に更新 |

---

## 8. ソフトウェアアーキテクチャ (レイヤー構成)

**設計方針:**
- **3層構造**を採用（Controller / Service / Data Access）
- `logic` フォルダは作成せず、ビジネスロジックは `services` に統合
- 各層の責務を明確に分離し、上位層から下位層への一方向依存のみ許可

```mermaid
graph TD
    subgraph Client["Client"]
        FE[Angular Frontend]
    end

    subgraph Backend["Backend (FastAPI)"]
        subgraph Routes["api/routes<br/>━━━━━━━━━━━━━<br/>Controller層"]
            R1[projects.py]
            R2[rfi.py]
            R3[chat.py]
            R4[webhooks.py]
        end

        subgraph Services["services<br/>━━━━━━━━━━━━━<br/>Business Logic層"]
            S1[project_service.py]
            S2[rfi_service.py]
            S3[chat_service.py]
            S4[payment_service.py]
        end

        subgraph CRUD["crud<br/>━━━━━━━━━━━━━<br/>Data Access層"]
            C1[project_crud.py]
            C2[rfi_crud.py]
            C3[chat_crud.py]
        end
    end

    subgraph External["External"]
        DB[(Supabase DB)]
        RPC[Supabase RPC]
        AI[OpenAI API]
    end

    FE -->|HTTP Request| Routes
    Routes -->|"①Validation<br/>②Call Service"| Services
    Services -->|"Business Logic<br/>Transaction Control"| CRUD
    Services -->|"Critical Ops<br/>(Payments)"| RPC
    Services -->|AI Generation| AI
    CRUD -->|SQL Query| DB
    RPC -->|Atomic Transaction| DB

    classDef routes fill:#4285F4,stroke:#1967D2,color:#fff
    classDef services fill:#34A853,stroke:#1E8E3E,color:#fff
    classDef crud fill:#FBBC04,stroke:#F29900,color:#000
    classDef external fill:#9E9E9E,stroke:#616161,color:#fff

    class R1,R2,R3,R4 routes
    class S1,S2,S3,S4 services
    class C1,C2,C3 crud
    class DB,RPC,AI external
```

**各層の責務:**

| 層 | フォルダ | 責務 | 備考 |
|----|----------|------|------|
| **Controller** | `api/routes/` | リクエスト受付、Validation、レスポンス整形 | Pydanticでバリデーション |
| **Service** | `services/` | ビジネスロジック、トランザクション制御、複数CRUDの統括 | ※Logic層はここに統合 |
| **Data Access** | `crud/` | DB操作のみ（SELECT/INSERT/UPDATE/DELETE） | 単純なCRUD操作 |

**トランザクション制御方針:**

| 操作タイプ | 制御場所 | 理由 |
|------------|----------|------|
| 単一CRUD | Service層 → CRUD | シンプルな操作はそのまま実行 |
| 複数テーブル操作 | Supabase RPC | supabase-pyはトランザクション非対応のため |
| 決済・課金 | Supabase RPC | 冪等性・原子性を SQL Function で担保 |
| バッチ更新 | Supabase RPC | 大量データの一括処理はDB側で実行 |

> **Note**: `supabase-py` は REST API ベースのため、Python側での `BEGIN/COMMIT` トランザクションはサポートされていません。複数テーブルへの操作が必要な場合は RPC を使用してください。

**コード例:**

```python
# api/routes/projects.py (Controller)
@router.post("/projects")
async def create_project(
    data: ProjectCreate,  # Pydantic Validation
    user: User = Depends(get_current_user)
):
    return await project_service.create_project(data, user)

# services/project_service.py (Service)
async def create_project(data: ProjectCreate, user: User) -> Project:
    # ビジネスロジック (権限チェック等)
    if not await can_create_project(user):
        raise HTTPException(403, "Project limit reached")

    # 単一操作: そのままCRUD
    return await project_crud.create(data, user.id)

async def create_project_with_vendors(
    data: ProjectCreate, user: User, vendor_ids: list[UUID]
) -> Project:
    # 複数操作: RPCを使用
    result = await supabase.rpc(
        "create_project_with_vendors",
        {
            "p_title": data.title,
            "p_user_id": str(user.id),
            "p_vendor_ids": [str(v) for v in vendor_ids]
        }
    ).execute()
    return result.data

# crud/project_crud.py (Data Access)
async def create(data: ProjectCreate, user_id: UUID) -> Project:
    result = await supabase.from_("projects").insert({
        "title": data.title,
        "created_by": str(user_id)
    }).execute()
    return result.data[0]
```

---

## 9. API エンドポイント一覧

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

## 9. CI/CD パイプライン

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

## 10. セキュリティチェックリスト

- [ ] Supabase RLSポリシー設定（全テーブル）
- [ ] Cloud Run IAM設定（最小権限）
- [ ] CORS設定（許可オリジン限定）
- [ ] Stripe Webhook署名検証
- [ ] 環境変数の秘匿管理（Secret Manager）
- [ ] Rate Limiting（API Gateway or Cloud Armor）

---

## 11. コスト見積もり

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
