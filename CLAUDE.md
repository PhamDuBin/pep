# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

このファイルは、Claude Code がこのリポジトリで作業する際のガイダンスを提供します。

## Project Overview / プロジェクト概要

PEP (Project Enhancement Platform) is a BtoB SaaS platform that leverages AI technology to support the creation and management of RFIs (Requests for Information). It streamlines communication between Buyers and Vendors and provides automatic project plan generation.

PEP (Project Enhancement Platform) は、AI技術を活用してRFI（情報提供依頼）の作成・管理を支援するBtoB SaaSプラットフォームです。BuyerとVendor間のコミュニケーションを効率化し、プロジェクト計画書の自動生成機能を提供します。

## Architecture / アーキテクチャ

### Cloud Native Stack / Cloud Native構成

| Component | Technology | Description |
|-----------|------------|-------------|
| Frontend | Next.js 16+ (App Router) | Cloud Run or Vercel / Cloud Run または Vercel |
| Backend | FastAPI | Cloud Run (Serverless) / Cloud Run (サーバーレス) |
| Database | Supabase (PostgreSQL + pgvector) | Managed DB / マネージドDB |
| Auth | Supabase Auth | JWT Authentication / JWT認証 |
| Storage | Supabase Storage | File Storage / ファイル保存 |
| AI | OpenAI API | RFI Draft Generation & Chat / RFI草案生成・チャット |
| Payment | Stripe | Subscription Billing / サブスクリプション決済 |

### System Architecture / システム構成

```
Next.js (Cloud Run or Vercel) [UI/BFF only]
    ↓
    ├── Supabase Auth (Authentication / 認証)
    ├── Supabase Realtime (WebSocket)
    └── Cloud Run (FastAPI) [Business Logic]
            ↓
            ├── Supabase DB (PostgreSQL)
            ├── Supabase Storage
            ├── OpenAI API
            └── Stripe API
```

## Prerequisites / 前提条件

| Tool | Version | Notes |
|------|---------|-------|
| **Python** | 3.11+ | Required for backend / バックエンド必須 |
| **Node.js** | 20+ | Required for frontend / フロントエンド必須 |
| **pyenv** | - | Recommended for Python version management / Pythonバージョン管理推奨 |

### Python Setup / Pythonセットアップ
```bash
# Install Python 3.11 with pyenv / pyenvでPython 3.11をインストール
pyenv install 3.11.8
cd backend
pyenv local 3.11.8      # Set local Python version / ローカルPythonバージョン設定
python --version        # Verify: Python 3.11.8
```

**IMPORTANT**: All developers must use Python 3.11+ to match the production environment (Cloud Run). Code uses Python 3.9+ type hints (`list[...]`, `tuple[...]`).

**重要**: 本番環境(Cloud Run)と合わせるため、全開発者はPython 3.11+を使用すること。コードはPython 3.9+の型ヒント(`list[...]`, `tuple[...]`)を使用。

## Key Commands / 主要コマンド

### Frontend (Next.js)
```bash
cd frontend
npm install              # Install dependencies / 依存関係インストール
npm run dev             # Start dev server at http://localhost:3000 / 開発サーバー起動
npm run build           # Production build / 本番ビルド
npm run lint            # Run ESLint / ESLint実行
```

### Backend (FastAPI)
```bash
cd backend
python --version         # Verify Python 3.11+ / Python 3.11+を確認
pip install -r requirements.txt
pip install -r requirements-dev.txt  # Dev dependencies (pytest, etc.) / 開発用依存関係
uvicorn app.main:app --reload  # Start dev server at http://localhost:8000 / 開発サーバー起動
```

### API Testing / APIテスト

JWT token is required for authenticated API calls. Use the helper script to get a token.

認証が必要なAPIを呼び出すにはJWTトークンが必要です。ヘルパースクリプトでトークンを取得できます。

