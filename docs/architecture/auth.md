# 3. Authentication Flow / 認証フロー

[← Back to Index / 目次に戻る](./index.md)

---

**Key Points / ポイント:**
- JWT is issued and verified by **Supabase Auth** / JWTは **Supabase Auth** が発行・検証
- Backend uses **Service Role Key** for DB operations / バックエンドは **Service Role Key** でDB操作

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Angular
    participant Auth as Supabase Auth
    participant API as Cloud Run<br/>(FastAPI)
    participant DB as PostgreSQL

    rect rgb(240, 248, 255)
        Note over User, Auth: Login Process / ログイン処理
        User->>FE: Enter email/password / メール/パスワード入力
        FE->>Auth: POST /auth/v1/token<br/>{email, password}
        Auth->>Auth: Verify password / パスワード検証
        Auth-->>FE: {access_token, refresh_token}
        FE->>FE: Save to localStorage / localStorage に保存
    end

    rect rgb(240, 255, 240)
        Note over User, DB: API Call / API呼び出し
        User->>FE: Create project / プロジェクト作成
        FE->>API: POST /api/projects<br/>Authorization: Bearer {JWT}
        API->>Auth: GET /auth/v1/user<br/>Verify JWT / JWT検証
        Auth-->>API: {user_id, email, ...}
        API->>DB: INSERT INTO projects
        DB-->>API: Creation result / 作成結果
        API-->>FE: 201 Created<br/>{project_id}
    end
```

---

[← Previous: Database Design / 前へ: データベース設計](./database.md) | [Next: AI Integration / 次へ: AI連携 →](./ai-integration.md)
