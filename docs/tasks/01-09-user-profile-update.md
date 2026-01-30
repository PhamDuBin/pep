# [Task 01-09] User Profile Update

## 🔗 GitLab Issue
- Link: [#46](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/46)

---

## 📝 概要

ユーザーが自分のプロフィール情報を更新できる機能を実装する。
更新可能な項目：display_name, password

**注**: メールアドレスの変更は [01-11 Email Change](./01-11-email-change.md) で実装します。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Database Design](../architecture/database.md) | profiles テーブル |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
Frontend → Backend: PATCH /api/v1/users/me
Backend → JWT: Verify token & get user_id
Backend → Supabase: Update profiles table
Backend → Supabase Auth: Update auth.users (email/password)
Backend → Frontend: Updated user profile
```

---

## 📋 スコープ

### Database (Supabase)

- [x] `profiles` テーブル（既存）
- [x] `auth.users` テーブル（既存）
- [ ] RLSポリシー確認（自分のprofileのみ更新可能）

### Backend (FastAPI)

- [ ] `PATCH /api/v1/users/me` - プロフィール更新
- [ ] `GET /api/v1/users/me` - プロフィール取得（01-08で実装済み）
- [ ] Pydantic schemas (`ProfileUpdateRequest`, `ProfileResponse`)
- [ ] Service層（`UserService.update_profile()`）
- [ ] CRUD層（`UserCRUD.update_profile()`）

### Frontend (Next.js)

- [ ] Profile edit page (`/settings/profile`)
- [ ] Profile edit form component
- [ ] Email change confirmation flow
- [ ] Password change flow

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_users.py` | Service層 |
| Services | `tests/unit/test_services/test_user_service.py` | CRUD層, Supabase Auth |
| CRUD | `tests/unit/test_crud/test_user_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト検証、認証確認）
- [ ] Service層テスト（更新ロジック、バリデーション）
- [ ] CRUD層テスト（UPDATE クエリ）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | display_name更新 | Service | Updated profile |
| 2 | password更新 | Service | Success (auth.usersのみ) |
| 3 | 他人のprofile更新 | Service | PermissionError |
| 4 | 空のdisplay_name | Routes | 422 ValidationError |
| 5 | 短すぎるpassword | Routes | 422 ValidationError |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/01-09-user-profile-update.md` に基づき ユーザープロフィール更新機能 を実装してください。

## 参照ドキュメント
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Backend API Endpoints

#### PATCH /api/v1/users/me
現在のユーザーのプロフィールを更新

**Request:**
```json
{
  "display_name": "山田太郎",
  "password": "newpassword123"  // optional
}
```

**Response:**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "display_name": "山田太郎",
  "role": "owner",
  "org_id": "org-uuid",
  "status": "active",
  "updated_at": "2026-01-30T10:00:00Z"
}
```

### 2. レイヤー構成

```
backend/
├── app/
│   ├── api/routes/users/
│   │   ├── __init__.py
│   │   └── me.py              # PATCH /api/v1/users/me
│   ├── schemas/
│   │   └── user.py            # ProfileUpdateRequest, ProfileResponse
│   ├── services/
│   │   └── user_service.py    # update_profile()
│   └── crud/
│       └── user_crud.py       # update_profile_by_id()
└── tests/
    └── unit/
        ├── test_routes/test_users.py
        ├── test_services/test_user_service.py
        └── test_crud/test_user_crud.py
```

### 3. Frontend

```
frontend/
├── src/
│   ├── app/
│   │   └── settings/
│   │       └── profile/
│   │           └── page.tsx       # Profile edit page
│   └── features/
│       └── user/
│           ├── components/
│           │   └── ProfileEditForm.tsx
│           └── services/
│               └── user.service.ts
```

### 4. Business Logic

**Service層の処理:**
1. JWTから`user_id`を取得
2. `ProfileUpdateRequest`をバリデーション
3. `password`が指定されている場合:
   - Supabase Auth APIで`auth.users`のパスワードを更新
4. `display_name`を`profiles`テーブルで更新
5. 更新後のプロフィールを返す

## 制約
- ユーザーは自分のプロフィールのみ更新可能
- passwordは8文字以上
- display_nameは1文字以上100文字以内
- **email変更は別タスク（01-11）で実装**
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- email/password変更のテストを含める

--------------------------------------------------

---

## ✅ 完了条件

### Backend
- [ ] `PATCH /api/v1/users/me` エンドポイント実装
- [ ] Pydantic schemas作成（`ProfileUpdateRequest`, `ProfileResponse`）
- [ ] Service層実装（email/password変更ロジック含む）
- [ ] CRUD層実装（profiles更新）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/test_routes/test_users.py` がパス
- [ ] Service層カバレッジ 80%以上

### Frontend
- [ ] Profile edit page実装
- [ ] ProfileEditForm component実装（display_name, passwordのみ）
- [ ] Password change flow実装
- [ ] フォームバリデーション実装

### Integration
- [ ] display_name更新 → DB更新 → 画面反映の流れが動作
- [ ] password更新 → 次回ログイン時に新パスワードで認証成功

---

## 🔗 関連タスク

- 前提: [01-08 Login/Logout](./01-08-login-logout.md)
- 関連: [01-11 Email Change](./01-11-email-change.md)
- 後続: [01-10 Organization Settings](./01-10-organization-settings.md)

---

## 📝 メモ

- Supabase Authでは、passwordを変更する場合、`supabase.auth.admin.update_user_by_id()`を使用する
- RLSポリシーで、ユーザーは自分の`profiles`レコードのみ更新できるように制限する
- パスワードはハッシュ化されてSupabase Authに保存される（平文保存しない）
- **メールアドレス変更は別タスク（01-11 Email Change）で実装**（確認フローが必要なため）
