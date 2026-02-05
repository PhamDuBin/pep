# [Task] Admin Billing / 管理者：請求・決済管理

> **[Phase 2]** MVP後に実装予定

## 🔗 GitLab Issue
- Link: TBD

---

## 📝 概要

システム管理者がサブスクリプションと請求を閲覧・管理する機能。
全組織の契約状況、請求履歴、決済状況を確認可能。

**前提**: 06-01（管理者認証）、04系（決済機能）が完了していること

---

## 📊 処理フロー概要

```
1. サブスクリプション一覧
   GET /api/admin/subscriptions
   └─→ subscriptions SELECT

2. サブスクリプション詳細
   GET /api/admin/subscriptions/{id}
   └─→ サブスク情報 + 組織 + 請求履歴

3. 請求一覧
   GET /api/admin/invoices
   └─→ invoices SELECT

4. 請求詳細
   GET /api/admin/invoices/{id}
   └─→ 請求情報 + 組織

5. 手動サブスク操作（緊急用）
   POST /api/admin/subscriptions/{id}/cancel
   └─→ Stripe連携 + DB更新
```

---

## 📋 スコープ

### Backend (FastAPI)

- [ ] `GET /api/admin/subscriptions` - サブスク一覧
- [ ] `GET /api/admin/subscriptions/{id}` - サブスク詳細
- [ ] `POST /api/admin/subscriptions/{id}/cancel` - 手動キャンセル
- [ ] `GET /api/admin/invoices` - 請求一覧
- [ ] `GET /api/admin/invoices/{id}` - 請求詳細
- [ ] Pydantic schemas
- [ ] Service層

### Tests

| # | Test Case | Expected |
|---|-----------|----------|
| 1 | サブスク一覧取得 | 全サブスク返却 |
| 2 | 請求一覧取得 | 全請求返却 |
| 3 | 手動キャンセル | Stripe + DB更新 |

---

## 🤖 AIへの指示プロンプト

--------------------------------------------------

`docs/tasks/06-04-admin-billing.md` に基づき Admin Billing（管理者：請求・決済管理）機能を実装してください。

## FastAPI Endpoints

#### GET /api/admin/subscriptions - サブスク一覧
- Query: org_id?, status?, plan?, page, limit
- Response: { items: Subscription[], total }

#### GET /api/admin/subscriptions/{id} - サブスク詳細
- Response: Subscription with organization, invoices[]

#### POST /api/admin/subscriptions/{id}/cancel - 手動キャンセル
- Request: { reason: string, immediate?: boolean }
- Response: { success: true }
- Stripe API連携

#### GET /api/admin/invoices - 請求一覧
- Query: org_id?, status?, from?, to?, page, limit
- Response: { items: Invoice[], total }

#### GET /api/admin/invoices/{id} - 請求詳細
- Response: Invoice with organization

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 全APIエンドポイントが動作
- [ ] Stripe連携が正常
- [ ] ユニットテスト作成
- [ ] `pytest tests/unit/` がパス

---

## 🔗 関連タスク

- 前提: [06-01-admin-application-approval.md](./06-01-admin-application-approval.md)
- 前提: [04-01-subscription.md](./04-01-subscription.md)
- 前提: [04-02-invoice.md](./04-02-invoice.md)
