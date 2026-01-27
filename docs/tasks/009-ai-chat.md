# [Task] AI Chat Sessions / AIチャットセッション

## 🔗 GitLab Issue
- Link: (後で作成)

---

## 📝 概要

BuyerがAIとチャットしてプロジェクト計画書を生成する機能。
OpenAI APIを利用し、チャット履歴をDBに保存。生成物はproject_plansに連携。

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
1. セッション作成
   POST /api/ai/sessions
   └─→ ai_chat_sessions INSERT

2. メッセージ送信 & AI応答
   POST /api/ai/sessions/{id}/messages
   └─→ ai_chat_messages INSERT (role='user')
   └─→ OpenAI API call
   └─→ ai_chat_messages INSERT (role='assistant')

3. セッション履歴取得
   GET /api/ai/sessions/{id}/messages
   └─→ ai_chat_messages SELECT

4. 計画書生成（プレゼンテーションモード）
   POST /api/ai/sessions/{id}/generate-plan
   └─→ Generate PDF from chat content
   └─→ Upload to Storage
   └─→ project_plans INSERT

5. セッション一覧
   GET /api/ai/sessions
   └─→ ai_chat_sessions SELECT
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `ai_chat_sessions` テーブル作成
- [ ] `ai_chat_messages` テーブル作成
- [ ] pgvector 拡張有効化（embedding用）
- [ ] RLSポリシー設定

### Backend (FastAPI)

- [ ] `GET /api/ai/sessions` - セッション一覧
- [ ] `POST /api/ai/sessions` - セッション作成
- [ ] `GET /api/ai/sessions/{id}` - セッション詳細
- [ ] `DELETE /api/ai/sessions/{id}` - セッション削除
- [ ] `GET /api/ai/sessions/{id}/messages` - メッセージ履歴
- [ ] `POST /api/ai/sessions/{id}/messages` - メッセージ送信
- [ ] `POST /api/ai/sessions/{id}/generate-plan` - 計画書生成
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
| 3 | 他ユーザーのセッションアクセス | Service | Error |
| 4 | 計画書生成成功 | Service | plan_id 返却 |
| 5 | OpenAI APIエラー時 | Service | 適切なエラーハンドリング |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/009-ai-chat.md` に基づき AI Chat Sessions（AIチャット）機能を実装してください。

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
- user_id (UUID, FK → profiles.id) - セッションオーナー
- project_id (UUID, FK → projects.id, nullable)
- title (TEXT, nullable)
- is_presentation_mode (BOOLEAN, default false) - スライド生成モード
- created_by (UUID, FK → profiles.id)
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

GET /api/ai/sessions
- Query: project_id?, page, limit
- Response: { items: Session[], total }
- Filter by user_id from JWT

POST /api/ai/sessions
- Request: { project_id?, title?, is_presentation_mode? }
- Response: Session

GET /api/ai/sessions/{id}
- Response: Session

DELETE /api/ai/sessions/{id}
- Soft delete

GET /api/ai/sessions/{id}/messages
- Response: { messages: Message[] }
- Order by created_at ASC

POST /api/ai/sessions/{id}/messages
- Request: { content: string }
- Process:
  1. Insert user message
  2. Call OpenAI API with conversation history
  3. Insert assistant message
  4. Generate embedding (async, optional)
- Response: { user_message: Message, assistant_message: Message }
- Stream response support (optional)

POST /api/ai/sessions/{id}/generate-plan
- Request: { title: string }
- Generate plan document from conversation
- Upload to Supabase Storage
- Create project_plans record
- Response: Plan

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
- ai_chat_sessions: user_id = 自分
- ai_chat_messages: session.user_id = 自分

## 制約
- セッションは作成者のみアクセス可能
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
- [ ] 計画書生成が動作（project_plansに連携）
- [ ] RLSが正しく機能
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md) (profiles)
- 前提: [006-project-management.md](./006-project-management.md) (projects)
- 後続: [007-project-plans.md](./007-project-plans.md) (計画書生成連携)

---

## 📝 メモ

- embedding は検索機能の拡張時に使用
- is_presentation_mode でスライド生成用のプロンプトを切り替え
- OpenAI API エラー時の適切なハンドリング必須
- ストリーミングレスポンスは Phase 2 で検討
