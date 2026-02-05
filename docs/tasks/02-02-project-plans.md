# [Task] Project Plans / プロジェクト計画書管理

## 🔗 GitLab Issue
- Link: [#32](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/32)

---

## 📝 概要

AIとのチャットで生成されたプロジェクト計画書を管理する機能。
計画書はSupabase Storageに保存され、`POST /api/projects/{id}/send`（02-01）で選択したVendorに送信される。

**計画書単位のVendor管理**: 各計画書バージョンをどのVendorに送信したかを`project_plan_vendors`で管理。計画書v1はVendor A,B、v2はVendor A,Cのような運用が可能。

**Vendor側対応**: Vendorは`project_plan_vendors`経由で送信された計画書のみ閲覧可能。

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
1. 計画書送信（02-01から呼び出し）
   POST /api/projects/{id}/send
   └─→ Markdown content → Supabase Storage に保存
   └─→ project_plans INSERT
   └─→ project_plan_vendors INSERT（各Vendor）

2. 計画書一覧取得
   GET /api/projects/{id}/plans
   └─→ project_plans SELECT
   └─→ Buyer: プロジェクトの全計画書
   └─→ Vendor: project_plan_vendors経由で送信された計画書のみ

3. 計画書詳細取得
   GET /api/projects/{id}/plans/{plan_id}
   └─→ project_plans SELECT
   └─→ 送信先Vendor一覧も含む（Buyerのみ）

4. 計画書ダウンロード
   GET /api/projects/{id}/plans/{plan_id}/download
   └─→ Supabase Storage signed URL 発行

5. 計画書削除（Buyerのみ、未送信の場合のみ）
   DELETE /api/projects/{id}/plans/{plan_id}
   └─→ project_plans soft delete
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `project_plans` テーブル作成
- [ ] `project_plan_vendors` テーブル作成
- [ ] RLSポリシー設定
- [ ] Supabase Storage バケット設定 (`project-plans`)

### Backend (FastAPI)

- [ ] `GET /api/projects/{id}/plans` - 一覧取得
- [ ] `GET /api/projects/{id}/plans/{plan_id}` - 詳細取得
- [ ] `GET /api/projects/{id}/plans/{plan_id}/download` - ダウンロードURL取得
- [ ] `DELETE /api/projects/{id}/plans/{plan_id}` - 削除（未送信のみ）
- [ ] Pydantic schemas
- [ ] Service層 (`plan_service.py`)
- [ ] CRUD層 (`plan_crud.py`)

**Note**: 計画書作成・Vendor送信は `POST /api/projects/{id}/send`（02-01）で実行

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_plans.py` | Service層 |
| Services | `tests/unit/test_services/test_plan_service.py` | CRUD層, Storage |
| CRUD | `tests/unit/test_crud/test_plan_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（アクセス制御ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 計画書一覧取得（Buyer） | Service | 全計画書返却 |
| 2 | 計画書一覧取得（Vendor） | Service | 送信された計画書のみ返却 |
| 3 | 計画書詳細取得（Buyer） | Service | 送信先Vendor一覧含む |
| 4 | 計画書詳細取得（Vendor） | Service | 送信先情報なし |
| 5 | 未送信計画書へのVendorアクセス | Service | 403/404 Error |
| 6 | ダウンロードURL取得 | Service | Signed URL返却 |
| 7 | 計画書削除（未送信） | Service | 成功 |
| 8 | 計画書削除（送信済み） | Service | 409 Error |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/02-02-project-plans.md` に基づき Project Plans（プロジェクト計画書管理）機能を実装してください。

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
- Path format: `{project_id}/{plan_id}.md`
- RLS: Buyer組織のユーザーのみアップロード可能

### 3. FastAPI Endpoints

#### GET /api/projects/{id}/plans - 計画書一覧
- Response: { items: Plan[] }
- **Buyerの場合**: プロジェクトの全計画書
- **Vendorの場合**: project_plan_vendors経由で送信された計画書のみ

#### GET /api/projects/{id}/plans/{plan_id} - 計画書詳細
- Response: Plan
- **Buyerの場合**: 送信先Vendor一覧（vendors）を含む
- **Vendorの場合**: 送信先情報なし

#### GET /api/projects/{id}/plans/{plan_id}/download - ダウンロードURL
- Response: { download_url: string }
- Signed URL (有効期限: 1時間)

#### DELETE /api/projects/{id}/plans/{plan_id} - 削除
- project_plan_vendorsにレコードがない場合のみ削除可能
- Soft delete (is_deleted=true)
- **Buyerのみ**

**Note**: 計画書作成・Vendor送信は `POST /api/projects/{id}/send`（02-01）で実行

### 4. レイヤー構成
- api/routes/plans.py (Controller)
- services/plan_service.py (Business Logic)
- crud/plan_crud.py (Data Access)
- schemas/plan.py (Pydantic models)

### 5. RLSポリシー

**project_plans:**
- SELECT (Buyer): project.buyer_org_id = 自組織
- SELECT (Vendor): plan_id が project_plan_vendors 経由で自組織に送信済み
- INSERT/UPDATE/DELETE: project.buyer_org_id = 自組織

**project_plan_vendors:**
- SELECT (Buyer): plan.project.buyer_org_id = 自組織
- SELECT (Vendor): vendor_org_id = 自組織
- INSERT/DELETE: plan.project.buyer_org_id = 自組織

## 制約
- Vendorは送信された計画書のみ閲覧可能
- 送信済み計画書は削除不可
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
- [ ] 計画書一覧取得が動作（Buyer/Vendor両対応）
- [ ] ダウンロードURL取得が動作
- [ ] 未送信計画書の削除が動作
- [ ] 送信済み計画書の削除が拒否される
- [ ] RLSが正しく機能（Buyer: 全計画書 / Vendor: 送信分のみ）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [02-01-project-management.md](./02-01-project-management.md) (計画書作成・送信はこちらで実行)
- 前提: [03-01-ai-chat.md](./03-01-ai-chat.md) (ai_session_id)
- 関連: [05-01-notifications.md](./05-01-notifications.md) (送信通知)

---

## 📝 メモ

- **計画書作成は02-01のsend APIで実行**: 本タスクはテーブル・Storage設定と閲覧系APIのみ
- **計画書単位のVendor管理**: `project_plan_vendors`で各バージョンの送信先を管理
  - 計画書v1 → Vendor A, B
  - 計画書v2 → Vendor A, C
  - Vendor Aはv1,v2両方閲覧可、Vendor Bはv1のみ、Vendor Cはv2のみ
- **AIセッション連携**: ai_session_id で生成元セッションを追跡（手動作成の場合はnull）
- **Markdown形式**: 計画書はMarkdown形式で保存、フロントエンドでレンダリング
