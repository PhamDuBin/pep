# [Task 01-10] Organization Settings

## 🔗 GitLab Issue
- Link: [#47](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/47)

---

## 📝 概要

組織管理者（owner/admin）が組織情報を更新できる機能を実装する。
更新可能な項目：name, industry, employee_count, billing_email等

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Database Design](../architecture/database.md) | organizations テーブル |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
Frontend → Backend: PATCH /api/v1/organizations/{org_id}
Backend → JWT: Verify token & check role (owner/admin)
Backend → Supabase: Update organizations table
Backend → Frontend: Updated organization
```

---

## 📋 スコープ

### Database (Supabase)

- [x] `organizations` テーブル（既存）
- [ ] RLSポリシー確認（owner/adminのみ更新可能）

### Backend (FastAPI)

- [ ] `GET /api/v1/organizations/{org_id}` - 組織情報取得
- [ ] `PATCH /api/v1/organizations/{org_id}` - 組織基本情報更新
- [ ] `GET /api/v1/organizations/{org_id}/details` - 組織詳細情報取得【追加】
- [ ] `PATCH /api/v1/organizations/{org_id}/details` - 組織詳細情報更新【追加】
- [ ] Pydantic schemas (`OrganizationUpdateRequest`, `OrganizationResponse`, `OrgDetailsUpdateRequest`, `OrgDetailsResponse`)
- [ ] Service層（`OrganizationService.update_organization()`, `update_org_details()`）
- [ ] CRUD層（`OrganizationCRUD.update_by_id()`, `update_details()`）

### Frontend (Next.js)

- [ ] Organization settings page (`/settings/organization`)
- [ ] Organization edit form component
- [ ] Role-based access control (owner/admin only)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_organizations.py` | Service層 |
| Services | `tests/unit/test_services/test_organization_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_organization_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト検証、権限確認）
- [ ] Service層テスト（更新ロジック、権限チェック）
- [ ] CRUD層テスト（UPDATE クエリ）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | owner による基本情報更新 | Service | Updated organization |
| 2 | admin による基本情報更新 | Service | Updated organization |
| 3 | member による基本情報更新 | Service | PermissionError |
| 4 | 他組織の情報更新 | Service | PermissionError |
| 5 | 不正なemail形式 | Routes | 422 ValidationError |
| 6 | 空の組織名 | Routes | 422 ValidationError |
| 7 | Buyer詳細情報取得 | Service | purpose 等を返却 |
| 8 | Vendor詳細情報取得 | Service | business_description 等を返却 |
| 9 | owner による詳細情報更新 | Service | Updated details |
| 10 | member による詳細情報更新 | Service | PermissionError |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/01-10-organization-settings.md` に基づき 組織情報更新機能 を実装してください。

## 参照ドキュメント
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Backend API Endpoints

#### GET /api/v1/organizations/{org_id}
組織情報を取得

