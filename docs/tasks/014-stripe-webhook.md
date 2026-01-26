# [Task 014] Stripe Webhook / Stripe Webhook処理

## 🔗 GitLab Issue
- Link: [#39](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/39)

---

## 📝 概要

Stripeからのwebhookイベントを受信し、契約状態・請求書データを同期する。
冪等性を担保するため、Supabase RPC (Stored Function) でトランザクション処理を行う。

**重要**: payments.md の設計方針に従い、FastAPI側は署名検証とRPC呼び出しのみを行う。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC15](../UC/UC15.md) | Auto Suspend on Payment Failure |
| [Payments](../architecture/payments.md) | Webhook処理フロー・RPC設計 |
| [Database Design](../architecture/database.md) | stripe_event_logs, subscriptions, invoices |

---

## 📊 処理フロー概要

```
Stripe
    ↓
POST /api/webhooks/stripe (with Stripe-Signature header)
    ↓
FastAPI: stripe.Webhook.construct_event() で署名検証
    ↓
FastAPI: Supabase RPC handle_stripe_webhook() 呼び出し
    ↓
RPC内でトランザクション処理:
  1. stripe_event_logs で重複チェック（冪等性）
  2. イベント種別に応じた処理
  3. 結果を返却
    ↓
FastAPI: 200 OK を返却
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `stripe_event_logs` テーブル（既存）
- [ ] RPC関数 `handle_stripe_webhook()` 作成
- [ ] RPC関数 `sync_invoice_from_stripe()` 作成

### Backend (FastAPI)

- [ ] `POST /api/webhooks/stripe` - Webhook受信エンドポイント
- [ ] Stripe署名検証
- [ ] RPC呼び出し

### Tests

- [ ] 署名検証のテスト（モック使用）
- [ ] 各イベント種別の処理テスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/014-stripe-webhook.md` に基づき Stripe Webhook 処理を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC15.md
- 決済設計: docs/architecture/payments.md
- DB設計: docs/architecture/database.md

## 重要な設計方針

1. **FastAPIは署名検証とRPC呼び出しのみ** - 複数回のDB操作禁止
2. **RPC内でトランザクション処理** - 冪等性と一貫性を担保
3. **stripe_event_logs で重複チェック** - 同じイベントを2回処理しない

## 実装内容

### 1. Supabase RPC関数 (Migration)

```sql
-- Handle Stripe Webhook events with idempotency
CREATE OR REPLACE FUNCTION handle_stripe_webhook(
    p_event_id TEXT,
    p_event_type TEXT,
    p_customer_id TEXT,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
    v_org_id UUID;
    v_result JSONB;
BEGIN
    -- 1. Check if already processed (idempotency)
    IF EXISTS (SELECT 1 FROM stripe_event_logs WHERE event_id = p_event_id) THEN
        RETURN jsonb_build_object('status', 'already_processed', 'event_id', p_event_id);
    END IF;

    -- 2. Find organization by Stripe customer ID
    SELECT id INTO v_org_id
    FROM organizations
    WHERE billing_customer_id = p_customer_id;

    -- 3. Log the event
    INSERT INTO stripe_event_logs (event_id, event_type, organization_id, payload, processing_status)
    VALUES (p_event_id, p_event_type, v_org_id, p_payload, 'pending');

    -- 4. Process based on event type
    CASE p_event_type
        WHEN 'checkout.session.completed' THEN
            -- Create/update subscription
            v_result := handle_checkout_completed(v_org_id, p_payload);

        WHEN 'invoice.payment_succeeded' THEN
            -- Update subscription status to active
            UPDATE subscriptions
            SET status = 'active', updated_at = NOW()
            WHERE organization_id = v_org_id;
            v_result := jsonb_build_object('action', 'subscription_activated');

        WHEN 'invoice.payment_failed' THEN
            -- Update subscription status to past_due
            UPDATE subscriptions
            SET status = 'past_due', updated_at = NOW()
            WHERE organization_id = v_org_id;
            v_result := jsonb_build_object('action', 'subscription_past_due');

        WHEN 'customer.subscription.deleted' THEN
            -- Update subscription status to canceled
            UPDATE subscriptions
            SET status = 'canceled', updated_at = NOW()
            WHERE organization_id = v_org_id;

            -- Suspend organization
            UPDATE organizations
            SET status = 'suspended', updated_at = NOW()
            WHERE id = v_org_id;
            v_result := jsonb_build_object('action', 'subscription_canceled');

        WHEN 'invoice.created', 'invoice.paid', 'invoice.updated' THEN
            -- Sync invoice data
            v_result := sync_invoice_from_stripe(v_org_id, p_payload);

        ELSE
            v_result := jsonb_build_object('action', 'ignored', 'event_type', p_event_type);
    END CASE;

    -- 5. Mark event as processed
    UPDATE stripe_event_logs
    SET processing_status = 'processed', processed_at = NOW()
    WHERE event_id = p_event_id;

    RETURN jsonb_build_object('status', 'success', 'result', v_result);

EXCEPTION WHEN OTHERS THEN
    -- Log error and re-raise
    UPDATE stripe_event_logs
    SET processing_status = 'failed', error_message = SQLERRM
    WHERE event_id = p_event_id;
    RAISE;
END;
$$;

-- Helper function for checkout completion
CREATE OR REPLACE FUNCTION handle_checkout_completed(
    p_org_id UUID,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_subscription_id TEXT;
    v_customer_id TEXT;
BEGIN
    v_subscription_id := p_payload->>'subscription';
    v_customer_id := p_payload->>'customer';

    -- Update organization with Stripe customer ID
    UPDATE organizations
    SET billing_customer_id = v_customer_id,
        status = 'active',
        updated_at = NOW()
    WHERE id = p_org_id;

    -- Create or update subscription
    INSERT INTO subscriptions (organization_id, stripe_subscription_id, status)
    VALUES (p_org_id, v_subscription_id, 'active')
    ON CONFLICT (organization_id)
    DO UPDATE SET
        stripe_subscription_id = EXCLUDED.stripe_subscription_id,
        status = 'active',
        updated_at = NOW();

    RETURN jsonb_build_object('action', 'checkout_completed', 'subscription_id', v_subscription_id);
END;
$$;

-- Helper function to sync invoice
CREATE OR REPLACE FUNCTION sync_invoice_from_stripe(
    p_org_id UUID,
    p_payload JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO invoices (
        organization_id,
        stripe_invoice_id,
        status,
        amount_due,
        amount_paid,
        currency,
        invoice_number,
        invoice_pdf,
        hosted_invoice_url,
        due_date,
        paid_at,
        period_start,
        period_end
    )
    VALUES (
        p_org_id,
        p_payload->>'id',
        p_payload->>'status',
        (p_payload->>'amount_due')::INT,
        (p_payload->>'amount_paid')::INT,
        p_payload->>'currency',
        p_payload->>'number',
        p_payload->>'invoice_pdf',
        p_payload->>'hosted_invoice_url',
        to_timestamp((p_payload->>'due_date')::BIGINT),
        CASE WHEN p_payload->>'status' = 'paid'
             THEN to_timestamp((p_payload->'status_transitions'->>'paid_at')::BIGINT)
             ELSE NULL END,
        to_timestamp((p_payload->'period_start')::BIGINT),
        to_timestamp((p_payload->'period_end')::BIGINT)
    )
    ON CONFLICT (stripe_invoice_id)
    DO UPDATE SET
        status = EXCLUDED.status,
        amount_due = EXCLUDED.amount_due,
        amount_paid = EXCLUDED.amount_paid,
        invoice_pdf = EXCLUDED.invoice_pdf,
        hosted_invoice_url = EXCLUDED.hosted_invoice_url,
        paid_at = EXCLUDED.paid_at,
        updated_at = NOW();

    RETURN jsonb_build_object('action', 'invoice_synced', 'invoice_id', p_payload->>'id');
END;
$$;
```

