# 9. CI/CD Pipeline / CI/CD パイプライン

[← Back to Index / 目次に戻る](./index.md)

---

```mermaid
graph LR
    subgraph Dev["Development Environment / 開発環境"]
        LC[Local Development / ローカル開発]
    end

    subgraph CI["GitLab CI/CD"]
        Push[git push]
        Test[pytest<br/>Run tests / テスト実行]
        Build[Docker Build]
    end

    subgraph Prod["Production Environment / 本番環境"]
        CR[Cloud Run<br/>FastAPI]
        SB[Supabase<br/>DB/Auth]
    end

    LC --> Push
    Push --> Test
    Test -->|pass| Build
    Build --> CR
    Push -.->|migration| SB

    classDef ci fill:#FC6D26,stroke:#E24329,color:#fff
    class Push,Test,Build ci
```

---

[← Previous: API Endpoints / 前へ: API エンドポイント](./api-endpoints.md) | [Next: Security / 次へ: セキュリティ →](./security.md)
