# [Task 04-04] Payment Methods

## 🔗 GitLab Issue
- Link: [#49](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/49)

---

## 📝 概要

組織の決済方法（クレジットカード等）を管理する機能を実装する。
owner/admin が Stripe連携でクレジットカード情報のCRUD操作を行う。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Payments](../architecture/payments.md) | Stripe連携 |
| [Database Design](../architecture/database.md) | organizations テーブル |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
Frontend → Backend: GET /api/v1/organizations/{org_id}/payment-methods
Backend → Stripe API: List payment methods
Backend → Frontend: Payment methods list

Frontend → Backend: POST /api/v1/organizations/{org_id}/payment-methods
Backend → Stripe API: Create payment method
Backend → Stripe API: Attach to customer
Backend → Frontend: New payment method

Frontend → Backend: DELETE /api/v1/organizations/{org_id}/payment-methods/{pm_id}
Backend → Stripe API: Detach payment method
Backend → Frontend: Success

Frontend → Backend: POST /api/v1/organizations/{org_id}/payment-methods/{pm_id}/set-default
Backend → Stripe API: Set default payment method
Backend → DB: Update organizations table
Backend → Frontend: Success
```

---

## 📋 スコープ

### Database (Supabase)

- [x] `organizations` テーブル（既存）
  - `stripe_customer_id` - Stripe Customer ID
  - `stripe_default_payment_method_id` - デフォルト決済方法ID

### Backend (FastAPI)

- [ ] `GET /api/v1/organizations/{org_id}/payment-methods` - 決済方法一覧取得
- [ ] `POST /api/v1/organizations/{org_id}/payment-methods` - 決済方法追加
- [ ] `DELETE /api/v1/organizations/{org_id}/payment-methods/{pm_id}` - 決済方法削除
- [ ] `POST /api/v1/organizations/{org_id}/payment-methods/{pm_id}/set-default` - デフォルト設定
- [ ] Pydantic schemas (`PaymentMethodResponse`, `PaymentMethodCreate`)
- [ ] Service層（`PaymentService`）
- [ ] CRUD層（`OrganizationCRUD`）

### Frontend (Next.js)

- [ ] Payment methods page (`/settings/billing/payment-methods`)
- [ ] Stripe Elements integration (card input form)
- [ ] Payment method list component
- [ ] Delete confirmation dialog

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_payment_methods.py` | Service層 |
| Services | `tests/unit/test_services/test_payment_service.py` | CRUD層, Stripe API |
| CRUD | `tests/unit/test_crud/test_organization_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト検証、権限確認）
- [ ] Service層テスト（Stripe API呼び出し、権限チェック）
- [ ] CRUD層テスト（organizations UPDATE）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | owner が決済方法を追加 | Service | Payment method created |
| 2 | admin が決済方法を追加 | Service | Payment method created |
| 3 | member が決済方法を追加 | Service | PermissionError |
| 4 | 決済方法を削除 | Service | Payment method deleted |
| 5 | デフォルト決済方法を設定 | Service | Default set, DB updated |
| 6 | 他組織の決済方法を操作 | Service | PermissionError |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/04-04-payment-methods.md` に基づき 決済方法管理機能 を実装してください。

## 参照ドキュメント
- Stripe連携: docs/architecture/payments.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Backend API Endpoints

#### GET /api/v1/organizations/{org_id}/payment-methods
決済方法一覧を取得（owner/admin のみ）

**Response:**
```json
{
  "payment_methods": [
    {
      "id": "pm_xxx",
      "type": "card",
      "card": {
        "brand": "visa",
        "last4": "4242",
        "exp_month": 12,
        "exp_year": 2026
      },
      "is_default": true,
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/organizations/{org_id}/payment-methods
決済方法を追加（owner/admin のみ）

**Request:**
```json
{
  "payment_method_id": "pm_xxx"  // Stripe.jsで作成したPaymentMethod ID
}
```

**Response:**
```json
{
  "id": "pm_xxx",
  "type": "card",
  "card": {
    "brand": "visa",
    "last4": "4242",
    "exp_month": 12,
    "exp_year": 2026
  },
  "is_default": false
}
```

#### DELETE /api/v1/organizations/{org_id}/payment-methods/{pm_id}
決済方法を削除（owner/admin のみ）

**Response:**
```json
{
  "message": "決済方法を削除しました。"
}
```

#### POST /api/v1/organizations/{org_id}/payment-methods/{pm_id}/set-default
デフォルト決済方法を設定（owner/admin のみ）

**Response:**
```json
{
  "message": "デフォルト決済方法を設定しました。",
  "payment_method_id": "pm_xxx"
}
```

### 2. レイヤー構成

```
backend/
├── app/
│   ├── api/routes/organizations/
│   │   ├── __init__.py
│   │   └── payment_methods.py  # Payment methods endpoints
│   ├── schemas/
│   │   └── payment_method.py   # PaymentMethodResponse, PaymentMethodCreate
│   ├── services/
│   │   └── payment_service.py  # Stripe API integration
│   └── crud/
│       └── organization_crud.py # Update default payment method
└── tests/
    └── unit/
        ├── test_routes/test_payment_methods.py
        ├── test_services/test_payment_service.py
        └── test_crud/test_organization_crud.py