```bash
cd backend

# Get JWT token / JWTトークン取得
python scripts/get_token.py <email> <password>

# Example / 例
python scripts/get_token.py api-test@example.com ApiTest1234

# Use with curl / curlで使用
TOKEN=$(python scripts/get_token.py api-test@example.com ApiTest1234 2>/dev/null | grep "^Bearer" | cut -d' ' -f2)
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/users/me
```

**Test User / テストユーザー**: Create via Supabase Dashboard (Authentication → Users → Add user)

**Supabase設定**: Authentication → Providers → Email → **Confirm email: OFF** (開発環境のみ)

### Supabase
```bash
supabase db push         # Apply migrations / マイグレーション適用
supabase gen types typescript --local > frontend/src/shared/types/database.types.ts
```

### Deployment / デプロイ
```bash
# Backend (Cloud Run)
gcloud run deploy pep-api --source ./backend --region asia-northeast1

# Frontend (Cloud Run or Vercel)
cd frontend && npm run build
# Option 1: Cloud Run
gcloud run deploy pep-web --source ./frontend --region asia-northeast1
# Option 2: Vercel
vercel --prod
```

## Project Structure / プロジェクト構成

```
pep/
├── frontend/                      # Next.js 16 (App Router)
│   ├── src/
│   │   ├── app/                   # App Router pages / App Routerページ
│   │   │   ├── buyer/             # Buyer pages / Buyerページ
│   │   │   ├── vendor/            # Vendor pages / Vendorページ
│   │   │   ├── layout.tsx         # Root layout / ルートレイアウト
│   │   │   └── page.tsx           # Home page / ホームページ
│   │   ├── features/              # Feature modules / 機能モジュール
│   │   │   ├── buyer/             # Buyer features / Buyer機能
│   │   │   └── vendor/            # Vendor features / Vendor機能
│   │   ├── shared/                # Shared code / 共通コード
│   │   │   ├── components/        # Shared components / 共通コンポーネント
│   │   │   ├── hooks/             # Custom hooks / カスタムフック
│   │   │   ├── services/          # API services / APIサービス
│   │   │   ├── types/             # TypeScript types / 型定義
│   │   │   └── utils/             # Utility functions / ユーティリティ
│   │   └── environments/          # Environment config / 環境設定
│   └── next.config.ts
│
├── backend/                       # FastAPI
│   ├── app/
│   │   ├── api/routes/            # Controller Layer (Endpoints) / Controller層 (エンドポイント)
│   │   ├── services/              # Service Layer (Business Logic) / Service層 (ビジネスロジック)
│   │   ├── crud/                  # Data Access Layer (DB Operations) / Data Access層 (DB操作)
│   │   ├── core/                  # Config, Supabase client
│   │   └── schemas/               # Pydantic models
│   ├── templates/                 # HTML for PDF generation / PDF生成用HTML
│   ├── Dockerfile
│   └── requirements.txt
│
├── supabase/                      # Supabase Configuration / Supabase設定
│   ├── migrations/                # DB Migrations / DBマイグレーション
│   └── functions/                 # Edge Functions
│
└── docs/                          # Documentation / ドキュメント
    ├── UC/                        # Use Case Diagrams / ユースケース図
    └── architecture/              # Architecture Design / アーキテクチャ設計書
        ├── index.md               # Table of Contents / 目次
        ├── system.md              # System Architecture / システム構成図
        ├── database.md            # Database Design (ER) / データベース設計
        ├── auth.md                # Authentication Flow / 認証フロー
        ├── ai-integration.md      # AI Integration / AI連携
        ├── state-machine.md       # State Machines / 状態遷移
        ├── payments.md            # Payments / 決済
        ├── layers.md              # Software Layers / ソフトウェア層
        ├── api-endpoints.md       # API Endpoints / APIエンドポイント
        ├── cicd.md                # CI/CD Pipeline / CI/CDパイプライン
        ├── security.md            # Security / セキュリティ
        └── cost.md                # Cost Estimation / コスト見積もり
```

