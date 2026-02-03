# [Task] Project Management / プロジェクト管理

## 🔗 GitLab Issue
- Link: [#31](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/31)

---

## 📝 概要

Buyerがプロジェクトを作成・編集・管理する機能。
プロジェクトのステータス遷移（Draft → In Discussion → Closed）と、対象Vendorの紐付けを含む。

**Vendor側対応**: Vendorは招待されたプロジェクトの閲覧・チャット参加が可能。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成 |
| [UC07](../UC/UC7.md) | プロジェクト計画書編集・送信開始 |
| [UC08](../UC/UC8.md) | Vendor通知（チャットルーム作成） |
| [UC10](../UC/UC10.md) | プロジェクト完了 |
| [UC11](../UC/UC11.md) | プロジェクト一覧・検索 |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [API Endpoints](../architecture/api-endpoints.md) | APIエンドポイント |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. プロジェクト作成 (Draft)
   POST /api/projects
   └─→ projects INSERT (status='draft')

2. プロジェクト編集
   PUT /api/projects/{id}
   └─→ projects UPDATE (title, description)

3. Vendor一覧取得（選択用）
   GET /api/vendors?search=xxx
   └─→ organizations SELECT (type='vendor', status='active')

4. Vendor選択・紐付け
   POST /api/projects/{id}/vendors
   └─→ project_vendors INSERT

5. 送信開始 (Draft → In Discussion)
   POST /api/projects/{id}/start-discussion
   └─→ projects UPDATE (status='in_discussion', started_at=now)
   └─→ 各Vendor用チャットルーム作成 (chat_rooms INSERT)
   └─→ Vendor通知処理（UC08 → 01-07連携）

6. プロジェクト完了 (In Discussion → Closed)
   POST /api/projects/{id}/close
   └─→ projects UPDATE (status='closed', closed_at=now)

7. プロジェクト一覧
   GET /api/projects?status=xxx
   └─→ Buyer: buyer_org_id = 自組織
   └─→ Vendor: project_vendors に自組織が含まれる
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `projects` テーブル作成
- [ ] `project_vendors` テーブル作成
- [ ] RLSポリシー設定（Buyer/Vendor両対応）
- [ ] インデックス作成（buyer_org_id, status）
- [ ] ※ `chat_rooms`, `chat_room_members` は 03-02 で作成（start-discussion時に利用）

### Backend (FastAPI)

- [ ] `GET /api/vendors` - Vendor一覧取得（選択用）
- [ ] `GET /api/projects` - 一覧取得（Buyer/Vendor両対応）
- [ ] `POST /api/projects` - 新規作成
- [ ] `GET /api/projects/{id}` - 詳細取得
- [ ] `PUT /api/projects/{id}` - 更新
- [ ] `POST /api/projects/{id}/vendors` - Vendor紐付け
- [ ] `DELETE /api/projects/{id}/vendors/{vendor_id}` - Vendor削除
- [ ] `POST /api/projects/{id}/start-discussion` - 送信開始（チャットルーム作成含む）
- [ ] `POST /api/projects/{id}/close` - 完了
- [ ] Pydantic schemas
- [ ] Service層 (`project_service.py`)
- [ ] CRUD層 (`project_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_projects.py` | Service層 |
| Services | `tests/unit/test_services/test_project_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_project_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（ステータス遷移ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | プロジェクト作成成功 | Service | status = draft |
| 2 | draft → in_discussion 遷移 | Service | 成功、started_at設定、チャットルーム作成 |
| 3 | in_discussion → closed 遷移 | Service | 成功、closed_at設定 |
| 4 | draft以外からの編集 | Service | Error |
| 5 | 不正なステータス遷移（draft → closed） | Service | Error |
| 6 | 他組織のプロジェクトアクセス | Routes | 403/404 |
| 7 | Vendor一覧取得（検索） | Service | activeなVendorのみ返却 |
| 8 | Vendor側プロジェクト一覧 | Service | 招待されたプロジェクトのみ |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/006-project-management.md` に基づき Project Management（プロジェクト管理）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC6.md, UC7.md, UC10.md, UC11.md
- DB設計: docs/architecture/database.md
- API定義: docs/architecture/api-endpoints.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`projects` テーブル:
- id (UUID, PK)
- buyer_org_id (UUID, FK → organizations.id)
- title (TEXT, NOT NULL)
- description (TEXT, nullable)
- status (TEXT: 'draft' | 'in_discussion' | 'closed', default 'draft')
- started_at (TIMESTAMP, nullable) - In Discussion開始日時
- closed_at (TIMESTAMP, nullable) - 完了日時
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

`project_vendors` テーブル:
- id (UUID, PK)
- project_id (UUID, FK → projects.id)
- vendor_org_id (UUID, FK → organizations.id)
- status (TEXT: 'pending' | 'notified' | 'read', default 'pending')
- notified_at (TIMESTAMP, nullable)
- read_at (TIMESTAMP, nullable)
- created_by, created_at, updated_by, updated_at, is_deleted

UNIQUE制約: (project_id, vendor_org_id)

### 2. FastAPI Endpoints

#### Vendor一覧（選択用）
GET /api/vendors
- Query: search?, industry?, page, limit
- Response: { items: Vendor[], total, page, limit }
- Filter: type='vendor', status='active'

#### プロジェクト一覧（Buyer/Vendor両対応）
GET /api/projects
- Query: status, search, page, limit
- Response: { items: Project[], total, page, limit }
- **Buyerの場合**: buyer_org_id = 自組織
- **Vendorの場合**: project_vendors に自組織が含まれる

POST /api/projects
- Request: { title, description? }
- Response: Project
- buyer_org_id from JWT

GET /api/projects/{id}
- Response: Project with vendors
- **Vendorもアクセス可能**（project_vendorsに含まれる場合）

PUT /api/projects/{id}
- Request: { title?, description? }
- Only if status='draft'
- **Buyerのみ**

POST /api/projects/{id}/vendors
- Request: { vendor_org_ids: UUID[] }
- Only if status='draft'

DELETE /api/projects/{id}/vendors/{vendor_org_id}
- Only if status='draft'

POST /api/projects/{id}/start-discussion
- Transition: draft → in_discussion
- Set started_at
- **各Vendor用チャットルーム作成** (chat_rooms INSERT for each vendor)
- Trigger vendor notifications (01-07連携)

POST /api/projects/{id}/close
- Transition: in_discussion → closed
- Set closed_at

### 3. レイヤー構成
- api/routes/projects.py (Controller)
- services/project_service.py (Business Logic)
- crud/project_crud.py (Data Access)
- schemas/project.py (Pydantic models)

### 4. RLSポリシー
- **projects (SELECT)**: buyer_org_id = 自組織 OR 自組織がproject_vendorsに存在
- **projects (INSERT/UPDATE/DELETE)**: buyer_org_id = 自組織
- **project_vendors**: project.buyer_org_id = 自組織 OR vendor_org_id = 自組織

## 制約
- ステータス遷移は draft → in_discussion → closed の順のみ
- draft以外は編集不可
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義
- soft delete (is_deleted=true)

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが `supabase/migrations/` に存在
- [ ] 全APIエンドポイントが正常に動作
- [ ] **Vendor一覧API**が正常に動作
- [ ] ステータス遷移が正しく機能（draft → in_discussion → closed）
- [ ] **start-discussionでチャットルームが作成される**
- [ ] **Vendor側からプロジェクト閲覧が可能**
- [ ] RLSポリシーが正しく機能（Buyer/Vendor両方）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [01-02-backend-onboarding.md](./01-02-backend-onboarding.md) (organizations, profiles テーブル)
- 後続: [02-02-project-plans.md](./02-02-project-plans.md)
- 後続: [02-03-project-attachments.md](./02-03-project-attachments.md)
- 連携: [03-02-buyer-vendor-chat.md](./03-02-buyer-vendor-chat.md) (start-discussionでチャットルーム作成)
- 連携: [05-01-notifications.md](./05-01-notifications.md) (Vendor通知)

---

## 📝 メモ

- **Vendor一覧API**: Vendor選択時に利用。statusがactiveのVendor組織のみ返却
- **Vendor側プロジェクト一覧**: project_vendors 経由で自組織が招待されたプロジェクトを取得
- **start-discussion 処理**:
  1. ステータス更新 (draft → in_discussion)
  2. 各Vendor用チャットルーム作成 (chat_rooms, chat_room_members)
  3. 通知処理トリガー (01-07連携)
- ステータス遷移の検証をService層で実装
- Vendorはプロジェクト閲覧のみ可能（編集不可）
