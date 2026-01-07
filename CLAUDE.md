# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PEP (Project Enhancement Platform) は、AI技術を活用してRFI（情報提供依頼）の作成・管理を支援するBtoB SaaSプラットフォームです。BuyerとVendor間のコミュニケーションを効率化し、プロジェクト計画書の自動生成機能を提供します。

## Architecture

### Cloud Native構成

| コンポーネント | 技術 | 説明 |
|---------------|------|------|
| Frontend | Angular 21 | Firebase Hostingへデプロイ |
| Backend | FastAPI | Cloud Run (サーバーレス) |
| Database | Supabase (PostgreSQL + pgvector) | マネージドDB |
| Auth | Supabase Auth | JWT認証 |
| Storage | Supabase Storage | ファイル保存 |
| AI | OpenAI API | RFI草案生成・チャット |
| Payment | Stripe | サブスクリプション決済 |

### システム構成

```
Angular (Firebase Hosting)
    ↓
    ├── Supabase Auth (認証)
    ├── Supabase Realtime (WebSocket)
    └── Cloud Run (FastAPI)
            ↓
            ├── Supabase DB (PostgreSQL)
            ├── Supabase Storage
            ├── OpenAI API
            └── Stripe API
```

## Key Commands

### Frontend (Angular)
```bash
cd frontend
npm install              # Install dependencies
npm start               # Start dev server at http://localhost:4200
npm run build           # Production build
npm test                # Run unit tests with Vitest
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload  # Start dev server at http://localhost:8000
```

### Supabase
```bash
supabase db push         # Apply migrations
supabase gen types typescript --local > frontend/src/app/core/types/database.types.ts
```

### Deployment
```bash
# Backend (Cloud Run)
gcloud run deploy pep-api --source ./backend --region asia-northeast1

# Frontend (Firebase Hosting)
cd frontend && ng build --configuration production
firebase deploy --only hosting
```

## Project Structure

```
pep/
├── frontend/                      # Angular 21
│   ├── src/app/
│   │   ├── core/                  # Core services & guards
│   │   │   ├── services/
│   │   │   │   ├── supabase.service.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   └── storage.service.ts
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── features/
│   │   │   ├── auth/              # Login, Register, Password Reset
│   │   │   ├── buyer/             # Buyer機能
│   │   │   ├── vendor/            # Vendor機能
│   │   │   ├── chat/              # AIチャット
│   │   │   └── shared/            # 共通コンポーネント
│   │   └── environments/
│   └── firebase.json
│
├── backend/                       # FastAPI
│   ├── app/
│   │   ├── api/routes/            # Controller層 (エンドポイント)
│   │   ├── services/              # Service層 (ビジネスロジック)
│   │   ├── crud/                  # Data Access層 (DB操作)
│   │   ├── core/                  # Config, Supabase client
│   │   └── schemas/               # Pydantic models
│   ├── templates/                 # PDF生成用HTML
│   ├── Dockerfile
│   └── requirements.txt
│
├── supabase/                      # Supabase設定
│   ├── migrations/                # DBマイグレーション
│   └── functions/                 # Edge Functions
│
└── docs/                          # ドキュメント
    ├── UC/                        # ユースケース図
    └── architecture.md            # アーキテクチャ設計書
```

## Coding Conventions

### TypeScript / Angular

1. **Standalone Components**: すべてのコンポーネントは standalone: true
2. **Strict Mode**: TypeScript strict mode 必須
3. **File Structure**: コンポーネントは .ts, .html, .scss に分離
4. **Naming**:
   - Components: `feature-name.component.ts`
   - Services: `feature-name.service.ts`
   - Guards: `feature-name.guard.ts`
5. **Imports**:
   - Angular標準 → 外部ライブラリ → 内部モジュール の順

### Python / FastAPI

1. **Type Hints**: すべての関数に型ヒント必須
2. **Pydantic**: リクエスト/レスポンスはPydanticモデルで定義
3. **Async**: I/O操作は async/await を使用
4. **Naming**:
   - Functions: `snake_case`
   - Classes: `PascalCase`
   - Constants: `UPPER_SNAKE_CASE`
5. **Layering (3層構造)**:
   - `api/routes/` → `services/` → `crud/` の順で呼び出し
   - **`logic/` フォルダは作成しない** (ビジネスロジックは `services/` に統合)
   - 逆方向の依存禁止 (crud から services を呼ばない)
6. **Transaction Control**:
   - 単一CRUD操作は Service層 → CRUD でそのまま実行
   - 複数テーブル操作・決済などは **Supabase RPC** を使用 (`supabase-py` はトランザクション非対応)

### Database (Supabase)

1. **RLS**: すべてのテーブルにRow Level Security必須
2. **UUID**: 主キーは UUID を使用
3. **Timestamps**: `created_at`, `updated_at` を含める
4. **Naming**: テーブル名は複数形 `snake_case`
5. **Payment/Transaction**: 決済や重要なステータス更新は、Python側での複数回DB操作を禁止し、必ず **RPC (SQL Function)** 内で完結させること
   - 理由: トランザクションの一貫性と冪等性を担保するため
   - 例: Stripe Webhook処理 → `handle_stripe_webhook()` RPC を使用

## Environment Variables

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  supabaseUrl: 'https://xxxxx.supabase.co',
  supabaseAnonKey: 'eyJ...',
  apiBaseUrl: 'http://localhost:8000',
};
```

### Backend (.env)
```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:4200
```

## API Design

### Authentication Flow
1. Frontend → Supabase Auth: `signInWithPassword()`
2. Supabase Auth → Frontend: JWT Token
3. Frontend → Cloud Run: `Authorization: Bearer {JWT}`
4. Cloud Run: JWT検証 → Supabaseでユーザー情報取得

### Endpoints (FastAPI)
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/projects | プロジェクト一覧 |
| POST | /api/projects | プロジェクト作成 |
| POST | /api/rfi/ai-suggest | AI草案生成 |
| POST | /api/chat/sessions/{id}/messages | チャット送信 |
| POST | /api/slides/generate | スライド生成 |

## Documentation

### Use Case Documents
ユースケース図は `docs/UC/` 配下にMermaid形式で管理されています。

```
docs/UC/
├── index.md          # ユースケース一覧表 + 全体図
├── UC1.md - UC17.md  # 各ユースケースのシーケンス図
```

### Architecture Document
詳細なアーキテクチャ設計は `docs/architecture.md` を参照。

- システム構成図
- データベース設計 (ER図)
- API設計
- デプロイ構成
- セキュリティ設計

## Development Notes

1. **Supabase RLS**: 本番前に必ずRLSポリシーを設定
2. **環境変数**: `.env` ファイルは `.gitignore` に含める
3. **CORS**: Cloud Run側で許可オリジンを設定
4. **型安全**: Supabaseの型定義を自動生成して使用
