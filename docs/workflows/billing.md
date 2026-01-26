# 6. Billing & Payments / 決済・請求

[← Back to Index](./index.md)

---

## 6.1 Subscription States / サブスクリプション状態遷移

**States (subscriptions.status):**
- `active`: 利用可能
- `past_due`: 支払い失敗（猶予期間中/アクセス可または制限）
- `unpaid`: 支払い失敗（停止中/アクセス不可）
- `canceled`: 解約済み（期間終了まで利用可、その後停止）
- `incomplete`: 決済フロー途中

```mermaid
stateDiagram-v2
    [*] --> incomplete: Checkout Session Start
    incomplete --> active: Payment Success (Webhook)

    active --> past_due: Payment Failed
    past_due --> active: Payment Retry Success
    past_due --> unpaid: All Retries Failed

    unpaid --> active: Manual Payment (Portal)

    active --> canceled: User Cancels
    past_due --> canceled: User Cancels

    canceled --> [*]: Period Ends
```

---

## 6.2 Buyer Billing Model / Buyer 決済モデル

### Overview / 概要

| 項目 | 内容 |
|------|------|
| 基本料金 | サブスクリプション（月額固定） |
| 従量課金 | ドキュメント生成数（月5件無料、6件目〜有料） |
| 決済方式 | カード自動課金 |
| アクセス制御 | 自動（`subscriptions.status` で判定） |

### Billing Flow / 課金フロー

```mermaid
sequenceDiagram
    participant Buyer
    participant App
    participant Stripe
    participant DB

    Note over Buyer,DB: Initial Subscription
    Buyer->>App: Subscribe (Checkout)
    App->>Stripe: Create Checkout Session
    Stripe-->>Buyer: Payment Page
    Buyer->>Stripe: Enter Card & Pay
    Stripe->>App: Webhook: checkout.session.completed
    App->>DB: INSERT subscriptions (active)
    App-->>Buyer: Access Granted

    Note over Buyer,DB: Monthly Billing Cycle
    Stripe->>Stripe: Auto-charge at period end
    alt Success
        Stripe->>App: Webhook: invoice.paid
        App->>DB: subscriptions.status = 'active'
    else Failure
        Stripe->>App: Webhook: invoice.payment_failed
        App->>DB: subscriptions.status = 'past_due'
        Stripe->>Stripe: Smart Retries (3-4 times)
    end
```

### Metered Billing / 従量課金

```mermaid
sequenceDiagram
    participant Buyer
    participant App
    participant Stripe
    participant DB

    Buyer->>App: Generate Document
    App->>DB: INSERT usage_records
    App->>Stripe: Report Usage (create_usage_record)
    App->>DB: UPDATE usage_records (stripe_usage_record_id)

    Note over Stripe: At billing period end
    Stripe->>Stripe: Calculate: Tier1(1-5)=¥0, Tier2(6+)=¥XX
    Stripe->>Stripe: Add to Invoice
    Stripe->>App: Webhook: invoice.created
```

**Stripe Price Configuration:**
```
Product: Document Generation
Pricing: Graduated (段階料金)
├── Tier 1: First 5 units @ ¥0
└── Tier 2: Additional units @ ¥XX each
```

---

## 6.3 Vendor Billing Model / Vendor 決済モデル

### Overview / 概要

| 項目 | 内容 |
|------|------|
| 課金対象 | プラットフォーム利用料など |
| 決済方式 | 請求書払い（Invoice） |
| 支払い期限 | 30日（設定可能） |
| アクセス制御 | 手動（Platform Admin が `organizations.status` を更新） |

### Invoice Flow / 請求フロー

```mermaid
sequenceDiagram
    participant Admin as Platform Admin
    participant App
    participant Stripe
    participant Vendor
    participant DB

    Admin->>App: Create Invoice for Vendor
    App->>Stripe: stripe.Invoice.create()
    App->>Stripe: stripe.InvoiceItem.create()
    App->>Stripe: stripe.Invoice.finalize_invoice()
    Stripe->>App: Webhook: invoice.created
    App->>DB: INSERT invoices (status='open')

    Stripe->>Vendor: Send Invoice Email

    alt Vendor Pays
        Vendor->>Stripe: Pay via Portal/Bank Transfer
        Stripe->>App: Webhook: invoice.paid
        App->>DB: UPDATE invoices (status='paid', paid_at)
    else Vendor Doesn't Pay
        Note over Admin,DB: After due_date
        Admin->>App: Check unpaid invoices
        Admin->>App: Suspend Vendor
        App->>DB: UPDATE organizations (status='suspended')
    end
```

---

## 6.4 Payment Failure & Recovery / 決済失敗と復旧

### Buyer: Automatic Recovery / 自動復旧

