# 6. Payments & Subscriptions / 決済・サブスクリプション

[← Back to Index / 目次に戻る](./index.md)

---

**Design Policy / 設計方針:**
- Stripe Webhook processing uses **Supabase RPC (Stored Function)** to ensure transactions and idempotency
- Stripe Webhook処理は **Supabase RPC (Stored Function)** でトランザクションと冪等性を担保
- FastAPI only handles signature verification and RPC calls (no multiple DB operations)
- FastAPI側は署名検証とRPC呼び出しのみ（複数回のDB操作禁止）
- RPC functions use `SECURITY INVOKER` (DEFINER not needed when using Service Role Key)
- RPC関数は `SECURITY INVOKER` で実装（Service Role Keyで呼び出すためDEFINER不要）

**Table Structure / テーブル構成:**
- `stripe_event_logs`: Records processed event IDs (prevents duplicate processing) / 処理済みイベントID記録（重複処理防止）
- `organizations.stripe_customer_id`: Links to Stripe customer ID / Stripe顧客ID紐付け

```mermaid
sequenceDiagram
    autonumber
    participant Stripe
    participant API as Cloud Run<br/>(FastAPI)
    participant RPC as Supabase RPC<br/>(handle_stripe_webhook)
    participant DB as PostgreSQL

    rect rgb(255, 245, 238)
        Note over Stripe, DB: Webhook Reception → Transaction Processing / Webhook受信 → トランザクション処理
        Stripe->>API: POST /api/webhooks/stripe<br/>Stripe-Signature: t=...,v1=...

        API->>API: stripe.Webhook.construct_event()<br/>Verify signature / 署名検証

        alt Signature verification failed / 署名検証失敗
            API-->>Stripe: 400 Bad Request
        else Signature verification succeeded / 署名検証成功
            API->>RPC: SELECT handle_stripe_webhook(<br/>  event_id, event_type,<br/>  customer_id, payload<br/>)

            RPC->>DB: BEGIN TRANSACTION

            RPC->>DB: SELECT FROM stripe_event_logs<br/>WHERE event_id = $1
            alt Already processed / 既に処理済み
                RPC->>DB: ROLLBACK
                RPC-->>API: {status: 'already_processed'}
            else Not processed / 未処理
                RPC->>DB: INSERT INTO stripe_event_logs
                RPC->>DB: UPDATE organizations<br/>SET status = 'Active'<br/>WHERE stripe_customer_id = $1
                RPC->>DB: COMMIT
                RPC-->>API: {status: 'success'}
            end

            API-->>Stripe: 200 OK
        end
    end
```

---

## Supported Events / 対応イベント

| Event Type | Processing / 処理内容 |
|------------|----------------------|
| `invoice.payment_succeeded` | Update organization status to `Active` / 組織ステータスを `Active` に更新 |
| `invoice.payment_failed` | Update organization status to `PaymentFailed` / 組織ステータスを `PaymentFailed` に更新 |
| `customer.subscription.deleted` | Update organization status to `Cancelled` / 組織ステータスを `Cancelled` に更新 |

---

[← Previous: State Machines / 前へ: 状態遷移](./state-machine.md) | [Next: Software Layers / 次へ: ソフトウェア層 →](./layers.md)
