# [Task] Project Management / プロジェクト管理

## 🔗 GitLab Issue
- Link: (後で作成)

---

## 📝 概要

Buyerがプロジェクトを作成・編集・管理する機能。
プロジェクトのステータス遷移（Draft → In Discussion → Closed）と、対象Vendorの紐付けを含む。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成 |
| [UC07](../UC/UC7.md) | プロジェクト計画書編集・送信開始 |
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

3. Vendor選択・紐付け
   POST /api/projects/{id}/vendors
   └─→ project_vendors INSERT

4. 送信開始 (Draft → In Discussion)
   POST /api/projects/{id}/start-discussion
   └─→ projects UPDATE (status='in_discussion')
   └─→ Vendor通知処理（UC08）

5. プロジェクト完了 (In Discussion → Closed)
   POST /api/projects/{id}/close
   └─→ projects UPDATE (status='closed', closed_at=now)

6. プロジェクト一覧
   GET /api/projects?status=xxx
   └─→ projects SELECT with filters
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `projects` テーブル作成
- [ ] `project_vendors` テーブル作成
- [ ] RLSポリシー設定（Buyer組織単位）
- [ ] インデックス作成（buyer_org_id, status）

### Backend (FastAPI)

- [ ] `GET /api/projects` - 一覧取得
- [ ] `POST /api/projects` - 新規作成
- [ ] `GET /api/projects/{id}` - 詳細取得
- [ ] `PUT /api/projects/{id}` - 更新
- [ ] `POST /api/projects/{id}/vendors` - Vendor紐付け
- [ ] `DELETE /api/projects/{id}/vendors/{vendor_id}` - Vendor削除
- [ ] `POST /api/projects/{id}/start-discussion` - 送信開始
- [ ] `POST /api/projects/{id}/close` - 完了
- [ ] Pydantic schemas
- [ ] Service層 (`project_service.py`)
- [ ] CRUD層 (`project_crud.py`)

### Tests

- [ ] ステータス遷移テスト
- [ ] RLSテスト（他組織のプロジェクトにアクセス不可）
- [ ] APIエンドポイントテスト

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

GET /api/projects
- Query: status, search, page, limit
- Response: { items: Project[], total, page, limit }
- Filter by buyer_org_id from JWT

POST /api/projects
- Request: { title, description? }
- Response: Project
- buyer_org_id from JWT

GET /api/projects/{id}
- Response: Project with vendors

PUT /api/projects/{id}
- Request: { title?, description? }
- Only if status='draft'

POST /api/projects/{id}/vendors
- Request: { vendor_org_ids: UUID[] }
- Only if status='draft'

DELETE /api/projects/{id}/vendors/{vendor_org_id}
- Only if status='draft'

POST /api/projects/{id}/start-discussion
- Transition: draft → in_discussion
- Set started_at
- Trigger vendor notifications (Task 011)

POST /api/projects/{id}/close
- Transition: in_discussion → closed
- Set closed_at

### 3. レイヤー構成
- api/routes/projects.py (Controller)
- services/project_service.py (Business Logic)
- crud/project_crud.py (Data Access)
- schemas/project.py (Pydantic models)

### 4. RLSポリシー
- projects: buyer_org_id = 自組織 OR vendor_org_id in project_vendors
- project_vendors: project_id経由で自組織のプロジェクトのみ

## 制約
- ステータス遷移は draft → in_discussion → closed の順のみ
- draft以外は編集不可
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義
- soft delete (is_deleted=true)

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが `supabase/migrations/` に存在
- [ ] 全APIエンドポイントが正常に動作
- [ ] ステータス遷移が正しく機能（draft → in_discussion → closed）
- [ ] RLSポリシーが正しく機能
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md) (organizations, profiles テーブル)
- 後続: [007-project-plans.md](./007-project-plans.md)
- 後続: [008-project-attachments.md](./008-project-attachments.md)
- 後続: [011-notifications.md](./011-notifications.md)

---

## 📝 メモ

- Vendorから見たプロジェクト一覧は project_vendors 経由で取得
- start-discussion 実行時に通知処理（011）をトリガー
- ステータス遷移の検証をService層で実装
