# [Task 012] Subscription Management / サブスクリプション管理

## 🔗 GitLab Issue
- Link: [#37](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/37)

---

## 📝 概要

Buyer/Vendorのサブスクリプション契約機能を実装する。
Stripe Checkoutを使用した決済フローを構築し、契約状態を管理する。

- Buyer: 月額サブスクリプション（カード決済）
- Vendor: 年額契約（カード決済 or 請求書）

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC13](../UC/UC13.md) | Buyer Subscription Payment |
| [UC14](../UC/UC14.md) | Vendor Annual Contract |
| [Payments](../architecture/payments.md) | 決済・サブスクリプション設計 |
| [Database Design](../architecture/database.md) | subscriptions, usage_records |

---

## 📊 処理フロー概要

```
Buyer/Vendor Admin
    ↓
[決済画面を開く]
    ↓
POST /billing/create-checkout-session
    ↓
Stripe Checkout Session作成
    ↓
Stripe決済画面へリダイレクト
    ↓
(ユーザーが決済完了)
    ↓
Stripe Webhook → Task 014 で処理
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `subscriptions` テーブルへのINSERT/UPDATE
- [ ] `usage_records` テーブルへのINSERT（従量課金用）
- [ ] RLSポリシー設定（組織メンバーのみ閲覧可能）

### Backend (FastAPI)

- [ ] `GET /api/billing/status` - 現在の契約状態取得
- [ ] `POST /api/billing/create-checkout-session` - Buyer用Checkout作成
- [ ] `POST /api/billing/vendors/{id}/create-checkout-session` - Vendor用Checkout作成（Platform Admin）
- [ ] `GET /api/billing/portal` - Stripe Customer Portal URL取得（カード変更等）
- [ ] Pydantic schemas (`app/schemas/billing.py`)
- [ ] Service層 (`app/services/billing.py`)
- [ ] CRUD層 (`app/crud/subscriptions.py`)

### Frontend (Next.js)

- [ ] Buyer: サブスクリプション契約画面
- [ ] Buyer: 契約状態表示
- [ ] Platform Admin: Vendor契約リンク発行画面

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_billing.py` | Service層 |
| Services | `tests/unit/test_services/test_billing_service.py` | Stripe API, CRUD層 |
| CRUD | `tests/unit/test_crud/test_subscriptions_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（Checkout Session作成・契約状態取得ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | Checkout Session作成成功 | Service | checkout_url 返却 |
| 2 | 契約状態取得成功 | Service | status, period情報返却 |
| 3 | Customer Portal URL取得 | Service | portal_url 返却 |
| 4 | 他組織のデータアクセス | Routes | 403/404 |
| 5 | Stripe APIエラー時 | Service | 適切なエラーハンドリング |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/012-subscription.md` に基づきサブスクリプション管理機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC13.md, docs/UC/UC14.md
- 決済設計: docs/architecture/payments.md
- DB設計: docs/architecture/database.md

## 実装内容

### 1. Pydantic Schemas (`app/schemas/billing.py`)

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BillingStatusResponse(BaseModel):
    subscription_id: Optional[str]
    status: str  # active, past_due, canceled, incomplete, etc.
    current_period_start: Optional[datetime]
    current_period_end: Optional[datetime]
    plan_id: Optional[str]

class CreateCheckoutSessionRequest(BaseModel):
    price_id: str  # Stripe Price ID
    success_url: str
    cancel_url: str

class CreateCheckoutSessionResponse(BaseModel):
    checkout_url: str
    session_id: str

class CustomerPortalResponse(BaseModel):
    portal_url: str
```

### 2. FastAPI Endpoints (`app/api/routes/billing.py`)

```python
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.billing import *
from app.services.billing import BillingService
from app.core.auth import get_current_user

router = APIRouter(prefix="/api/billing", tags=["billing"])

@router.get("/status", response_model=BillingStatusResponse)
async def get_billing_status(current_user = Depends(get_current_user)):
    """現在の契約状態を取得"""
    pass

@router.post("/create-checkout-session", response_model=CreateCheckoutSessionResponse)
async def create_checkout_session(
    request: CreateCheckoutSessionRequest,
    current_user = Depends(get_current_user)
):
    """Buyer用 Stripe Checkout Session作成"""
    pass

@router.get("/portal", response_model=CustomerPortalResponse)
async def get_customer_portal(current_user = Depends(get_current_user)):
    """Stripe Customer Portal URL取得"""
    pass
```

### 3. Service層 (`app/services/billing.py`)

```python
import stripe
from app.core.config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class BillingService:
    async def get_billing_status(self, org_id: str) -> dict:
        """組織の契約状態を取得"""
        pass

    async def create_checkout_session(
        self,
        org_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str
    ) -> dict:
        """Stripe Checkout Session作成"""
        session = stripe.checkout.Session.create(
            mode="subscription",
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"org_id": org_id},
            client_reference_id=org_id,
        )
        return {"checkout_url": session.url, "session_id": session.id}

    async def create_customer_portal_session(self, customer_id: str, return_url: str) -> str:
        """Stripe Customer Portal Session作成"""
        session = stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=return_url,
        )
        return session.url
```

### 4. 環境変数

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_BUYER_PRICE_ID=price_...  # Buyer月額プラン
STRIPE_VENDOR_PRICE_ID=price_... # Vendor年額プラン
```

## 制約
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義
- Stripeの秘密鍵は環境変数から取得
- 決済完了処理は Task 014 (Stripe Webhook) で実装

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- Stripe APIはモック使用（実API呼び出し不要）
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] Buyer用 Checkout Session が作成でき、Stripe決済画面へ遷移できる
- [ ] 契約状態が正しく取得できる
- [ ] Customer Portal へのリンクが取得できる
- [ ] RLSポリシーにより他組織のデータが見えない
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [01-01-signup](./01-01-signup.md) - ユーザー・組織が存在すること
- 後続: [04-03-stripe-webhook](./04-03-stripe-webhook.md) - 決済完了処理

---

## 📝 メモ

- Stripe Test Mode で開発・テスト
- Webhook処理は Task 014 で別途実装
- 従量課金（usage_records）は将来のドキュメント生成課金用
- Vendor請求書払いは Phase 2 で対応予定
