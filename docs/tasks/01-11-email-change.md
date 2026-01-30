# [Task 01-11] Email Change

## 🔗 GitLab Issue
- Link: [#48](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/48)

---

## 📝 概要

ユーザーがメールアドレスを変更できる機能を実装する。
セキュリティのため、新しいメールアドレスへの確認リンク送信と、クリックによる変更完了フローを実装する。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Database Design](../architecture/database.md) | profiles, auth.users テーブル |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. User: 新しいメールアドレスを入力
2. Frontend → Backend: POST /api/v1/users/me/email-change-request
3. Backend → Supabase Auth: Generate email change token
4. Backend → Email Service: Send confirmation email to new address
5. User: 新しいメールアドレスで確認リンクをクリック
6. Frontend → Backend: POST /api/v1/users/me/email-change-confirm
7. Backend → Supabase Auth: Update auth.users.email
8. Backend → DB: Update profiles.email
9. Backend → Email Service: Send notification to old email
10. Frontend: Show success message
```

---

## 📋 スコープ

### Database (Supabase)

- [x] `auth.users` テーブル（既存）
- [x] `profiles` テーブル（既存）
- [ ] RLSポリシー確認

### Backend (FastAPI)

- [ ] `POST /api/v1/users/me/email-change-request` - メール変更リクエスト
- [ ] `POST /api/v1/users/me/email-change-confirm` - メール変更確認
- [ ] Pydantic schemas (`EmailChangeRequest`, `EmailChangeConfirm`)
- [ ] Service層（`UserService.request_email_change()`, `confirm_email_change()`）
- [ ] CRUD層（`UserCRUD.update_email()`）

### Frontend (Next.js)

- [ ] Email change page (`/settings/email`)
- [ ] Email confirmation page (`/auth/confirm-email-change?token=xxx`)
- [ ] Email notification

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_users_email.py` | Service層 |
| Services | `tests/unit/test_services/test_user_email_service.py` | CRUD層, Supabase Auth |
| CRUD | `tests/unit/test_crud/test_user_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト検証、認証確認）
- [ ] Service層テスト（メール送信、トークン検証）
- [ ] CRUD層テスト（email UPDATE）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | メール変更リクエスト | Service | Confirmation email sent |
| 2 | 既に使用中のメール | Service | EmailAlreadyExistsError |
| 3 | 無効なメール形式 | Routes | 422 ValidationError |
| 4 | トークン検証成功 | Service | Email updated |
| 5 | 無効なトークン | Service | InvalidTokenError |
| 6 | 期限切れトークン | Service | TokenExpiredError |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/01-11-email-change.md` に基づき メールアドレス変更機能 を実装してください。

## 参照ドキュメント
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Backend API Endpoints

#### POST /api/v1/users/me/email-change-request
メールアドレス変更リクエスト

**Request:**
```json
{
  "new_email": "newemail@example.com"
}
```

**Response:**
```json
{
  "message": "確認メールを送信しました。新しいメールアドレスで確認してください。",
  "expires_at": "2026-01-30T11:00:00Z"
}
```

#### POST /api/v1/users/me/email-change-confirm
メールアドレス変更確認

**Request:**
```json
{
  "token": "change-token-xxx"
}
```

**Response:**
```json
{
  "message": "メールアドレスを変更しました。",
  "new_email": "newemail@example.com"
}
```

### 2. レイヤー構成

```
backend/
├── app/
│   ├── api/routes/users/
│   │   ├── __init__.py
│   │   └── email.py            # POST /api/v1/users/me/email-change-*
│   ├── schemas/
│   │   └── user.py             # EmailChangeRequest, EmailChangeConfirm
│   ├── services/
│   │   └── user_service.py     # request_email_change(), confirm_email_change()
│   └── crud/
│       └── user_crud.py        # update_email()
└── tests/
    └── unit/
        ├── test_routes/test_users_email.py
        ├── test_services/test_user_email_service.py
        └── test_crud/test_user_crud.py
```

### 3. Frontend

```
frontend/
├── src/
│   ├── app/
│   │   ├── settings/
│   │   │   └── email/
│   │   │       └── page.tsx       # Email change page
│   │   └── auth/
│   │       └── confirm-email-change/
│   │           └── page.tsx       # Email confirmation page
│   └── features/
│       └── user/
│           ├── components/
│           │   └── EmailChangeForm.tsx
│           └── services/
│               └── user.service.ts
```

### 4. Business Logic

**Service層の処理（リクエスト）:**
1. JWTから`user_id`を取得
2. 新しいメールアドレスが既に使用されていないか確認
3. Supabase Auth APIでメール変更トークンを生成
4. 新しいメールアドレスに確認リンクを送信
5. トークンの有効期限（1時間）を設定

**Service層の処理（確認）:**
1. トークンを検証
2. トークンが有効期限内か確認
3. `auth.users.email`を更新
4. `profiles.email`を更新
5. 旧メールアドレスに変更通知を送信

## 制約
- ユーザーは自分のメールアドレスのみ変更可能
- 新しいメールアドレスは未使用である必要がある
- 確認トークンの有効期限は1時間
- 変更完了後、旧メールアドレスに通知メールを送信
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）
- トークン検証のテストを含める

--------------------------------------------------

---

## ✅ 完了条件

### Backend
- [ ] `POST /api/v1/users/me/email-change-request` エンドポイント実装
- [ ] `POST /api/v1/users/me/email-change-confirm` エンドポイント実装
- [ ] Pydantic schemas作成（`EmailChangeRequest`, `EmailChangeConfirm`）
- [ ] Service層実装（メール送信、トークン検証）
- [ ] CRUD層実装（email更新）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/test_routes/test_users_email.py` がパス
- [ ] Service層カバレッジ 80%以上

### Frontend
- [ ] Email change page実装
- [ ] Email confirmation page実装
- [ ] EmailChangeForm component実装
- [ ] 確認メール送信成功メッセージ表示
- [ ] 変更完了成功メッセージ表示

### Integration
- [ ] メール変更リクエスト → 確認メール送信の流れが動作
- [ ] 確認リンククリック → メール更新 → 旧メールに通知の流れが動作
- [ ] 変更後、新メールアドレスでログイン可能

---

## 🔗 関連タスク

- 前提: [01-09 User Profile Update](./01-09-user-profile-update.md)
- 関連: [01-08 Login/Logout](./01-08-login-logout.md)

---

## 📝 メモ

- Supabase Authの`updateUser()`メソッドを使用してメールアドレスを変更
- メール変更トークンはSupabase Auth側で管理される
- セキュリティのため、必ず新しいメールアドレスへの確認が必要
- 旧メールアドレスへの通知により、不正な変更を検知できる
- トークンの有効期限は短め（1時間）に設定してセキュリティを確保
