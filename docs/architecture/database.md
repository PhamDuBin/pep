# 2. Database Design (ER Diagram) / データベース設計 (ER図)

[← Back to Index / 目次に戻る](./index.md)

---

**Constraints / 制約事項:**
- **RLS (Row Level Security)** required for all tables / すべてのテーブルに **RLS (Row Level Security)** 必須
- Use **UUID** for primary keys / 主キーは **UUID** を使用
- `auth.users` is managed by Supabase Auth (no direct manipulation) / `auth.users` は Supabase Auth が管理（直接操作不可）

```mermaid
erDiagram
    auth_users ||--|| profiles : "1:1"
    profiles }o--|| organizations : "belongs_to"
    organizations ||--o{ vendor_contracts : "has"
    profiles ||--o{ projects : "creates"
    profiles ||--o{ chat_sessions : "owns"
    projects ||--o{ project_vendors : "has"
    projects ||--o{ rfi_responses : "receives"
    organizations ||--o{ project_vendors : "participates"
    organizations ||--o{ rfi_responses : "submits"
    chat_sessions ||--o{ chat_messages : "contains"

    auth_users {
        uuid id PK "Managed by Supabase / Supabase管理"
        string email UK
        timestamp created_at
    }

    profiles {
        uuid id PK "= auth.users.id"
        uuid org_id FK
        string display_name
        enum role "Admin | Member"
        enum status "Active | Inactive"
        timestamp created_at
        timestamp updated_at
    }

    organizations {
        uuid id PK
        string name
        enum type "Buyer | Vendor"
        enum status "Active | Inactive"
        timestamp created_at
        timestamp updated_at
    }

    vendor_contracts {
        uuid id PK
        uuid org_id FK
        enum status "Active | Expired | Cancelled"
        date start_date
        date end_date
    }

    projects {
        uuid id PK
        uuid buyer_org_id FK
        uuid created_by FK
        string title
        text body
        enum status "Draft | InDiscussion | Closed"
        timestamp started_at
        timestamp created_at
        timestamp updated_at
    }

    project_vendors {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        enum notify_status "Pending | Sent | Read"
        timestamp created_at
    }

    rfi_responses {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        text response_body
        enum status "Draft | Submitted"
        timestamp submitted_at
        timestamp created_at
    }

    chat_sessions {
        uuid id PK
        uuid user_id FK
        uuid project_id FK "nullable"
        boolean presentation_mode
        timestamp created_at
    }

    chat_messages {
        uuid id PK
        uuid session_id FK
        enum role "user | assistant | system"
        text content
        jsonb metadata
        vector_1536 embedding "pgvector"
        timestamp created_at
    }
```

---

[← Previous: System Architecture / 前へ: システム構成図](./system.md) | [Next: Authentication Flow / 次へ: 認証フロー →](./auth.md)
