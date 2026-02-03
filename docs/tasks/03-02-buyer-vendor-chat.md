# [Task] Buyer-Vendor Chat / Buyer-Vendorチャット

## 🔗 GitLab Issue
- Link: (後で作成)

---

## 📝 概要

プロジェクトごとにBuyerとVendor間でチャットを行う機能。
チャットルームはプロジェクト × Vendor組織の組み合わせで作成され、未読管理も行う。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC09](../UC/UC9.md) | ベンダーとのチャット協議 |
| [UC12](../UC/UC12.md) | チャット新着確認 |
| [Database Design](../architecture/database.md) | chat_rooms, chat_messages, chat_read_status |
| [API Endpoints](../architecture/api-endpoints.md) | APIエンドポイント |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. チャットルーム作成（プロジェクト送信開始時）
   POST /api/projects/{id}/chat-rooms
   └─→ chat_rooms INSERT
   └─→ chat_room_members INSERT (Buyer/Vendor users)

2. メッセージ送信
   POST /api/chat-rooms/{id}/messages
   └─→ chat_messages INSERT
   └─→ 相手側の未読更新

3. メッセージ一覧取得
   GET /api/chat-rooms/{id}/messages
   └─→ chat_messages SELECT

4. 既読更新
   POST /api/chat-rooms/{id}/read
   └─→ chat_read_status UPSERT (last_read_at=now)

5. 未読サマリ取得
   GET /api/chat/unread-summary
   └─→ 各ルームの未読件数集計
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `chat_rooms` テーブル作成
- [ ] `chat_room_members` テーブル作成
- [ ] `chat_messages` テーブル作成
- [ ] `chat_read_status` テーブル作成
- [ ] RLSポリシー設定
- [ ] Supabase Realtime設定

### Backend (FastAPI)

- [ ] `GET /api/projects/{id}/chat-rooms` - プロジェクトのチャットルーム一覧
- [ ] `POST /api/projects/{id}/chat-rooms` - ルーム作成
- [ ] `GET /api/chat-rooms/{id}` - ルーム詳細
- [ ] `GET /api/chat-rooms/{id}/messages` - メッセージ一覧
- [ ] `POST /api/chat-rooms/{id}/messages` - メッセージ送信
- [ ] `POST /api/chat-rooms/{id}/read` - 既読更新
- [ ] `GET /api/chat/unread-summary` - 未読サマリ
- [ ] Pydantic schemas
- [ ] Service層 (`chat_service.py`)
- [ ] CRUD層 (`chat_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_chat.py` | Service層 |
| Services | `tests/unit/test_services/test_chat_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_chat_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（メッセージ送信・既読管理ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | チャットルーム作成成功 | Service | room_id 返却 |
| 2 | メッセージ送信成功 | Service | message_id 返却 |
| 3 | 既読更新成功 | Service | last_read_at 更新 |
| 4 | 未読カウント計算 | Service | 正確な未読数 |
| 5 | 他組織のルームアクセス | Service | Error |
| 6 | LINE風既読数計算 | Service | 正確な既読数 |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/010-buyer-vendor-chat.md` に基づき Buyer-Vendor Chat 機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC9.md, UC12.md
- DB設計: docs/architecture/database.md
- API定義: docs/architecture/api-endpoints.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`chat_rooms` テーブル:
- id (UUID, PK)
- project_id (UUID, FK → projects.id)
- buyer_org_id (UUID, FK → organizations.id)
- vendor_org_id (UUID, FK → organizations.id)
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

UNIQUE制約: (project_id, vendor_org_id)

`chat_room_members` テーブル:
- id (UUID, PK)
- room_id (UUID, FK → chat_rooms.id)
- user_id (UUID, FK → profiles.id)
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

UNIQUE制約: (room_id, user_id)

`chat_messages` テーブル:
- id (UUID, PK)
- room_id (UUID, FK → chat_rooms.id)
- sender_id (UUID, FK → profiles.id)
- content (TEXT, NOT NULL)
- message_type (TEXT: 'text' | 'file' | 'system', default 'text')
- file_url (TEXT, nullable)
- created_by (UUID, FK → profiles.id) - = sender_id
- created_at, updated_at, updated_by, is_deleted

`chat_read_status` テーブル:
- id (UUID, PK)
- room_id (UUID, FK → chat_rooms.id)
- user_id (UUID, FK → profiles.id)
- last_read_at (TIMESTAMP, NOT NULL)
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

UNIQUE制約: (room_id, user_id)

### 2. FastAPI Endpoints

GET /api/projects/{id}/chat-rooms
- Response: { rooms: ChatRoom[] }
- Include unread_count for each room

POST /api/projects/{id}/chat-rooms
- Request: { vendor_org_id: UUID }
- Create room + add members (Buyer org users + Vendor org users)
- Response: ChatRoom

GET /api/chat-rooms/{id}
- Response: ChatRoom with members

GET /api/chat-rooms/{id}/messages
- Query: before?, limit (default 50)
- Response: { messages: Message[], has_more: boolean }
- Order by created_at DESC (newest first)
- Include read_count for each message (LINE-style)

POST /api/chat-rooms/{id}/messages
- Request: { content: string, message_type?: string, file_url?: string }
- Response: Message

POST /api/chat-rooms/{id}/read
- Update last_read_at to now()
- Response: { success: true }

GET /api/chat/unread-summary
- Response: { total_unread: number, rooms: [{ room_id, unread_count }] }
- Calculate: count of messages where created_at > last_read_at

### 3. 既読カウント計算（LINE風）

各メッセージの既読数を計算:
```sql
SELECT COUNT(*) FROM chat_read_status
WHERE room_id = :room_id
  AND last_read_at >= :message_created_at
  AND user_id != :sender_id
```

### 4. Realtime (Optional - Phase 2)

Supabase Realtime で新着メッセージを購読:
- Channel: `chat_room:{room_id}`
- Event: INSERT on chat_messages

### 5. レイヤー構成
- api/routes/chat.py (Controller)
- services/chat_service.py (Business Logic)
- crud/chat_crud.py (Data Access)
- schemas/chat.py (Pydantic models)

### 6. RLSポリシー
- chat_rooms: buyer_org_id = 自組織 OR vendor_org_id = 自組織
- chat_room_members: room経由で自組織のルームのみ
- chat_messages: room経由で自組織のルームのみ
- chat_read_status: user_id = 自分

## 制約
- メンバーは Buyer組織全員 + Vendor組織全員
- メッセージは削除不可（soft delete のみ）
- ファイル送信時は file_url に Storage URL を設定
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが存在
- [ ] チャットルーム作成が動作
- [ ] メッセージ送信・取得が動作
- [ ] 既読更新が動作
- [ ] 未読カウントが正しく計算される
- [ ] LINE風既読カウントが動作
- [ ] RLSが正しく機能
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [02-01-project-management.md](./02-01-project-management.md)
- 関連: [01-07-notifications.md](./01-07-notifications.md) (新着通知)

---

## 📝 メモ

- チャットルームはプロジェクト送信開始時に自動作成
- メンバーは組織に所属するアクティブユーザー全員
- 新メンバー追加時はchat_room_membersに追加必要
- Realtime機能はPhase 2で実装