### 2. FastAPI Webhook Endpoint (`app/api/routes/webhooks.py`)

```python
import stripe
from fastapi import APIRouter, Request, HTTPException, Header
from app.core.config import settings
from app.core.supabase import get_supabase_service_client

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])

stripe.api_key = settings.STRIPE_SECRET_KEY

@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(None, alias="Stripe-Signature")
):
    """
    Stripe Webhook受信エンドポイント
    - 署名検証
    - Supabase RPC呼び出し
    - FastAPI側でのDB操作は禁止
    """
    # 1. Get raw body
    payload = await request.body()

    # 2. Verify signature
    try:
        event = stripe.Webhook.construct_event(
            payload,
            stripe_signature,
            settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # 3. Extract event data
    event_id = event["id"]
    event_type = event["type"]
    event_data = event["data"]["object"]
    customer_id = event_data.get("customer")

    # 4. Call Supabase RPC (use service role for admin access)
    supabase = get_supabase_service_client()
    result = supabase.rpc(
        "handle_stripe_webhook",
        {
            "p_event_id": event_id,
            "p_event_type": event_type,
            "p_customer_id": customer_id,
            "p_payload": event_data,
        }
    ).execute()

    # 5. Return success (Stripe expects 200)
    return {"received": True, "result": result.data}
```

### 3. 環境変数

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. 対応イベント一覧

| Event Type | 処理内容 |
|------------|----------|
| `checkout.session.completed` | 契約作成、組織ステータス更新 |
| `invoice.payment_succeeded` | サブスク状態をactiveに |
| `invoice.payment_failed` | サブスク状態をpast_dueに |
| `customer.subscription.deleted` | サブスク状態をcanceled、組織をsuspended |
| `invoice.created/paid/updated` | invoicesテーブルに同期 |

## 制約
- **FastAPIでの複数DB操作は禁止** - RPC内で完結させる
- 署名検証は必須
- Service Role Key を使用してRPCを呼び出す
- 冪等性を担保（同じイベントを2回処理しない）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] Stripe署名検証が正しく動作する
- [ ] checkout.session.completed で契約が作成される
- [ ] invoice.payment_failed でサブスク状態が past_due になる
- [ ] customer.subscription.deleted で組織が suspended になる
- [ ] 同じイベントを2回送信しても冪等に処理される
- [ ] stripe_event_logs にイベントが記録される
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [012-subscription](./012-subscription.md) - Checkout Session作成
- 後続: [013-invoice](./013-invoice.md) - 請求書一覧表示

---

## 📝 メモ

- Stripe CLI (`stripe listen --forward-to localhost:8000/api/webhooks/stripe`) でローカルテスト可能
- 本番では Stripe Dashboard で Webhook URL を登録
- エラー時は stripe_event_logs.error_message に記録される
- Stripe は 2xx 以外のレスポンスでリトライする