```mermaid
sequenceDiagram
    participant Buyer
    participant App
    participant Stripe
    participant DB

    Note over Stripe: Payment Failed
    Stripe->>App: Webhook: invoice.payment_failed
    App->>DB: subscriptions.status = 'past_due'

    Note over Stripe: Stripe Smart Retries
    Stripe->>Stripe: Retry 1 (after 1 day)
    Stripe->>Stripe: Retry 2 (after 3 days)
    Stripe->>Stripe: Retry 3 (after 5 days)

    alt Retry Success
        Stripe->>App: Webhook: invoice.paid
        App->>DB: subscriptions.status = 'active'
        App-->>Buyer: Access Restored
    else All Retries Failed
        Stripe->>App: Webhook: customer.subscription.updated
        App->>DB: subscriptions.status = 'unpaid'
        App-->>Buyer: Access Blocked
    end
```

### Buyer: Manual Recovery (Customer Portal) / 手動復旧

```mermaid
sequenceDiagram
    participant Buyer
    participant App
    participant Stripe
    participant DB

    Buyer->>App: Click "Update Payment"
    App->>Stripe: Create Portal Session
    Stripe-->>Buyer: Redirect to Customer Portal

    Buyer->>Stripe: Update Card Info
    Stripe->>Stripe: Retry Outstanding Invoice

    Stripe->>App: Webhook: invoice.paid
    App->>DB: subscriptions.status = 'active'

    Stripe->>App: Webhook: customer.subscription.updated
    Buyer->>App: Return to App
    App-->>Buyer: Access Restored
```

### Buyer: Re-subscription After Cancellation / 解約後の再契約

```mermaid
sequenceDiagram
    participant Buyer
    participant App
    participant Stripe
    participant DB

    Note over DB: subscriptions.status = 'canceled'

    Buyer->>App: Click "Resubscribe"
    App->>Stripe: Create new Checkout Session
    Stripe-->>Buyer: Payment Page
    Buyer->>Stripe: Enter Card & Pay

    Stripe->>App: Webhook: checkout.session.completed
    App->>DB: INSERT/UPDATE subscriptions (active)
    App-->>Buyer: Access Granted
```

---

## 6.5 Access Control Logic / アクセス制御ロジック

### Buyer Access Control / Buyer アクセス制御

```python
# Pseudo-code for Buyer access check
def check_buyer_access(organization_id):
    subscription = get_subscription(organization_id)

    if subscription is None:
        return AccessDenied("No subscription")

    if subscription.status == 'active':
        return AccessGranted()

    if subscription.status == 'past_due':
        grace_period = timedelta(days=SUBSCRIPTION_GRACE_PERIOD_DAYS)
        if datetime.now() < subscription.current_period_end + grace_period:
            return AccessGranted(warning="Payment past due")
        else:
            return AccessDenied("Payment required")

    if subscription.status in ['unpaid', 'canceled', 'incomplete']:
        return AccessDenied("Subscription inactive")
```

**Environment Variables:**
```env
SUBSCRIPTION_GRACE_PERIOD_DAYS=7
DOCUMENT_FREE_TIER_LIMIT=5
```

### Vendor Access Control / Vendor アクセス制御

```python
# Pseudo-code for Vendor access check
def check_vendor_access(organization_id):
    organization = get_organization(organization_id)

    if organization.status == 'active':
        return AccessGranted()

    if organization.status == 'suspended':
        return AccessDenied("Account suspended - contact support")

    if organization.status == 'pending':
        return AccessDenied("Application pending approval")
```

---

## 6.6 Webhook Events / Webhook イベント一覧

| Event | Description | App Action |
|-------|-------------|------------|
| `checkout.session.completed` | 新規契約完了 | INSERT subscriptions |
| `customer.subscription.created` | サブスク作成 | INSERT/UPDATE subscriptions |
| `customer.subscription.updated` | サブスク更新 | UPDATE subscriptions |
| `customer.subscription.deleted` | サブスク削除 | UPDATE subscriptions (canceled) |
| `invoice.created` | 請求書作成 | INSERT invoices |
| `invoice.paid` | 支払い完了 | UPDATE invoices, subscriptions |
| `invoice.payment_failed` | 支払い失敗 | UPDATE subscriptions (past_due) |
| `payment_method.automatically_updated` | カード自動更新 | Log only |

---

## 6.7 Summary: Buyer vs Vendor / まとめ

| | Buyer | Vendor |
|---|-------|--------|
| 決済方式 | サブスクリプション + 従量課金 | 請求書払い |
| 課金タイミング | 自動（カード決済） | 手動（請求書送付） |
| アクセス制御 | **自動** (`subscriptions.status`) | **手動** (`organizations.status`) |
| 制御主体 | システム | Platform Admin |
| 復旧方法 | Customer Portal or Checkout | Platform Admin が手動復旧 |

---

[← Previous: Notifications](./notifications.md) | [Next: Admin Operations →](./admin.md)