**Response:**
```json
{
  "id": "org-uuid",
  "name": "株式会社ABC",
  "type": "buyer",
  "status": "active",
  "industry": "IT",
  "employee_count": "50-100",
  "billing_email": "billing@example.com",
  "stripe_customer_id": "cus_xxx",
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

#### PATCH /api/v1/organizations/{org_id}
組織情報を更新（owner/admin のみ）

**Request:**
```json
{
  "name": "株式会社ABC",
  "industry": "IT",
  "employee_count": "100-500",
  "billing_email": "billing@example.com"
}
```

**Response:**
```json
{
  "id": "org-uuid",
  "name": "株式会社ABC",
  "type": "buyer",
  "status": "active",
  "industry": "IT",
  "employee_count": "100-500",
  "billing_email": "billing@example.com",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

#### GET /api/v1/organizations/{org_id}/details【追加】
組織詳細情報を取得（Buyer: purpose / Vendor: business_description等）

**Response (Buyer):**
```json
{
  "org_id": "org-uuid",
  "purpose": "RFI管理の効率化",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

**Response (Vendor):**
```json
{
  "org_id": "org-uuid",
  "business_description": "ソフトウェア開発事業",
  "service_description": "Webアプリケーション開発",
  "website_url": "https://example.com",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

#### PATCH /api/v1/organizations/{org_id}/details【追加】
組織詳細情報を更新（owner/admin のみ）

**Request (Buyer):**
```json
{
  "purpose": "RFI管理の効率化（更新）"
}
```

**Request (Vendor):**
```json
{
  "business_description": "ソフトウェア開発事業",
  "service_description": "Webアプリケーション開発",
  "website_url": "https://example.com"
}
```

**Response:** 更新後の詳細情報

### 2. レイヤー構成

```
backend/
├── app/
│   ├── api/routes/organizations/
│   │   ├── __init__.py
│   │   └── organizations.py   # GET/PATCH /api/v1/organizations/{org_id}
│   ├── schemas/
│   │   └── organization.py    # OrganizationUpdateRequest, OrganizationResponse
│   ├── services/
│   │   └── organization_service.py  # update_organization(), check_permission()
│   └── crud/
│       └── organization_crud.py     # get_by_id(), update_by_id()
└── tests/
    └── unit/
        ├── test_routes/test_organizations.py
        ├── test_services/test_organization_service.py
        └── test_crud/test_organization_crud.py
```

### 3. Frontend

```
frontend/
├── src/
│   ├── app/
│   │   └── settings/
│   │       └── organization/
│   │           └── page.tsx       # Organization settings page
│   └── features/
│       └── organization/
│           ├── components/
│           │   └── OrganizationEditForm.tsx
│           └── services/
│               └── organization.service.ts
```

### 4. Business Logic

**Service層の処理:**
1. JWTから`user_id`と`org_id`を取得
2. ユーザーのroleを確認（owner または admin のみ許可）
3. `org_id`がユーザーの所属組織と一致するか確認
4. `OrganizationUpdateRequest`をバリデーション
5. `organizations`テーブルを更新
6. 更新後の組織情報を返す

**権限チェック:**
- owner: 全ての項目を更新可能
- admin: 全ての項目を更新可能
- member: 更新不可（403 Forbidden）

## 制約
- owner または admin のみ更新可能
- 他組織の情報は更新不可
- name は1文字以上255文字以内
- billing_email は有効なメールアドレス形式
- employee_count は所定の選択肢のみ（"1-10", "10-50", "50-100", "100-500", "500+"）
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- 権限チェックのテストを含める

--------------------------------------------------

---

## ✅ 完了条件

### Backend
- [ ] `GET /api/v1/organizations/{org_id}` エンドポイント実装
- [ ] `PATCH /api/v1/organizations/{org_id}` エンドポイント実装
- [ ] `GET /api/v1/organizations/{org_id}/details` エンドポイント実装【追加】
- [ ] `PATCH /api/v1/organizations/{org_id}/details` エンドポイント実装【追加】
- [ ] Pydantic schemas作成（`OrganizationUpdateRequest`, `OrganizationResponse`, `OrgDetailsUpdateRequest`, `OrgDetailsResponse`）
- [ ] Service層実装（権限チェック含む）
- [ ] CRUD層実装（organizations, buyer_org_details/vendor_org_details更新）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/test_routes/test_organizations.py` がパス
- [ ] Service層カバレッジ 80%以上

### Frontend
- [ ] Organization settings page実装
- [ ] OrganizationEditForm component実装
- [ ] Role-based access control実装（owner/adminのみ表示）
- [ ] フォームバリデーション実装

### Integration
- [ ] owner/adminによる基本情報更新 → DB更新 → 画面反映の流れが動作
- [ ] memberによるアクセス → 403 Forbiddenの流れが動作
- [ ] 他組織の情報へのアクセス → 403 Forbiddenの流れが動作
- [ ] Buyer詳細情報（purpose）の取得・更新が動作【追加】
- [ ] Vendor詳細情報（business_description等）の取得・更新が動作【追加】

---

## 🔗 関連タスク

- 前提: [01-09 User Profile Update](./01-09-user-profile-update.md)
- 関連: [01-05 Role Change & Owner Transfer](./01-05-role-change.md)
- 関連: [04-01 Subscription Management](./04-01-subscription.md)

---

## 📝 メモ

- RLSポリシーで、ユーザーは自分の所属組織の`organizations`レコードのみアクセスできるように制限する
- `stripe_customer_id`は更新不可（Stripe連携で自動管理）
- `type`（buyer/vendor）は更新不可（組織の種類は変更できない）
- `status`は管理者承認機能（01-03）でのみ変更可能
- billing_emailは決済関連の通知先として使用される

### 組織詳細情報について【追加】
- Buyer: `buyer_org_details` テーブル（purpose 等）
- Vendor: `vendor_org_details` テーブル（business_description, service_description, website_url 等）
- 詳細情報は申請承認時に `buyer_applications` / `vendor_applications` からコピーされる
- 詳細情報の更新は基本情報とは別APIで行う（責務の分離）
