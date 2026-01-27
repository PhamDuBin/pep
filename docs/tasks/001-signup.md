# [Task] Self-Signup / 新規登録機能

## 🔗 GitLab Issue
- Link: https://gitlab.i-stech.net:9080/bbs/pep/-/issues/26

---

## 📝 概要

新規ユーザー（Buyer/Vendor）がメールアドレスで登録し、組織と申請を作成する機能。

登録完了時点では全て `pending` 状態。Platform Admin の承認後にサービス利用可能となる。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Self-Signup Process](../workflows/account.md#13-self-signup-process--新規登録フロー) | ワークフロー詳細 |
| [Record Creation Overview](../workflows/account.md#record-creation-overview--レコード作成タイミング概要) | 作成タイミング |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Authentication Flow](../architecture/auth.md) | 認証フロー |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. Frontend → Supabase Auth: signUp(email, password)
   └─→ auth.users 作成

2. Frontend → FastAPI: POST /auth/signup { user_id, org_type, ... }
   └─→ create_signup RPC 呼び出し
       ├─→ organizations INSERT (status='pending')
       ├─→ profiles INSERT (status='pending', role='owner')
       └─→ applications INSERT (status='pending')

3. ユーザーはメール確認 + 承認待ち
```

### 作成されるレコード

| Table | Status | Notes |
|-------|--------|-------|
| auth.users | - | Supabase Auth で作成 |
| organizations | `pending` | type = 'buyer' or 'vendor' |
| profiles | `pending` | role = 'owner' |
| buyer_applications / vendor_applications | `pending` | 申請情報 |

---

## 📋 スコープ

### Database (Supabase)

- [ ] `organizations` テーブル作成
- [ ] `profiles` テーブル作成
- [ ] `buyer_applications` テーブル作成
- [ ] `vendor_applications` テーブル作成
- [ ] `create_signup` RPC関数作成（トランザクション処理）
- [ ] RLSポリシー設定

### Backend (FastAPI)

- [ ] `POST /api/auth/signup` エンドポイント
- [ ] Pydantic schemas (`SignupRequest`, `SignupResponse`)
- [ ] Service層 (`auth_service.py`)
- [ ] CRUD層 (`auth_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_auth.py` | Service層 |
| Services | `tests/unit/test_services/test_auth_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_auth_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（ビジネスロジック検証）
- [ ] CRUD層テスト（RPC呼び出し検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | Buyer登録成功 | Service | organization_id, profile_id, application_id 返却 |
| 2 | Vendor登録成功 | Service | organization_id, profile_id, application_id 返却 |
| 3 | 必須フィールド不足 | Routes | 422 Validation Error |
| 4 | 不正なorg_type | Service | ValueError |
| 5 | RPC失敗時のクリーンアップ | Service | auth.users削除が呼ばれる |
| 6 | 重複メールアドレス | CRUD | IntegrityError |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/001-signup.md` に基づき Self-Signup（新規登録）機能を実装してください。

## 重要な前提
- 登録完了時点では全て `pending` 状態
- サービス利用は Platform Admin 承認後
- auth.users は Supabase Auth で先に作成済み、その user_id を受け取って RPC を実行

## 参照ドキュメント
- ワークフロー: docs/workflows/account.md の「1.3 Self-Signup Process」セクション
- レコード作成タイミング: docs/workflows/account.md の「Record Creation Overview」セクション
- DB設計: docs/architecture/database.md
- 認証フロー: docs/architecture/auth.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

以下のテーブルを作成:

- `organizations` テーブル
  - id (UUID, PK)
  - name (TEXT)
  - type (TEXT: 'buyer' | 'vendor')
  - status (TEXT: 'pending' | 'active' | 'inactive' | 'suspended')
  - created_at, updated_at

- `profiles` テーブル
  - id (UUID, PK, FK to auth.users.id)
  - organization_id (UUID, FK)
  - role (TEXT: 'owner' | 'admin' | 'member')
  - status (TEXT: 'pending' | 'active')
  - display_name (TEXT)
  - created_at, updated_at

- `buyer_applications` テーブル
  - id (UUID, PK)
  - organization_id (UUID, FK, UNIQUE)
  - company_name, contact_email, industry, employee_count, purpose
  - status (TEXT: 'pending' | 'approved' | 'rejected')
  - review_note, reviewed_by, reviewed_at
  - created_at, updated_at

- `vendor_applications` テーブル
  - id (UUID, PK)
  - organization_id (UUID, FK, UNIQUE)
  - company_name, contact_email, industry, employee_count
  - business_description, service_description, website_url
  - status (TEXT: 'pending' | 'approved' | 'rejected')
  - review_note, reviewed_by, reviewed_at
  - created_at, updated_at

- `create_signup(p_user_id, p_org_type, p_company_name, ...)` RPC
  - organizations INSERT (status='pending')
  - profiles INSERT (status='pending', role='owner')
  - buyer_applications or vendor_applications INSERT (status='pending')
  - トランザクション内で実行
  - RETURNS { organization_id, profile_id, application_id }

### 2. FastAPI Endpoints

- POST /api/auth/signup
  - Request:
    - user_id (auth.users.id from frontend)
    - org_type ('buyer' | 'vendor')
    - company_name, contact_email, display_name
    - Buyer: industry, employee_count, purpose
    - Vendor: industry, employee_count, business_description, service_description, website_url
  - Call create_signup RPC
  - Response: { organization_id, profile_id, application_id }
  - Error: If RPC fails, delete auth.users for cleanup

### 3. レイヤー構成
- api/routes/auth.py (Controller)
- services/auth_service.py (Business Logic)
- crud/auth_crud.py (Data Access)

### 4. RLSポリシー
- profiles: 自分のprofileのみ参照可能
- organizations: 所属組織のみ参照可能
- applications: 自組織の申請のみ参照可能

## 制約
- 全レコードは `pending` 状態で作成
- エラー時は auth.users を削除してクリーンアップ
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- テストファイル: `tests/unit/test_routes/test_auth.py`, `tests/unit/test_services/test_auth_service.py`, `tests/unit/test_crud/test_auth_crud.py`

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが `supabase/migrations/` に存在
- [ ] `create_signup` RPCがSupabaseで実行可能
- [ ] `POST /api/auth/signup` が正常に動作
- [ ] 作成される全レコードが `pending` 状態
- [ ] Buyer/Vendor 両方の登録が動作
- [ ] エラー時のクリーンアップが動作
- [ ] RLSポリシーが正しく機能
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 依存なし（最初に実装）
- 後続: [002-application-approval.md](./002-application-approval.md)

---

## 📝 メモ

- auth.users は Frontend から Supabase Auth を直接呼び出して作成
- RPC 失敗時は API 側で auth.users を削除（ロールバック相当）
- 登録完了後、ユーザーにはメール確認 + 承認待ちの旨を表示
