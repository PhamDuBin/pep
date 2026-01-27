# [Task 013] Invoice Management / 請求書管理

## 🔗 GitLab Issue
- Link: [#38](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/38)

---

## 📝 概要

Stripeから同期された請求書履歴を管理・表示する機能を実装する。
組織の管理者が過去の請求書一覧を確認し、PDF をダウンロードできるようにする。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Payments](../architecture/payments.md) | 決済・サブスクリプション設計 |
| [Database Design](../architecture/database.md) | invoices テーブル |

---

## 📊 処理フロー概要

```
(Stripe Webhook経由で invoices テーブルに同期済み - Task 014)
    ↓
Buyer/Vendor Admin
    ↓
[請求書一覧画面を開く]
    ↓
GET /api/billing/invoices
    ↓
請求書一覧表示
    ↓
[PDFダウンロード] → Stripe hosted_invoice_url へリダイレクト
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `invoices` テーブルへのINSERT/UPDATE（Webhook経由）
- [ ] RLSポリシー設定（組織メンバーのみ閲覧可能）

### Backend (FastAPI)

- [ ] `GET /api/billing/invoices` - 請求書一覧取得
- [ ] `GET /api/billing/invoices/{id}` - 請求書詳細取得
- [ ] Pydantic schemas (`app/schemas/invoice.py`)
- [ ] Service層 (`app/services/invoice.py`)
- [ ] CRUD層 (`app/crud/invoices.py`)

### Frontend (Next.js)

- [ ] 請求書一覧画面（Buyer/Vendor共通）
- [ ] PDFダウンロードリンク

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_billing.py` | Service層 |
| Services | `tests/unit/test_services/test_invoice_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_invoices_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（請求書一覧・詳細取得ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 請求書一覧取得成功 | Service | invoices配列, total_count返却 |
| 2 | 請求書詳細取得成功 | Service | invoice情報返却 |
| 3 | 他組織の請求書アクセス | Routes | 403/404 |
| 4 | 存在しない請求書ID | Service | 404 Not Found |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/013-invoice.md` に基づき請求書管理機能を実装してください。

## 参照ドキュメント
- 決済設計: docs/architecture/payments.md
- DB設計: docs/architecture/database.md

## 実装内容

### 1. Pydantic Schemas (`app/schemas/invoice.py`)

```python
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class InvoiceResponse(BaseModel):
    id: str
    stripe_invoice_id: str
    status: str  # draft, open, paid, void, uncollectible
    amount_due: int
    amount_paid: int
    currency: str
    invoice_number: Optional[str]
    description: Optional[str]
    invoice_pdf: Optional[str]  # PDF URL
    hosted_invoice_url: Optional[str]  # Stripe hosted page
    due_date: Optional[datetime]
    paid_at: Optional[datetime]
    period_start: Optional[datetime]
    period_end: Optional[datetime]
    created_at: datetime

class InvoiceListResponse(BaseModel):
    invoices: List[InvoiceResponse]
    total_count: int
    has_more: bool
```

### 2. FastAPI Endpoints (`app/api/routes/billing.py` に追加)

```python
@router.get("/invoices", response_model=InvoiceListResponse)
async def list_invoices(
    limit: int = 20,
    offset: int = 0,
    current_user = Depends(get_current_user)
):
    """請求書一覧を取得"""
    pass

@router.get("/invoices/{invoice_id}", response_model=InvoiceResponse)
async def get_invoice(
    invoice_id: str,
    current_user = Depends(get_current_user)
):
    """請求書詳細を取得"""
    pass
```

### 3. CRUD層 (`app/crud/invoices.py`)

```python
from app.core.supabase import get_supabase_client

class InvoiceCRUD:
    def __init__(self):
        self.supabase = get_supabase_client()

    async def get_by_org(self, org_id: str, limit: int = 20, offset: int = 0) -> list:
        """組織の請求書一覧を取得"""
        response = self.supabase.table("invoices") \
            .select("*") \
            .eq("organization_id", org_id) \
            .order("created_at", desc=True) \
            .range(offset, offset + limit - 1) \
            .execute()
        return response.data

    async def get_by_id(self, invoice_id: str, org_id: str) -> dict:
        """請求書を取得（組織IDでフィルタ）"""
        response = self.supabase.table("invoices") \
            .select("*") \
            .eq("id", invoice_id) \
            .eq("organization_id", org_id) \
            .single() \
            .execute()
        return response.data

    async def upsert(self, invoice_data: dict) -> dict:
        """請求書をupsert（Webhook用）"""
        response = self.supabase.table("invoices") \
            .upsert(invoice_data, on_conflict="stripe_invoice_id") \
            .execute()
        return response.data[0] if response.data else None
```

### 4. RLSポリシー (Migration)

```sql
-- Organization members can view their invoices
CREATE POLICY "Organization members can view own invoices"
    ON invoices FOR SELECT
    USING (
        organization_id IN (
            SELECT org_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Platform admins can view all invoices (already exists)
```

## 制約
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義
- invoices テーブルへの書き込みは Webhook (Task 014) 経由のみ
- PDFダウンロードは Stripe の hosted URL を使用

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 組織の請求書一覧が取得できる
- [ ] 請求書詳細が取得できる
- [ ] PDF URL が正しく返される
- [ ] RLSポリシーにより他組織の請求書が見えない
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [012-subscription](./012-subscription.md) - サブスクリプション契約
- 前提: [014-stripe-webhook](./014-stripe-webhook.md) - Webhookで請求書データ同期
- 後続: なし

---

## 📝 メモ

- invoices テーブルへのデータ投入は Stripe Webhook 経由
- Stripe の invoice.created, invoice.paid 等のイベントで同期
- PDF は Stripe がホスティングしているものを使用（自前生成不要）
