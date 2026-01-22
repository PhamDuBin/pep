# 1. System Architecture / システム構成図

[← Back to Index / 目次に戻る](./index.md)

---

**Technology Selection Rationale / 技術選定の理由:**
- **Next.js (App Router)**: React-based SSR/SSG, optimized DX, TypeScript-first / Reactベース SSR/SSG、優れたDX、TypeScriptファースト
- **Cloud Run**: Serverless, pay-per-use, auto-scaling (0→N) / サーバーレス・従量課金・自動スケール (0→N)
- **Supabase**: All-in-one DB/Auth/Storage/Realtime, reduced operational costs / DB/Auth/Storage/Realtimeを一括提供、運用コスト削減
- **OpenAI**: Quality of RFI draft generation with GPT-4 / GPT-4によるRFI草案生成の品質

```mermaid
graph TB
    subgraph Frontend["Frontend (UI/BFF)"]
        FE[/"Next.js 16+ (App Router)<br/>Cloud Run or Vercel"/]
    end

    subgraph Backend["Backend (FastAPI)"]
        CR[["Cloud Run<br/>asia-northeast1"]]
    end

    subgraph Supabase["Supabase (BaaS)"]
        Auth([Supabase Auth<br/>JWT Issuance / JWT発行])
        DB[(PostgreSQL<br/>+ pgvector)]
        Storage[(Storage<br/>S3 Compatible / S3互換)]
        RT{{Realtime<br/>WebSocket}}
    end

    subgraph External["External Services"]
        AI[/OpenAI API<br/>GPT-4/]
        Pay[/Stripe API<br/>Payment / 決済/]
    end

    FE -->|"Authentication / 認証"| Auth
    FE -->|"REST API (BFF Proxy)"| CR
    FE -.->|"Realtime Notifications / リアルタイム通知"| RT

    CR -->|"CRUD"| DB
    CR -->|"File Operations / ファイル操作"| Storage
    CR -->|"AI Generation / AI生成"| AI
    CR -->|"Payment Processing / 決済処理"| Pay

    Auth -->|"User Info / ユーザー情報"| DB

    classDef frontend fill:#4285F4,stroke:#1967D2,color:#fff
    classDef backend fill:#34A853,stroke:#1E8E3E,color:#fff
    classDef supabase fill:#3ECF8E,stroke:#24B47E,color:#fff
    classDef external fill:#FBBC04,stroke:#F29900,color:#000

    class FE frontend
    class CR backend
    class Auth,DB,Storage,RT supabase
    class AI,Pay external
```

> **Note / 注意**: Next.js has API Routes and Server Actions, but this project **prohibits implementing business logic** in them. Next.js acts only as UI/BFF; all logic must be delegated to FastAPI (`backend/`).
>
> Next.jsにはAPI RoutesやServer Actionsがありますが、本プロジェクトでは**ビジネスロジックの実装を禁止**しています。Next.jsはUI/BFFとしてのみ機能し、ロジックは全てFastAPI (`backend/`) に委譲すること。

---

[Next: Database Design / 次へ: データベース設計 →](./database.md)
