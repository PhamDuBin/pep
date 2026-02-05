# [Task] Buyer-Vendor Chat / Buyer-Vendorチャット

## 🔗 GitLab Issue
- Link: [#35](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/35)

---

## 📝 概要

プロジェクトごとにBuyerとVendor間でチャットを行う機能。
チャットルームはプロジェクト × Vendor組織の組み合わせで、`POST /api/projects/{id}/send`（02-01）実行時に自動作成される。

**Realtime対応**: Supabase Realtimeで新着メッセージをリアルタイム受信。

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
1. チャットルーム作成（02-01 send時に自動）
   POST /api/projects/{id}/send
   └─→ chat_rooms INSERT（新規Vendorのみ）

2. チャットルーム一覧取得
   GET /api/projects/{id}/chat-rooms
   └─→ chat_rooms SELECT（unread_count含む）

3. メッセージ一覧取得
   GET /api/chat-rooms/{id}/messages
   └─→ chat_messages SELECT

4. メッセージ送信
   POST /api/chat-rooms/{id}/messages
   └─→ chat_messages INSERT

5. メッセージ受信（Realtime）
   Supabase Realtime 購読
   └─→ 新メッセージをリアルタイム受信

6. 既読更新
   POST /api/chat-rooms/{id}/read
   └─→ chat_read_status UPSERT (last_read_at=now)
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `chat_rooms` テーブル作成
- [ ] `chat_messages` テーブル作成
- [ ] `chat_read_status` テーブル作成
- [ ] RLSポリシー設定
- [ ] Supabase Realtime有効化（chat_messages）

### Backend (FastAPI)

- [ ] `GET /api/projects/{id}/chat-rooms` - プロジェクトのチャットルーム一覧
- [ ] `GET /api/chat-rooms/{id}` - ルーム詳細
- [ ] `GET /api/chat-rooms/{id}/messages` - メッセージ一覧
- [ ] `POST /api/chat-rooms/{id}/messages` - メッセージ送信
- [ ] `POST /api/chat-rooms/{id}/read` - 既読更新
- [ ] Pydantic schemas
- [ ] Service層 (`chat_service.py`)
- [ ] CRUD層 (`chat_crud.py`)

**Note**: チャットルーム作成は `POST /api/projects/{id}/send`（02-01）で自動実行

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
| 1 | ルーム一覧取得（Buyer） | Service | 全ルーム + unread_count |
| 2 | ルーム一覧取得（Vendor） | Service | 自組織ルームのみ |
| 3 | メッセージ送信成功 | Service | message_id 返却 |
| 4 | 既読更新成功 | Service | last_read_at 更新 |
| 5 | 未読カウント計算 | Service | 正確な未読数 |
| 6 | 他組織のルームアクセス | Service | 403/404 Error |
| 7 | LINE風既読数計算 | Service | 正確な既読数 |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/03-02-buyer-vendor-chat.md` に基づき Buyer-Vendor Chat 機能を実装してください。

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

### 2. Supabase Realtime設定

```sql
-- chat_messagesテーブルのRealtime有効化
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
```

### 3. FastAPI Endpoints

#### GET /api/projects/{id}/chat-rooms - ルーム一覧
- Response: { rooms: ChatRoom[] }
- 各ルームに `unread_count` を含む
- **Buyer**: プロジェクトの全ルーム
- **Vendor**: 自組織のルームのみ

#### GET /api/chat-rooms/{id} - ルーム詳細
- Response: ChatRoom with project info

#### GET /api/chat-rooms/{id}/messages - メッセージ一覧
- Query: before? (datetime), limit (default 50)
- Response: { messages: Message[], has_more: boolean }
- Order by created_at DESC（最新から）
- 各メッセージに `read_count`（LINE風既読数）を含む

#### POST /api/chat-rooms/{id}/messages - メッセージ送信
- Request: { content, message_type?, file_url? }
- Response: Message

#### POST /api/chat-rooms/{id}/read - 既読更新
- Update last_read_at to now()
- Response: { success: true, last_read_at }

### 4. 未読カウント計算

```sql
-- ユーザーの未読件数
SELECT COUNT(*) FROM chat_messages
WHERE room_id = :room_id
  AND created_at > COALESCE(:last_read_at, '1970-01-01')
  AND sender_id != :user_id
```

### 5. 既読カウント計算（LINE風）

```sql
-- このメッセージを既読にしたユーザー数（送信者除く）
SELECT COUNT(*) FROM chat_read_status
WHERE room_id = :room_id
  AND last_read_at >= :message_created_at
  AND user_id != :sender_id
```

### 6. レイヤー構成
- api/routes/chat.py (Controller)
- services/chat_service.py (Business Logic)
- crud/chat_crud.py (Data Access)
- schemas/chat.py (Pydantic models)

### 7. RLSポリシー
- chat_rooms: buyer_org_id = 自組織 OR vendor_org_id = 自組織
- chat_messages: room経由で自組織のルームのみ
- chat_read_status: user_id = 自分

## 制約
- チャットルームは02-01のsend時に自動作成
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
- [ ] **Supabase Realtimeが有効化されている**
- [ ] チャットルーム一覧取得が動作（unread_count含む）
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

- 前提: [02-01-project-management.md](./02-01-project-management.md)（send時にチャットルーム作成）
- 関連: [05-01-notifications.md](./05-01-notifications.md)（新着通知）

---

## 📝 メモ

- **チャットルーム自動作成**: 02-01の`POST /api/projects/{id}/send`実行時に自動作成
- **Realtime対応**: Supabase Realtimeで新着メッセージをリアルタイム受信（フロントエンド実装）
- **未読管理**:
  - プロジェクト単位: `GET /api/projects` の `chat_unread_count`（02-01）
  - ルーム単位: `GET /api/projects/{id}/chat-rooms` の `unread_count`
- **LINE風既読**: 各メッセージに `read_count`（何人が既読か）
- **before パラメータ**: 無限スクロール用。指定日時より前のメッセージを取得