## Coding Conventions / コーディング規約

### TypeScript / Next.js (React)

1. **Backend Location Principle (CRITICAL) / バックエンド配置原則（重要）**:
   - **Next.js is UI/BFF ONLY** - Business logic implementation is **PROHIBITED** in API Routes and Server Actions
   - **Next.jsはUI/BFFのみ** - API RoutesやServer Actionsでのビジネスロジック実装は**禁止**
   - All business logic MUST be delegated to FastAPI (`backend/`)
   - すべてのビジネスロジックは FastAPI (`backend/`) に委譲すること
   - Allowed in Next.js: Authentication state, UI state, BFF proxying, caching
   - Next.jsで許可: 認証状態管理、UI状態、BFFプロキシ、キャッシュ
2. **App Router**: Use Next.js App Router with Server Components by default / Next.js App Router、デフォルトでServer Componentsを使用
3. **Strict Mode**: TypeScript strict mode required / TypeScript strict mode 必須
4. **File Structure / ファイル構成**:
   - Pages in `src/app/` (App Router) / ページは `src/app/` (App Router)
   - Feature components in `src/features/` / 機能コンポーネントは `src/features/`
   - Shared code in `src/shared/` / 共通コードは `src/shared/`
5. **Naming / 命名規則**:
   - Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
   - Hooks: `useCamelCase.ts` (e.g., `useAuth.ts`)
   - Services: `camelCase.service.ts` (e.g., `auth.service.ts`)
   - Types/Models: `camelCase.model.ts` (e.g., `user.model.ts`)
6. **Imports / インポート順序**:
   - React/Next.js → External libraries → Internal modules
   - React/Next.js → 外部ライブラリ → 内部モジュール
7. **Styling**: Tailwind CSS + DaisyUI + SCSS modules / Tailwind CSS + DaisyUI + SCSSモジュール

### Python / FastAPI

1. **Type Hints**: Required for all functions / すべての関数に型ヒント必須
2. **Pydantic**: Define requests/responses with Pydantic models / リクエスト/レスポンスはPydanticモデルで定義
3. **Async**: Use async/await for I/O operations / I/O操作は async/await を使用
4. **Naming / 命名規則**:
   - Functions: `snake_case`
   - Classes: `PascalCase`
   - Constants: `UPPER_SNAKE_CASE`
5. **Layering (3-Layer Architecture / 3層構造)**:
   - Call order: `api/routes/` → `services/` → `crud/`
   - 呼び出し順序: `api/routes/` → `services/` → `crud/`
   - **Do NOT create `logic/` folder** (Business logic goes in `services/`)
   - **`logic/` フォルダは作成しない** (ビジネスロジックは `services/` に統合)
   - No reverse dependencies (crud must not call services)
   - 逆方向の依存禁止 (crud から services を呼ばない)
