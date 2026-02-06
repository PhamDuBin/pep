# [Task] Admin Application Approval / 管理者：申請承認

## 🔗 GitLab Issue
- Link: [#53](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/53)

---

## 📝 概要

システム管理者がBuyer/Vendorの登録申請を承認・却下する機能。
専用の管理画面（別システム）からアクセス。

**認証方式**: 専用ログイン画面（メインシステムとは分離）

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC03](../UC/UC3.md) | Buyer審査・承認 |
| [UC04](../UC/UC4.md) | Vendor審査・承認 |
| [Database Design](../architecture/database.md) | organizations, profiles |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. 管理者ログイン
   POST /api/admin/auth/login
   └─→ 管理者専用JWT発行

2. 申請一覧取得
   GET /api/admin/applications
   └─→ organizations WHERE status='pending'

3. 申請詳細取得
   GET /api/admin/applications/{id}
   └─→ 組織情報 + 申請者情報

4. 承認
   POST /api/admin/applications/{id}/approve
   └─→ organizations UPDATE (status='active')
   └─→ 承認通知メール送信

5. 却下
   POST /api/admin/applications/{id}/reject
   └─→ organizations UPDATE (status='rejected')
   └─→ 却下通知メール送信（理由付き）
```

---

## 📋 スコープ

### 移行タスク（01-03からの統合）

> **Note**: 01-03-application-approval.md の実装を本タスクに統合する

- [ ] 既存の `api/routes/admin/applications.py` を管理者専用認証に変更
- [ ] 既存の `services/application_service.py` を `admin_application_service.py` にリネーム/移行
- [ ] 既存の `crud/application_crud.py` を `admin_crud.py` に統合
- [ ] `is_platform_admin` 判定を `admin_users` テーブル認証に置き換え
- [ ] 既存のテストを新しい認証方式に対応
- [ ] 01-03-application-approval.md を廃止（本タスクに統合済みの旨を記載）

### Database (Supabase)

- [ ] `admin_users` テーブル作成（管理者専用）
- [ ] RLSポリシー設定（admin_usersのみアクセス可）

### Backend (FastAPI)

- [ ] `POST /api/admin/auth/login` - 管理者ログイン
- [ ] `POST /api/admin/auth/logout` - ログアウト
- [ ] `GET /api/admin/auth/me` - 現在の管理者情報
- [ ] `GET /api/admin/applications` - 申請一覧
- [ ] `GET /api/admin/applications/{id}` - 申請詳細
- [ ] `POST /api/admin/applications/{id}/approve` - 承認
- [ ] `POST /api/admin/applications/{id}/reject` - 却下
- [ ] Pydantic schemas
- [ ] Service層 (`admin_application_service.py`)
- [ ] CRUD層 (`admin_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_admin_applications.py` | Service層 |
| Services | `tests/unit/test_services/test_admin_application_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_admin_crud.py` | Supabase client |

- [ ] Routes層テスト
- [ ] Service層テスト
- [ ] CRUD層テスト

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 管理者ログイン成功 | Service | JWT返却 |
| 2 | 管理者ログイン失敗（無効な認証情報） | Service | 401 Error |
| 3 | 申請一覧取得 | Service | pending組織一覧 |
| 4 | 承認成功 | Service | status='active' |
| 5 | 却下成功 | Service | status='rejected' |
| 6 | 一般ユーザーからのアクセス | Routes | 403 Forbidden |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/06-01-admin-application-approval.md` に基づき Admin Application Approval（管理者：申請承認）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC3.md, UC4.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`admin_users` テーブル:
- id (UUID, PK)
- email (TEXT, UNIQUE, NOT NULL)
- password_hash (TEXT, NOT NULL)
- name (TEXT, NOT NULL)
- is_active (BOOLEAN, default true)
- created_at, updated_at, is_deleted

### 2. FastAPI Endpoints

#### POST /api/admin/auth/login - 管理者ログイン
- Request: { email, password }
- Response: { access_token, admin: AdminUser }
- **管理者専用JWT発行**（メインシステムとは別）

#### POST /api/admin/auth/logout - ログアウト
- Response: { success: true }

#### GET /api/admin/auth/me - 現在の管理者情報
- Response: AdminUser

#### GET /api/admin/applications - 申請一覧
- Query: status? (pending | approved | rejected), type? (buyer | vendor), page, limit
- Response: { items: Application[], total }
- デフォルト: status=pending

#### GET /api/admin/applications/{id} - 申請詳細
- Response: Application with applicant info

#### POST /api/admin/applications/{id}/approve - 承認
- Request: { note?: string }
- Response: { success: true, organization: Organization }
- organizations.status → 'active'
- 承認通知メール送信

#### POST /api/admin/applications/{id}/reject - 却下
- Request: { reason: string }
- Response: { success: true }
- organizations.status → 'rejected'
- 却下通知メール送信（理由付き）

### 3. レイヤー構成
- api/routes/admin/auth.py (Controller)
- api/routes/admin/applications.py (Controller)
- services/admin_application_service.py (Business Logic)
- crud/admin_crud.py (Data Access)
- schemas/admin.py (Pydantic models)

### 4. 認証
- 管理者専用のJWT（メインシステムとは異なるsecret）
- `admin_users` テーブルで認証
- Middleware: `get_current_admin` 依存性

## 制約
- 管理者認証はメインシステムと完全分離
- 承認/却下時は必ずメール通知
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
- [ ] 管理者ログインが動作
- [ ] 申請一覧・詳細取得が動作
- [ ] 承認処理が動作（status更新 + メール）
- [ ] 却下処理が動作（status更新 + メール）
- [ ] 一般ユーザーからのアクセスが拒否される
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- **統合元**: [01-03-application-approval.md](./01-03-application-approval.md)（既存実装を本タスクに移行）
- 連携: [05-01-notifications.md](./05-01-notifications.md)（承認/却下通知）

---

## 📝 メモ

- **01-03からの移行**: 既存の承認機能（`is_platform_admin`ベース）を管理者専用認証に移行
- **専用ログイン**: 管理者はメインシステムとは別の認証
- **admin_users**: Supabase Authは使用せず、独自テーブルで管理
- **JWT分離**: 管理者JWTと一般ユーザーJWTは異なるsecretを使用
- **監査ログ**: Phase 3で対応予定
