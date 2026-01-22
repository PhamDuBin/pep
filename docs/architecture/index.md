# PEP Architecture Design / PEP アーキテクチャ設計書

This directory contains the architecture documentation for the PEP (Project Enhancement Platform) system.

このディレクトリには、PEP（Project Enhancement Platform）システムのアーキテクチャドキュメントが含まれています。

## Table of Contents / 目次

| Document | Description |
|----------|-------------|
| [1. System Architecture / システム構成図](./system.md) | Cloud Run + Supabase architecture overview / Cloud Run + Supabase アーキテクチャ概要 |
| [2. Database Design / データベース設計](./database.md) | ER diagram and table definitions / ER図とテーブル定義 |
| [3. Authentication Flow / 認証フロー](./auth.md) | Supabase Auth JWT-based authentication / Supabase Auth JWT ベース認証 |
| [4. AI Integration / AI連携](./ai-integration.md) | OpenAI API for RFI generation / OpenAI API による RFI 生成 |
| [5. State Machines / 状態遷移](./state-machine.md) | Project and RFI response state transitions / プロジェクトと RFI 回答の状態遷移 |
| [6. Payments / 決済](./payments.md) | Stripe integration and webhook handling / Stripe 連携と Webhook 処理 |
| [7. Software Layers / ソフトウェア層](./layers.md) | 3-layer architecture and transaction control / 3層アーキテクチャとトランザクション制御 |
| [8. API Endpoints / API エンドポイント](./api-endpoints.md) | REST API endpoint list / REST API エンドポイント一覧 |
| [9. CI/CD Pipeline / CI/CD パイプライン](./cicd.md) | GitLab CI/CD to Cloud Run deployment / GitLab CI/CD から Cloud Run デプロイ |
| [10. Security / セキュリティ](./security.md) | Security checklist / セキュリティチェックリスト |
| [11. Cost Estimation / コスト見積もり](./cost.md) | Monthly cost estimates by scale / 規模別月額コスト見積もり |

---

## Technology Selection / 技術選定

**Technology Selection Rationale / 技術選定の理由:**
- **Next.js (App Router)**: React-based SSR/SSG, optimized DX, TypeScript-first / Reactベース SSR/SSG、優れたDX、TypeScriptファースト
- **Cloud Run**: Serverless, pay-per-use, auto-scaling (0→N) / サーバーレス・従量課金・自動スケール (0→N)
- **Supabase**: All-in-one DB/Auth/Storage/Realtime, reduced operational costs / DB/Auth/Storage/Realtimeを一括提供、運用コスト削減
- **OpenAI**: Quality of RFI draft generation with GPT-4 / GPT-4によるRFI草案生成の品質

---

## References / 参考資料

- [Use Case List / ユースケース一覧](../UC/index.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Cloud Run Docs](https://cloud.google.com/run/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
