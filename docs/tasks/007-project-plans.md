# [Task] Project Plans / プロジェクト計画書管理

## 🔗 GitLab Issue
- Link: (後で作成)

---

## 📝 概要

AIとのチャットで生成されたプロジェクト計画書（PDF等）を管理する機能。
計画書はSupabase Storageに保存され、選択したVendorに送信できる。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成（AI生成） |
| [UC07](../UC/UC7.md) | プロジェクト計画書編集・送信開始 |
| [Database Design](../architecture/database.md) | project_plans, project_plan_vendors |
| [API Endpoints](../architecture/api-endpoints.md) | APIエンドポイント |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. 計画書生成（AIチャットから）
   POST /api/projects/{id}/plans
   └─→ Generate PDF/Document
   └─→ Upload to Supabase Storage
   └─→ project_plans INSERT

2. 計画書一覧
   GET /api/projects/{id}/plans
   └─→ project_plans SELECT

3. 計画書ダウンロード
   GET /api/projects/{id}/plans/{plan_id}/download
   └─→ Supabase Storage signed URL

4. Vendorへ計画書送信
   POST /api/projects/{id}/plans/{plan_id}/send
   └─→ project_plan_vendors INSERT
   └─→ Vendor通知処理

5. 計画書削除
   DELETE /api/projects/{id}/plans/{plan_id}
   └─→ project_plans soft delete
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `project_plans` テーブル作成
- [ ] `project_plan_vendors` テーブル作成
- [ ] RLSポリシー設定
- [ ] Supabase Storage バケット設定

### Backend (FastAPI)

- [ ] `GET /api/projects/{id}/plans` - 一覧取得
- [ ] `POST /api/projects/{id}/plans` - 新規作成（アップロード）
- [ ] `GET /api/projects/{id}/plans/{plan_id}` - 詳細取得
- [ ] `GET /api/projects/{id}/plans/{plan_id}/download` - ダウンロードURL取得
- [ ] `DELETE /api/projects/{id}/plans/{plan_id}` - 削除
- [ ] `POST /api/projects/{id}/plans/{plan_id}/send` - Vendorへ送信
- [ ] `GET /api/projects/{id}/plans/{plan_id}/vendors` - 送信済みVendor一覧
- [ ] Pydantic schemas
- [ ] Service層 (`plan_service.py`)
- [ ] CRUD層 (`plan_crud.py`)

### Tests

- [ ] ファイルアップロードテスト
- [ ] Vendor送信テスト
- [ ] RLSテスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/007-project-plans.md` に基づき Project Plans（プロジェクト計画書管理）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC6.md, UC7.md
- DB設計: docs/architecture/database.md
- API定義: docs/architecture/api-endpoints.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`project_plans` テーブル:
- id (UUID, PK)
- project_id (UUID, FK → projects.id)
- ai_session_id (UUID, FK → ai_chat_sessions.id, nullable) - 生成元AIセッション
- title (TEXT, NOT NULL)
- file_path (TEXT, NOT NULL) - Supabase Storage path
- file_name (TEXT, NOT NULL)
- mime_type (TEXT, NOT NULL)
- file_size (INTEGER, NOT NULL) - bytes
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

`project_plan_vendors` テーブル:
- id (UUID, PK)
- plan_id (UUID, FK → project_plans.id)
- vendor_org_id (UUID, FK → organizations.id)
- sent_at (TIMESTAMP, NOT NULL)
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

UNIQUE制約: (plan_id, vendor_org_id)

### 2. Supabase Storage

バケット: `project-plans`
- Private bucket
- RLS: Buyer組織のユーザーのみアップロード可能
- Signed URLs for download

### 3. FastAPI Endpoints

GET /api/projects/{id}/plans
- Response: { items: Plan[] }
- Filter by project_id, is_deleted=false

POST /api/projects/{id}/plans
- Request: multipart/form-data (file, title, ai_session_id?)
- Upload to Supabase Storage
- Insert to project_plans
- Response: Plan

GET /api/projects/{id}/plans/{plan_id}
- Response: Plan with sent_vendors

GET /api/projects/{id}/plans/{plan_id}/download
- Response: { download_url: string } - Signed URL (expires in 1 hour)

DELETE /api/projects/{id}/plans/{plan_id}
- Soft delete (is_deleted=true)

POST /api/projects/{id}/plans/{plan_id}/send
- Request: { vendor_org_ids: UUID[] }
- Insert to project_plan_vendors for each vendor
- Trigger notification (Task 011)
- Response: { sent_count: number }

GET /api/projects/{id}/plans/{plan_id}/vendors
- Response: { vendors: VendorOrg[] }

### 4. レイヤー構成
- api/routes/plans.py (Controller)
- services/plan_service.py (Business Logic)
- crud/plan_crud.py (Data Access)
- schemas/plan.py (Pydantic models)

### 5. RLSポリシー
- project_plans: project.buyer_org_id = 自組織 OR plan_id in sent plans
- project_plan_vendors: vendor_org_id = 自組織

## 制約
- ファイルサイズ上限: 10MB
- 対応形式: PDF, DOCX, PPTX
- Vendorは送信された計画書のみ閲覧可能
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが存在
- [ ] Supabase Storage バケットが設定済み
- [ ] ファイルアップロードが動作
- [ ] ダウンロードURL取得が動作
- [ ] Vendor送信が動作
- [ ] RLSが正しく機能
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [006-project-management.md](./006-project-management.md)
- 前提: [009-ai-chat.md](./009-ai-chat.md) (ai_session_id)
- 関連: [011-notifications.md](./011-notifications.md) (送信通知)

---

## 📝 メモ

- AIセッションから生成された場合は ai_session_id を設定
- 手動アップロードの場合は ai_session_id = null
- 送信時にVendorとのチャットルームが作成される（010で実装）