```

### 3. Frontend

```
frontend/
├── src/
│   ├── app/
│   │   └── settings/
│   │       └── billing/
│   │           └── payment-methods/
│   │               └── page.tsx       # Payment methods page
│   └── features/
│       └── billing/
│           ├── components/
│           │   ├── PaymentMethodList.tsx
│           │   ├── AddPaymentMethodForm.tsx
│           │   └── StripeCardInput.tsx
│           └── services/
│               └── payment.service.ts
```

### 4. Business Logic

**Service層の処理（追加）:**
1. JWTから`user_id`と`org_id`を取得
2. ユーザーの role を確認（owner または admin のみ許可）
3. `org_id`がユーザーの所属組織と一致するか確認
4. Stripe APIで PaymentMethod を Customer にアタッチ
5. デフォルト決済方法が未設定の場合、自動的にデフォルトに設定
6. 追加した決済方法を返す

**Service層の処理（削除）:**
1. 権限確認（owner/admin のみ）
2. Stripe APIで PaymentMethod をデタッチ
3. デフォルト決済方法だった場合、別の決済方法を自動的にデフォルトに設定

**Service層の処理（デフォルト設定）:**
1. 権限確認（owner/admin のみ）
2. Stripe APIで Customer の `invoice_settings.default_payment_method` を更新
3. DB の `organizations.stripe_default_payment_method_id` を更新

## 制約
- owner または admin のみ操作可能
- 他組織の決済方法は操作不可
- 少なくとも1つの決済方法が登録されている必要がある（全削除不可）
- Stripe Elements を使用してクレジットカード情報を安全に収集
- クレジットカード番号はBackendに送信しない（Stripe.jsで直接Stripeに送信）
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- Stripe APIはモックを使用（実API呼び出し不要）
- 権限チェックのテストを含める

--------------------------------------------------

---

## ✅ 完了条件

### Backend
- [ ] `GET /api/v1/organizations/{org_id}/payment-methods` エンドポイント実装
- [ ] `POST /api/v1/organizations/{org_id}/payment-methods` エンドポイント実装
- [ ] `DELETE /api/v1/organizations/{org_id}/payment-methods/{pm_id}` エンドポイント実装
- [ ] `POST /api/v1/organizations/{org_id}/payment-methods/{pm_id}/set-default` エンドポイント実装
- [ ] Pydantic schemas作成
- [ ] Service層実装（Stripe API連携、権限チェック）
- [ ] CRUD層実装（デフォルト決済方法更新）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/test_routes/test_payment_methods.py` がパス
- [ ] Service層カバレッジ 80%以上

### Frontend
- [ ] Payment methods page実装
- [ ] Stripe Elements統合
- [ ] PaymentMethodList component実装
- [ ] AddPaymentMethodForm component実装
- [ ] Delete confirmation dialog実装
- [ ] Role-based access control実装（owner/adminのみ表示）

### Integration
- [ ] owner/adminによる決済方法追加 → Stripe登録 → 一覧表示の流れが動作
- [ ] 決済方法削除 → Stripe削除 → 一覧更新の流れが動作
- [ ] デフォルト設定 → Stripe更新 → DB更新の流れが動作
- [ ] memberによるアクセス → 403 Forbiddenの流れが動作

---

## 🔗 関連タスク

- 前提: [01-02 Backend Onboarding](../01_User/01-02-backend-onboarding.md)
- 関連: [04-01 Subscription Management](./04-01-subscription.md)
- 関連: [04-03 Stripe Webhook](./04-03-stripe-webhook.md)

---

## 📝 メモ

- Stripe Elements を使用して PCI DSS 準拠を確保
- クレジットカード情報はBackendを経由せず、直接Stripeに送信される
- PaymentMethod IDのみをBackendに送信
- `stripe_customer_id`は01-02 Backend Onboardingで作成済み
- デフォルト決済方法は定期課金（Subscription）で使用される
- 決済方法の追加・削除時に Stripe Webhook が発火する可能性があるため、04-03との連携を確認
- 少なくとも1つの決済方法を維持するため、最後の決済方法は削除不可
