# [Task] AI Chat Sessions / AIチャットセッション

## 🔗 GitLab Issue
- Link: [#34](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/34)

---

## 📝 概要

BuyerがAIとチャットしてプロジェクト計画書を生成する機能。
OpenAI APIを利用し、チャット履歴をDBに保存。生成した計画書は`POST /api/projects/{id}/send`でVendorに送信。

**Buyerのみ利用可能**: VendorはAIチャットセッションにアクセス不可。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成（AIチャット） |
| [Database Design](../architecture/database.md) | ai_chat_sessions, ai_chat_messages |
| [AI Integration](../architecture/ai-integration.md) | AI連携設計 |
| [API Endpoints](../architecture/api-endpoints.md) | APIエンドポイント |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. セッション作成（プロジェクト作成時に自動）
   POST /api/projects  ← プロジェクト作成時に自動作成（02-01）
   └─→ ai_chat_sessions INSERT

2. メッセージ送信 & AI応答
   POST /api/ai/sessions/{id}/messages
   └─→ ai_chat_messages INSERT (role='user')
   └─→ OpenAI API call
   └─→ ai_chat_messages INSERT (role='assistant')

3. セッション履歴取得
   GET /api/ai/sessions/{id}/messages
   └─→ ai_chat_messages SELECT

4. 計画書コンテンツ生成（プレビュー用）
   POST /api/ai/sessions/{id}/generate-plan
   └─→ チャット内容から計画書Markdownを生成
   └─→ Response: { title, content } ※DBには保存しない

5. 計画書送信（実際の保存・送信）
   POST /api/projects/{id}/send  ← 02-01で実行
   └─→ project_plans INSERT
   └─→ Vendorに送信

6. セッション一覧
   GET /api/ai/sessions
   └─→ ai_chat_sessions SELECT (org_id = 自組織)
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `ai_chat_sessions` テーブル作成
- [ ] `ai_chat_messages` テーブル作成
- [ ] pgvector 拡張有効化（embedding用）
- [ ] RLSポリシー設定（**Buyerのみアクセス可**）

### Backend (FastAPI)

- [ ] `GET /api/ai/sessions` - セッション一覧
- [ ] `POST /api/ai/sessions` - セッション作成（単独作成用、通常は02-01で自動作成）
- [ ] `GET /api/ai/sessions/{id}` - セッション詳細
- [ ] `DELETE /api/ai/sessions/{id}` - セッション削除
- [ ] `GET /api/ai/sessions/{id}/messages` - メッセージ履歴
- [ ] `POST /api/ai/sessions/{id}/messages` - メッセージ送信
- [ ] `POST /api/ai/sessions/{id}/generate-plan` - 計画書コンテンツ生成（プレビュー用）
- [ ] OpenAI API統合
- [ ] Pydantic schemas
- [ ] Service層 (`ai_service.py`)
- [ ] CRUD層 (`ai_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_ai.py` | Service層 |
| Services | `tests/unit/test_services/test_ai_service.py` | CRUD層, OpenAI API |
| CRUD | `tests/unit/test_crud/test_ai_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（セッション管理・メッセージ処理ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | セッション作成成功 | Service | session_id 返却 |
| 2 | メッセージ送信成功（OpenAI mock） | Service | user/assistant両方返却 |
| 3 | 他組織のセッションアクセス | Service | 403/404 Error |
| 4 | Vendorからのアクセス | Routes | 403 Forbidden |
| 5 | 計画書コンテンツ生成成功 | Service | title, content 返却 |
| 6 | OpenAI APIエラー時 | Service | 適切なエラーハンドリング |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/03-01-ai-chat.md` に基づき AI Chat Sessions（AIチャット）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC6.md
- DB設計: docs/architecture/database.md
- AI連携: docs/architecture/ai-integration.md
- API定義: docs/architecture/api-endpoints.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

pgvector拡張を有効化:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

`ai_chat_sessions` テーブル:
- id (UUID, PK)
- org_id (UUID, FK → organizations.id) - セッション所有組織
- project_id (UUID, FK → projects.id, nullable)
- title (TEXT, nullable)
- is_presentation_mode (BOOLEAN, default false) - スライド生成モード
- created_by (UUID, FK → profiles.id) - 作成者
- created_at, updated_at, updated_by, is_deleted

`ai_chat_messages` テーブル:
- id (UUID, PK)
- session_id (UUID, FK → ai_chat_sessions.id)
- role (TEXT: 'user' | 'assistant' | 'system')
- content (TEXT, NOT NULL)
- metadata (JSONB, nullable) - 追加情報（トークン数等）
- embedding (VECTOR(1536), nullable) - pgvector
- created_by (UUID, FK → profiles.id, nullable for assistant)
- created_at, updated_at, updated_by, is_deleted

### 2. FastAPI Endpoints

#### GET /api/ai/sessions - セッション一覧
- Query: project_id?, page, limit
- Response: { items: Session[], total }
- Filter by org_id from JWT（組織内の全セッションを取得）
- **Buyerのみ**

#### POST /api/ai/sessions - セッション作成
- Request: { project_id?, title?, is_presentation_mode? }
- Response: Session
- **Note**: プロジェクト作成時にはPOST /api/projectsで自動作成される（02-01）
- **Buyerのみ**

#### GET /api/ai/sessions/{id} - セッション詳細
- Response: Session
- **Buyerのみ**

#### DELETE /api/ai/sessions/{id} - セッション削除
- Soft delete
- **Buyerのみ**

#### GET /api/ai/sessions/{id}/messages - メッセージ履歴
- Response: { messages: Message[] }
- Order by created_at ASC
- **Buyerのみ**

#### POST /api/ai/sessions/{id}/messages - メッセージ送信
- Request: { content: string }
- Process:
  1. Insert user message
  2. Call OpenAI API with conversation history
  3. Insert assistant message
  4. Generate embedding (async, optional)
- Response: { user_message: Message, assistant_message: Message }
- Stream response support (optional)
- **Buyerのみ**

#### POST /api/ai/sessions/{id}/generate-plan - 計画書コンテンツ生成
- Request: { title?: string }
- チャット内容から計画書Markdownを生成
- **DBには保存しない**（プレビュー用）
- Response: { title: string, content: string }
- **Buyerのみ**
- **Note**: 実際の保存・送信は `POST /api/projects/{id}/send`（02-01）で実行

### 3. OpenAI Integration

- Model: gpt-4-turbo (configurable)
- System prompt for Project Plan generation context
- Embedding model: text-embedding-3-small

### 4. レイヤー構成
- api/routes/ai.py (Controller)
- services/ai_service.py (Business Logic)
- services/openai_service.py (OpenAI API wrapper)
- crud/ai_crud.py (Data Access)
- schemas/ai.py (Pydantic models)

### 5. RLSポリシー
- ai_chat_sessions: org_id = 自組織 AND organizations.type = 'buyer'
- ai_chat_messages: session.org_id = 自組織 AND organizations.type = 'buyer'

## 制約
- **Buyerのみ利用可能**（Vendorは403 Forbidden）
- セッションは同一組織のメンバーのみアクセス可能
- OpenAI APIキーは環境変数から取得
- レート制限考慮
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- OpenAI APIはモック使用（実API呼び出し不要）
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが存在
- [ ] pgvector拡張が有効
- [ ] セッション作成・取得が動作
- [ ] メッセージ送信でOpenAI応答が返る
- [ ] 計画書コンテンツ生成が動作（プレビュー用）
- [ ] **Vendorからのアクセスが403で拒否される**
- [ ] RLSが正しく機能
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [01-02-backend-onboarding.md](./01-02-backend-onboarding.md) (profiles, organizations)
- 連携: [02-01-project-management.md](./02-01-project-management.md) (プロジェクト作成時にAIセッション自動作成、計画書送信)
- 連携: [02-02-project-plans.md](./02-02-project-plans.md) (計画書テーブル)

---

## 📝 メモ

- **組織所有**: AIセッションは組織（org_id）に紐づく。同一組織のメンバーはセッションを共有可能
- **Buyerのみ**: VendorはAIチャット機能を利用不可。Vendorとのやり取りは Buyer-Vendor Chat（03-02）で行う
- **ChatGPT風UX**: プロジェクト作成時にAIセッションを自動作成（02-01連携）。ユーザーはプロジェクト作成後すぐにAIチャットを開始可能
- **generate-planはプレビュー用**: DBには保存せず、contentを返却のみ。実際の保存は`POST /api/projects/{id}/send`で実行
- embedding は検索機能の拡張時に使用
- is_presentation_mode でスライド生成用のプロンプトを切り替え
- OpenAI API エラー時の適切なハンドリング必須
- ストリーミングレスポンスは Phase 2 で検討
