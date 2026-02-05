# [Task] Admin User Management / 管理者：ユーザー管理

> **[Phase 2]** MVP後に実装予定

## 🔗 GitLab Issue
- Link: TBD

---

## 📝 概要

システム管理者が全ユーザーを閲覧・管理する機能。
ユーザーの検索、詳細確認、アカウント停止などの操作が可能。

**前提**: 06-01（管理者認証）が完了していること

---

## 📊 処理フロー概要

```
1. ユーザー一覧取得
   GET /api/admin/users
   └─→ profiles SELECT (フィルタ・ページング)

2. ユーザー詳細取得
   GET /api/admin/users/{id}
   └─→ ユーザー情報 + 所属組織

3. ユーザー停止
   POST /api/admin/users/{id}/suspend
   └─→ profiles UPDATE (is_active=false)

4. ユーザー再開
   POST /api/admin/users/{id}/activate
   └─→ profiles UPDATE (is_active=true)
```

---

## 📋 スコープ

### Backend (FastAPI)

- [ ] `GET /api/admin/users` - ユーザー一覧
- [ ] `GET /api/admin/users/{id}` - ユーザー詳細
- [ ] `POST /api/admin/users/{id}/suspend` - 停止
- [ ] `POST /api/admin/users/{id}/activate` - 再開
- [ ] Pydantic schemas
- [ ] Service層

### Tests

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | ユーザー一覧取得 | 全ユーザー返却 |
| 2 | ユーザー詳細取得 | ユーザー + 組織情報 |
| 3 | ユーザー停止 | is_active=false |
| 4 | ユーザー再開 | is_active=true |

---

## 🤖 AIへの指示プロンプト

--------------------------------------------------

`docs/tasks/06-03-admin-user-management.md` に基づき Admin User Management（管理者：ユーザー管理）機能を実装してください。

## FastAPI Endpoints

#### GET /api/admin/users - ユーザー一覧
- Query: org_id?, role?, is_active?, search?, page, limit
- Response: { items: User[], total }

#### GET /api/admin/users/{id} - ユーザー詳細
- Response: User with organization

#### POST /api/admin/users/{id}/suspend - 停止
- Request: { reason: string }
- Response: { success: true }

#### POST /api/admin/users/{id}/activate - 再開
- Response: { success: true }

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 全APIエンドポイントが動作
- [ ] ユニットテスト作成
- [ ] `pytest tests/unit/` がパス

---

## 🔗 関連タスク

- 前提: [06-01-admin-application-approval.md](./06-01-admin-application-approval.md)
