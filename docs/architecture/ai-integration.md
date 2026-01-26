# 4. Project Plan Generation Flow (AI Integration) / プロジェクト計画書生成フロー (AI連携)

[← Back to Index / 目次に戻る](./index.md)

---

**Key Points / ポイント:**
- OpenAI API supports **streaming** / OpenAI API は **ストリーミング対応**
- Generated results are saved as **embeddings** (for future similarity search) / 生成結果は **embedding** として保存（将来の類似検索用）

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant FE as Next.js
    participant API as Cloud Run
    participant AI as OpenAI API
    participant DB as PostgreSQL

    rect rgb(255, 250, 240)
        Note over User, DB: Project Plan Draft Generation / プロジェクト計画書草案生成
        User->>FE: Enter project overview / プロジェクト概要入力<br/>"Lumber wholesaler DX / 材木卸問屋のDX推進"
        FE->>API: POST /api/project-plans/ai-suggest<br/>{prompt, project_id}

        API->>AI: POST /v1/chat/completions<br/>{model: "gpt-4", messages: [...]}
        AI-->>API: Stream: "Background... / 背景として..."
        AI-->>API: Stream: "Purpose is... / 目的は..."
        AI-->>API: Stream: [DONE]

        API->>DB: INSERT INTO chat_messages<br/>{role: "assistant", content}
        API->>AI: POST /v1/embeddings<br/>{input: content}
        AI-->>API: {embedding: [0.1, 0.2, ...]}
        API->>DB: UPDATE chat_messages<br/>SET embedding = [...]

        API-->>FE: 200 OK<br/>{content, message_id}
        FE-->>User: Display Project Plan draft / プロジェクト計画書草案表示
    end
```

---

[← Previous: Authentication Flow / 前へ: 認証フロー](./auth.md) | [Next: State Machines / 次へ: 状態遷移 →](./state-machine.md)
