# [Task] Admin Organization Management / 管理者：組織管理

## 🔗 GitLab Issue
- Link: [#54](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/54)

---

## 📝 概要

システム管理者が全組織を閲覧・管理する機能。
組織の一覧表示、詳細確認、停止/再開などの操作が可能。

**前提**: 06-01（管理者認証）が完了していること

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Database Design](../architecture/database.md) | organizations, profiles |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. 組織一覧取得
   GET /api/admin/organizations
   └─→ organizations SELECT (フィルタ・ページング)

2. 組織詳細取得
   GET /api/admin/organizations/{id}
   └─→ 組織情報 + メンバー一覧 + サブスク情報

3. 組織停止
   POST /api/admin/organizations/{id}/suspend
   └─→ organizations UPDATE (status='suspended')
   └─→ 全メンバーのセッション無効化

4. 組織再開
   POST /api/admin/organizations/{id}/activate
   └─→ organizations UPDATE (status='active')

5. 組織情報更新（管理者による）
   PUT /api/admin/organizations/{id}
   └─→ organizations UPDATE
```

---

## 📋 スコープ

### Backend (FastAPI)

- [ ] `GET /api/admin/organizations` - 組織一覧
- [ ] `GET /api/admin/organizations/{id}` - 組織詳細
- [ ] `PUT /api/admin/organizations/{id}` - 組織更新
- [ ] `POST /api/admin/organizations/{id}/suspend` - 停止
- [ ] `POST /api/admin/organizations/{id}/activate` - 再開
- [ ] Pydantic schemas
- [ ] Service層 (`admin_organization_service.py`)

### Tests

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 組織一覧取得（フィルタなし） | Service | 全組織返却 |
| 2 | 組織一覧取得（type=buyer） | Service | Buyerのみ |
| 3 | 組織一覧取得（status=active） | Service | activeのみ |
| 4 | 組織詳細取得 | Service | 組織 + メンバー + サブスク |
| 5 | 組織停止 | Service | status='suspended' |
| 6 | 組織再開 | Service | status='active' |
| 7 | 既に停止中の組織を停止 | Service | 409 Error |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/06-02-admin-organization-management.md` に基づき Admin Organization Management（管理者：組織管理）機能を実装してください。

## 参照ドキュメント
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### FastAPI Endpoints

#### GET /api/admin/organizations - 組織一覧
- Query: type? (buyer | vendor), status? (pending | active | suspended | rejected), search?, page, limit
- Response: { items: Organization[], total }

#### GET /api/admin/organizations/{id} - 組織詳細
- Response: Organization with members[], subscription?

#### PUT /api/admin/organizations/{id} - 組織更新
- Request: { name?, industry?, description? }
- Response: Organization
- **管理者による強制編集**

#### POST /api/admin/organizations/{id}/suspend - 停止
- Request: { reason: string }
- Response: { success: true }
- organizations.status → 'suspended'
- 停止通知メール送信

#### POST /api/admin/organizations/{id}/activate - 再開
- Request: { note?: string }
- Response: { success: true }
- organizations.status → 'active'

### レイヤー構成
- api/routes/admin/organizations.py (Controller)
- services/admin_organization_service.py (Business Logic)
- schemas/admin.py (Pydantic models)

## 制約
- 管理者認証が必要（06-01の`get_current_admin`使用）
- 停止時は理由必須
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤーのユニットテストを作成
- Service層は80%以上のカバレッジを目標

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 全APIエンドポイントが正常に動作
- [ ] 組織一覧でフィルタ・検索が動作
- [ ] 組織停止/再開が動作
- [ ] ユニットテスト作成
- [ ] `pytest tests/unit/` がパス

---

## 🔗 関連タスク

- 前提: [06-01-admin-application-approval.md](./06-01-admin-application-approval.md)（管理者認証）
- 関連: [01-02-backend-onboarding.md](./01-02-backend-onboarding.md)（organizations テーブル）

---

## 📝 メモ

- **停止時の影響**: 停止された組織のメンバーはログインできなくなる
- **サブスク連携**: 組織詳細に現在のサブスクリプション情報を含む
- **検索**: 組織名、業種での検索が可能
