# [Task] Project Attachments / プロジェクト添付ファイル

> **[保留] この機能は現時点で実装対象外です / This feature is currently out of scope.**

## 🔗 GitLab Issue
- Link: [#33](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/33)

---

## 📝 概要

プロジェクトに手動で添付するファイル（参考資料、仕様書等）を管理する機能。
AIが生成した計画書とは別に、Buyerが任意のファイルをアップロードできる。

**Vendor側対応**: In Discussion後、Vendorはプロジェクトに紐づく添付ファイルを閲覧可能（project_vendors経由）。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成 |
| [UC07](../UC/UC7.md) | プロジェクト計画書編集・送信開始 |
| [Database Design](../architecture/database.md) | project_attachments |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. ファイルアップロード
   POST /api/projects/{id}/attachments
   └─→ Upload to Supabase Storage
   └─→ project_attachments INSERT

2. 添付ファイル一覧
   GET /api/projects/{id}/attachments
   └─→ project_attachments SELECT

3. ファイルダウンロード
   GET /api/projects/{id}/attachments/{attachment_id}/download
   └─→ Supabase Storage signed URL

4. ファイル削除
   DELETE /api/projects/{id}/attachments/{attachment_id}
   └─→ project_attachments soft delete
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `project_attachments` テーブル作成
- [ ] RLSポリシー設定
- [ ] Supabase Storage バケット設定

### Backend (FastAPI)

- [ ] `GET /api/projects/{id}/attachments` - 一覧取得
- [ ] `POST /api/projects/{id}/attachments` - アップロード
- [ ] `GET /api/projects/{id}/attachments/{attachment_id}/download` - ダウンロード
- [ ] `DELETE /api/projects/{id}/attachments/{attachment_id}` - 削除
- [ ] Pydantic schemas
- [ ] Service層 (`attachment_service.py`)
- [ ] CRUD層 (`attachment_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_attachments.py` | Service層 |
| Services | `tests/unit/test_services/test_attachment_service.py` | CRUD層, Storage |
| CRUD | `tests/unit/test_crud/test_attachment_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（アップロード/削除ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | ファイルアップロード成功 | Service | attachment_id 返却 |
| 2 | サイズ超過ファイル（50MB超） | Service | Error |
| 3 | draft以外でのアップロード | Service | Error |
| 4 | 他ユーザーによる削除（Admin以外） | Service | Error |
| 5 | ダウンロードURL取得 | Service | Signed URL 返却 |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/008-project-attachments.md` に基づき Project Attachments（添付ファイル管理）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC6.md, UC7.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`project_attachments` テーブル:
- id (UUID, PK)
- project_id (UUID, FK → projects.id)
- file_name (TEXT, NOT NULL) - 元のファイル名
- file_path (TEXT, NOT NULL) - Supabase Storage path
- mime_type (TEXT, NOT NULL)
- file_size (INTEGER, NOT NULL) - bytes
- created_by (UUID, FK → profiles.id) - アップロードしたユーザー
- created_at, updated_at, updated_by, is_deleted

### 2. Supabase Storage

バケット: `project-attachments`
- Private bucket
- RLS: プロジェクト関係者のみアクセス可能
- Signed URLs for download

### 3. FastAPI Endpoints

GET /api/projects/{id}/attachments
- Response: { items: Attachment[] }
- Filter by project_id, is_deleted=false
- **Buyerの場合**: 全添付ファイルを返却
- **Vendorの場合**: In Discussion後、project_vendorsに含まれる場合のみ閲覧可能

POST /api/projects/{id}/attachments
- Request: multipart/form-data (file)
- Upload to Supabase Storage
- Insert to project_attachments
- Response: Attachment

GET /api/projects/{id}/attachments/{attachment_id}/download
- Response: { download_url: string } - Signed URL (expires in 1 hour)

DELETE /api/projects/{id}/attachments/{attachment_id}
- Soft delete (is_deleted=true)
- Only if user is uploader or admin

### 4. レイヤー構成
- api/routes/attachments.py (Controller)
- services/attachment_service.py (Business Logic)
- crud/attachment_crud.py (Data Access)
- schemas/attachment.py (Pydantic models)

### 5. RLSポリシー
- project_attachments: project.buyer_org_id = 自組織 OR 自組織がproject_vendorsに存在

## 制約
- ファイルサイズ上限: 50MB
- 対応形式: PDF, DOCX, XLSX, PPTX, PNG, JPG, ZIP
- draft状態のプロジェクトでのみアップロード可能
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- Supabase Storageはモック使用

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが存在
- [ ] Supabase Storage バケットが設定済み
- [ ] ファイルアップロードが動作
- [ ] ダウンロードURL取得が動作
- [ ] RLSが正しく機能
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [02-01-project-management.md](./02-01-project-management.md)

---

## 📝 メモ

- project_plans との違い: こちらは手動アップロード、plansはAI生成
- In Discussion 後はVendorも閲覧可能
- 削除はアップロードしたユーザーまたはAdminのみ