6. **Transaction Control / トランザクション制御**:
   - Single CRUD operations: Service → CRUD directly
   - 単一CRUD操作は Service層 → CRUD でそのまま実行
   - Multi-table operations & payments: Use **Supabase RPC** (`supabase-py` doesn't support transactions)
   - 複数テーブル操作・決済などは **Supabase RPC** を使用 (`supabase-py` はトランザクション非対応)

### Testing / テスト

#### Backend Test Structure / バックエンドテスト構成

```
backend/
├── tests/
│   ├── unit/                    # Unit tests / ユニットテスト
│   │   ├── test_routes/         # API layer tests / API層テスト
│   │   ├── test_services/       # Service layer tests / Service層テスト
│   │   └── test_crud/           # CRUD layer tests / CRUD層テスト
│   ├── integration/             # Integration tests (real DB) / 結合テスト（実DB）
│   └── conftest.py              # pytest fixtures
```

#### Test Commands / テストコマンド

```bash
cd backend
pip install pytest pytest-asyncio pytest-cov httpx
pytest                           # Run all tests / 全テスト実行
pytest tests/unit/               # Unit tests only / ユニットテストのみ
pytest --cov=app --cov-report=html  # With coverage / カバレッジ付き
```

#### Layer-by-Layer Testing Strategy / レイヤー別テスト戦略

| Layer | Test Target / テスト対象 | Mock Target / モック対象 |
|-------|-------------------------|-------------------------|
| Routes (API) | HTTP request/response, auth | Service layer / Service層 |
| Services | Business logic | CRUD layer, external APIs / CRUD層、外部API |
| CRUD | DB queries | Supabase client |

#### Testing Rules / テストルール

1. **Isolation / 分離**: Each layer tests only its own responsibility / 各層は自身の責務のみテスト
2. **Mocking**: Mock dependencies, not the layer under test / 依存先をモック、テスト対象はモックしない
3. **Async**: Use `@pytest.mark.asyncio` for async functions / async関数には `@pytest.mark.asyncio` を使用
4. **Coverage Target**: Aim for 80%+ coverage on Service layer / Service層は80%以上のカバレッジを目標
5. **RPC Testing**: Test RPC calls with mocked Supabase client / RPCコールはSupabaseクライアントをモックしてテスト

#### Example Test Patterns / テストパターン例

##### 1. Routes Layer Test (API層テスト)

```python
# tests/unit/test_routes/test_projects.py
import pytest
from unittest.mock import AsyncMock, patch
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
def mock_current_user():
    """Mock authenticated user / 認証済みユーザーのモック"""
    return {
        "id": "user-uuid",
        "org_id": "org-uuid",
        "role": "buyer_admin"
    }

@pytest.fixture
def mock_project_service():
    """Mock ProjectService / ProjectServiceのモック"""
    return AsyncMock()

@pytest.mark.asyncio
async def test_get_projects_success(mock_current_user, mock_project_service):
    """Test project list endpoint / プロジェクト一覧取得テスト"""
    # Arrange - Mock dependencies
    mock_project_service.list_projects.return_value = {
        "projects": [{"id": "proj-1", "title": "Test Project"}],
        "total_count": 1
    }

    with patch("app.api.routes.projects.get_current_user", return_value=mock_current_user), \
         patch("app.api.routes.projects.ProjectService", return_value=mock_project_service):

        # Act
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get(
                "/api/projects",
                headers={"Authorization": "Bearer test-token"}
            )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert len(data["projects"]) == 1
        mock_project_service.list_projects.assert_called_once()

@pytest.mark.asyncio
async def test_get_projects_unauthorized():
    """Test unauthorized access / 未認証アクセステスト"""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/projects")

    assert response.status_code == 401
```

##### 2. Services Layer Test (Service層テスト)

```python
# tests/unit/test_services/test_project_service.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.services.project_service import ProjectService
from app.schemas.project import ProjectCreate

@pytest.fixture
def mock_project_crud():
    """Mock ProjectCRUD / ProjectCRUDのモック"""
    return AsyncMock()

@pytest.fixture
def mock_openai_client():
    """Mock OpenAI client / OpenAIクライアントのモック"""
    return MagicMock()

@pytest.mark.asyncio
async def test_create_project_success(mock_project_crud):
    """Test project creation / プロジェクト作成テスト"""
    # Arrange
    mock_project_crud.create.return_value = {
        "id": "new-proj-uuid",
        "title": "New Project",
        "status": "draft"
    }
    service = ProjectService(crud=mock_project_crud)
    project_data = ProjectCreate(title="New Project", description="Test")

    # Act
    result = await service.create_project(
        org_id="org-uuid",
        user_id="user-uuid",
        data=project_data
    )

    # Assert
    assert result["id"] == "new-proj-uuid"
    assert result["status"] == "draft"
    mock_project_crud.create.assert_called_once()

@pytest.mark.asyncio
async def test_generate_ai_draft(mock_project_crud, mock_openai_client):
    """Test AI draft generation / AI草案生成テスト"""
    # Arrange
    mock_openai_client.chat.completions.create.return_value = MagicMock(
        choices=[MagicMock(message=MagicMock(content="Generated content"))]
    )
    service = ProjectService(crud=mock_project_crud, openai=mock_openai_client)

    # Act
    result = await service.generate_draft(project_id="proj-uuid")

    # Assert
    assert "Generated content" in result["content"]
    mock_openai_client.chat.completions.create.assert_called_once()

@pytest.mark.asyncio
async def test_access_denied_other_org(mock_project_crud):
    """Test access to other org's project / 他組織プロジェクトへのアクセス拒否テスト"""
    # Arrange
    mock_project_crud.get_by_id.return_value = None  # Not found for this org
    service = ProjectService(crud=mock_project_crud)

    # Act & Assert
    with pytest.raises(NotFoundException):
        await service.get_project(project_id="proj-uuid", org_id="wrong-org")
```

##### 3. CRUD Layer Test (CRUD層テスト)

```python
# tests/unit/test_crud/test_projects_crud.py
import pytest
from unittest.mock import MagicMock, AsyncMock
from app.crud.projects import ProjectCRUD

@pytest.fixture
def mock_supabase():
    """Mock Supabase client / Supabaseクライアントのモック"""
    mock = MagicMock()
    # Chainable methods / チェーン可能なメソッド
    mock.table.return_value = mock
    mock.select.return_value = mock
    mock.insert.return_value = mock
    mock.update.return_value = mock
    mock.eq.return_value = mock
    mock.order.return_value = mock
    mock.range.return_value = mock
    mock.single.return_value = mock
    return mock

@pytest.mark.asyncio
async def test_get_projects_by_org(mock_supabase):
    """Test fetching projects by organization / 組織別プロジェクト取得テスト"""
    # Arrange
    mock_supabase.execute.return_value = MagicMock(
        data=[
            {"id": "proj-1", "title": "Project 1"},
            {"id": "proj-2", "title": "Project 2"}
        ]
    )
    crud = ProjectCRUD(supabase=mock_supabase)

    # Act
    result = await crud.get_by_org(org_id="org-uuid", limit=10, offset=0)

    # Assert
    assert len(result) == 2
    mock_supabase.table.assert_called_with("projects")
    mock_supabase.eq.assert_called_with("organization_id", "org-uuid")

@pytest.mark.asyncio
async def test_create_project(mock_supabase):
    """Test project creation in DB / DB上でのプロジェクト作成テスト"""
    # Arrange
    mock_supabase.execute.return_value = MagicMock(
        data=[{"id": "new-proj", "title": "New Project", "status": "draft"}]
    )
    crud = ProjectCRUD(supabase=mock_supabase)

    # Act
    result = await crud.create({
        "title": "New Project",
        "organization_id": "org-uuid",
        "created_by": "user-uuid"
    })

    # Assert
    assert result["id"] == "new-proj"
    mock_supabase.insert.assert_called_once()

@pytest.mark.asyncio
async def test_rpc_call(mock_supabase):
    """Test Supabase RPC call / Supabase RPC呼び出しテスト"""
    # Arrange
    mock_supabase.rpc.return_value = MagicMock()
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={"status": "success", "result": {"action": "processed"}}
    )
    crud = ProjectCRUD(supabase=mock_supabase)

    # Act
    result = await crud.call_rpc("handle_status_change", {
        "p_project_id": "proj-uuid",
        "p_new_status": "in_discussion"
    })

    # Assert
    assert result["status"] == "success"
    mock_supabase.rpc.assert_called_with("handle_status_change", {
        "p_project_id": "proj-uuid",
        "p_new_status": "in_discussion"
    })
```

##### 4. External API Mock (外部APIモック)

```python
# tests/unit/test_services/test_billing_service.py
import pytest
from unittest.mock import MagicMock, patch

@pytest.mark.asyncio
async def test_create_checkout_session():
    """Test Stripe Checkout Session creation / Stripe Checkout Session作成テスト"""
    # Arrange - Mock Stripe API
    mock_session = MagicMock(
        id="cs_test_xxx",
        url="https://checkout.stripe.com/pay/cs_test_xxx"
    )

    with patch("stripe.checkout.Session.create", return_value=mock_session):
        from app.services.billing_service import BillingService
        service = BillingService()

        # Act
        result = await service.create_checkout_session(
            org_id="org-uuid",
            price_id="price_xxx",
            success_url="https://example.com/success",
            cancel_url="https://example.com/cancel"
        )

        # Assert
        assert result["session_id"] == "cs_test_xxx"
        assert "checkout.stripe.com" in result["checkout_url"]
```

### Database (Supabase)

1. **RLS**: Row Level Security required for all tables / すべてのテーブルにRow Level Security必須
2. **UUID**: Use UUID for primary keys / 主キーは UUID を使用
3. **Timestamps**: Include `created_at`, `updated_at` / `created_at`, `updated_at` を含める
4. **Naming**: Table names in plural `snake_case` / テーブル名は複数形 `snake_case`
5. **Payment/Transaction / 決済・トランザクション**:
   - Critical operations (payments, status updates) must be completed within **RPC (SQL Function)**
   - 決済や重要なステータス更新は、Python側での複数回DB操作を禁止し、必ず **RPC (SQL Function)** 内で完結させること
   - Reason: Ensures transaction consistency and idempotency
   - 理由: トランザクションの一貫性と冪等性を担保するため
   - Example: Stripe Webhook processing → Use `handle_stripe_webhook()` RPC
   - 例: Stripe Webhook処理 → `handle_stripe_webhook()` RPC を使用

## Environment Variables / 環境変数

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

### Backend (.env)
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

## API Design / API設計

### Authentication Flow / 認証フロー
1. Frontend → Supabase Auth: `signInWithPassword()`
2. Supabase Auth → Frontend: JWT Token
3. Frontend → Cloud Run: `Authorization: Bearer {JWT}`
4. Cloud Run: Verify JWT → Get user info from Supabase / JWT検証 → Supabaseでユーザー情報取得

### Endpoints (FastAPI)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects | List projects / プロジェクト一覧 |
| POST | /api/projects | Create project / プロジェクト作成 |
| POST | /api/rfi/ai-suggest | AI draft generation / AI草案生成 |
| POST | /api/chat/sessions/{id}/messages | Send chat message / チャット送信 |
| POST | /api/slides/generate | Generate slides / スライド生成 |

## Documentation / ドキュメント

### Use Case Documents / ユースケースドキュメント

Use case diagrams are managed in Mermaid format under `docs/UC/`.

ユースケース図は `docs/UC/` 配下にMermaid形式で管理されています。

```
docs/UC/
├── index.md          # Use case list + overview diagram / ユースケース一覧表 + 全体図
├── UC1.md - UC17.md  # Sequence diagrams for each use case / 各ユースケースのシーケンス図
```

### Architecture Document / アーキテクチャドキュメント

See `docs/architecture/index.md` for detailed architecture design.

詳細なアーキテクチャ設計は `docs/architecture/index.md` を参照。

- [System Architecture / システム構成図](docs/architecture/system.md)
- [Database Design (ER) / データベース設計](docs/architecture/database.md)
- [Authentication Flow / 認証フロー](docs/architecture/auth.md)
- [AI Integration / AI連携](docs/architecture/ai-integration.md)
- [State Machines / 状態遷移](docs/architecture/state-machine.md)
- [Payments / 決済](docs/architecture/payments.md)
- [Software Layers / ソフトウェア層](docs/architecture/layers.md)
- [API Endpoints / APIエンドポイント](docs/architecture/api-endpoints.md)
- [CI/CD Pipeline / CI/CDパイプライン](docs/architecture/cicd.md)
- [Security / セキュリティ](docs/architecture/security.md)
- [Cost Estimation / コスト見積もり](docs/architecture/cost.md)

## Development Notes / 開発メモ

1. **Supabase RLS**: Configure RLS policies before production / 本番前に必ずRLSポリシーを設定
2. **Environment Variables**: `.env` file must be in `.gitignore` / `.env` ファイルは `.gitignore` に含める
3. **CORS**: Configure allowed origins on Cloud Run / Cloud Run側で許可オリジンを設定
4. **Type Safety**: Auto-generate Supabase type definitions / Supabaseの型定義を自動生成して使用

## Documentation Strategy / ドキュメント戦略

This project enforces "Code First" and "Diagram First" principles to minimize maintenance overhead from static documentation.

本プロジェクトでは "Code First" および "Diagram First" を徹底し、メンテナンスコストの高い静的ドキュメントの作成を禁止します。

### 1. Single Source of Truth (SSOT) / 単一の情報源

Each type of information has exactly one authoritative source. Do not duplicate information elsewhere.

各情報の正解（マスター）は以下の場所にのみ存在します。重複して別の場所に記述しないでください。

| Information / 情報 | Source of Truth / 正の場所 | Notes / 備考 |
|-------------------|---------------------------|--------------|
| System Architecture & Flows | `docs/architecture/` | Mermaid diagrams are authoritative / Mermaid図解が正 |
| Use Cases | `docs/UC/*.md` | Mermaid sequence diagrams / Mermaidシーケンス図が正 |
| Database Schema | `supabase/migrations/*.sql` | Implemented SQL is authoritative / 実装されたSQLが正 |
| API Specification | `backend/app/schemas/*.py` | Pydantic models; Swagger UI auto-generated / Pydanticモデルが正、Swagger UIは自動生成 |
| UI/Design | [Figma](https://www.figma.com/design/p99AEtAPAzX11UGz461gfJ/) | Design source of truth / デザインの正 |
| Coding Rules | `CLAUDE.md` | This file / このファイル |
| GitLab Workflow | `CONTRIBUTING.md` | Branch, commit, merge rules / ブランチ、コミット、マージルール |

### 2. Forbidden Documents / 作成禁止ドキュメント

The following documents are prone to becoming outdated and must not be created or maintained.

以下のドキュメントは陳腐化しやすいため、作成・維持を禁止します。

| ❌ Forbidden / 禁止 | ✅ Alternative / 代替 |
|--------------------|----------------------|
| Hand-written API specs (OpenAPI YAML/JSON, Excel) / 手書きのAPI仕様書 | Pydantic + Swagger UI (auto-generated) / Pydantic + Swagger自動生成 |
| Detailed table definitions (Excel) / 詳細なテーブル定義書 | ER diagram (`architecture.md`) + SQL / ER図 + SQL |
| Screen transition diagrams, UI specs / 画面遷移図・UI仕様書 | Figma + Implementation / Figma + 実装 |
| Validation rule documents / バリデーション定義書 | Defined in Pydantic models / Pydanticモデル内で定義 |

### 3. Workflow / ワークフロー

1. When changing specifications, first update **Mermaid diagrams** in `docs/architecture/`
2. Then modify the code accordingly
3. API type definitions must be in Pydantic models under `schemas/`

---

1. 仕様変更時は、まず `docs/architecture/` の **Mermaid図** を更新
2. その後にコードを修正
3. APIの型定義は必ず `schemas/` 内の Pydantic モデルで行う

### 4. Bilingual Documentation / 日英併記ルール

All markdown documentation (`*.md`) must be written in both English and Japanese to support international team collaboration.

すべてのマークダウンドキュメント (`*.md`) は、海外チームとの連携のため日英両言語で記載すること。
