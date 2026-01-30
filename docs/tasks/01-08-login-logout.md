# [Task 01-08] Login/Logout

## 🔗 GitLab Issue
- Link: [#45](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/45)

---

## 📝 概要

ユーザーのログイン・ログアウト機能を実装する。
Supabase Authを使用してメールアドレス/パスワード認証を行い、JWT トークンを発行する。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Authentication Flow](../architecture/auth.md) | 認証フロー |
| [Database Design](../architecture/database.md) | profiles テーブル |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

### Login Flow

```
Frontend → Supabase Auth: signInWithPassword(email, password)
Supabase Auth → Frontend: JWT Token + User Info
Frontend → Backend: GET /api/v1/auth/me
Backend → Supabase: Verify JWT
Backend → Supabase: Get user profile
Backend → Backend: Check profile.status
  - pending: Throw ONBOARDING_INCOMPLETE error
  - suspended: Throw ACCOUNT_SUSPENDED error
  - inactive: Throw ACCOUNT_INACTIVE error
  - active: Return user profile
Backend → Frontend: User profile + role + org info (if active)
Frontend → If error: Show message, sign out
Frontend → If success: Redirect to dashboard
```

### Logout Flow

```
Frontend → Supabase Auth: signOut()
Supabase Auth → Frontend: Success
Frontend → LocalStorage: Clear JWT Token
Frontend → Redirect: Navigate to login page
```

---

## 📋 スコープ

### Database (Supabase)

- [x] `auth.users` テーブル（既存）
- [x] `profiles` テーブル（既存）
- [ ] RLSポリシー確認・調整

### Backend (FastAPI)

- [ ] `GET /api/v1/auth/me` - 現在のユーザー情報取得
- [ ] `POST /api/v1/auth/refresh` - JWTトークン更新
- [ ] Pydantic schemas (`UserInfo`, `LoginResponse`)
- [ ] Service層（`AuthService`）
- [ ] CRUD層（`AuthCRUD`）

### Frontend (Next.js)

- [ ] Login page (`/login`)
- [ ] Logout function
- [ ] Auth context provider
- [ ] JWT storage (LocalStorage or Cookie)
- [ ] Protected routes middleware

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_auth_routes.py` | Service層 |
| Services | `tests/unit/test_services/test_auth_service.py` | CRUD層, Supabase Auth |
| CRUD | `tests/unit/test_crud/test_auth_crud.py` | Supabase client |

- [ ] Routes層テスト（JWT検証、レスポンス検証）
- [ ] Service層テスト（ユーザー情報取得、権限確認）
- [ ] CRUD層テスト（プロフィール取得クエリ）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 正常ログイン（active） | Service | JWT + User profile |
| 2 | pending状態でログイン | Service | ONBOARDING_INCOMPLETE error |
| 3 | suspended状態でログイン | Service | ACCOUNT_SUSPENDED error |
| 4 | inactive状態でログイン | Service | ACCOUNT_INACTIVE error |
| 5 | 無効なパスワード | Service | AuthenticationError |
| 6 | 存在しないユーザー | Service | NotFoundError |
| 7 | JWT検証成功 | Routes | User info returned |
| 8 | 期限切れJWT | Routes | 401 Unauthorized |
| 9 | ログアウト成功 | Frontend | Token cleared |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/01-08-login-logout.md` に基づき ログイン・ログアウト機能 を実装してください。

## 参照ドキュメント
- 認証フロー: docs/architecture/auth.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Backend API Endpoints

#### GET /api/v1/auth/me
現在のユーザー情報を取得

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "display_name": "山田太郎",
  "role": "owner",
  "org_id": "org-uuid",
  "org_name": "株式会社ABC",
  "org_type": "buyer",
  "status": "active"
}
```

#### POST /api/v1/auth/refresh
JWTトークンをリフレッシュ

**Request:**
```json
{
  "refresh_token": "..."
}
```

**Response:**
```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_in": 3600
}
```

### 2. レイヤー構成

```
backend/
├── app/
│   ├── api/routes/auth/
│   │   ├── __init__.py
│   │   └── me.py              # GET /api/v1/auth/me
│   ├── schemas/
│   │   └── auth.py            # UserInfo, LoginResponse
│   ├── services/
│   │   └── auth_service.py    # get_current_user_info()
│   └── crud/
│       └── auth_crud.py       # get_user_profile_by_id()
└── tests/
    └── unit/
        ├── test_routes/test_auth_routes.py
        ├── test_services/test_auth_service.py
        └── test_crud/test_auth_crud.py
```

### 3. Frontend

```
frontend/
├── src/
│   ├── app/
│   │   └── login/
│   │       └── page.tsx       # Login page
│   ├── shared/
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx  # Auth state management
│   │   └── hooks/
│   │       └── useAuth.ts     # useAuth hook
```

## 制約
- Supabase Authを使用（独自認証ロジックは実装しない）
- JWTの検証はSupabase JWT Secretで行う
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- JWT検証のテストを含める

--------------------------------------------------

---

## ✅ 完了条件

### Backend
- [ ] `GET /api/v1/auth/me` エンドポイント実装
- [ ] `POST /api/v1/auth/refresh` エンドポイント実装
- [ ] JWT検証ミドルウェア実装
- [ ] Pydantic schemas作成（`UserInfo`, `LoginResponse`）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/test_routes/test_auth_routes.py` がパス
- [ ] Service層カバレッジ 80%以上

### Frontend
- [ ] Login page実装
- [ ] Logout function実装
- [ ] AuthContext実装
- [ ] Protected routes middleware実装
- [ ] JWT storage実装

### Integration
- [ ] ログイン → トークン取得 → API呼び出し → プロフィール表示の一連の流れが動作
- [ ] ログアウト → トークン削除 → 認証エラーの流れが動作
- [ ] トークン期限切れ時の自動リフレッシュが動作

---

## 🔗 関連タスク

- 前提: [01-02 Backend Onboarding](./01-02-backend-onboarding.md)
- 後続: [01-09 User Profile Update](./01-09-user-profile-update.md)

---

## 📝 メモ

- Supabase Authは自動的にJWTトークンを発行・管理する
- Backend側では`Authorization: Bearer {JWT}`ヘッダーからトークンを抽出し、Supabase JWT Secretで検証する
- フロントエンドではSupabase Clientの`auth.onAuthStateChange()`でトークンの状態を監視する
- セッションの有効期限は3600秒（1時間）、リフレッシュトークンは7日間
- **重要**: `profile.status`が`pending`の場合、ログインを拒否し、メール確認リンクからのオンボーディング完了を促す
- `pending`状態のユーザーは、メール内の確認リンク（tokenパラメータ付き）からのみ`/onboarding`ページにアクセス可能
