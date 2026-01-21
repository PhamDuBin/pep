# 2. Database Design (ER Diagram) / データベース設計 (ER図)

[← Back to Index / 目次に戻る](./index.md)

---

**Constraints / 制約事項:**
- **RLS (Row Level Security)** required for all tables / すべてのテーブルに **RLS (Row Level Security)** 必須
- Use **UUID** for primary keys / 主キーは **UUID** を使用
- `auth.users` is managed by Supabase Auth (no direct manipulation) / `auth.users` は Supabase Auth が管理（直接操作不可）
- All tables include `created_at`, `updated_at` timestamps / 全テーブルに `created_at`, `updated_at` を含める

---

## ER Diagram / ER図

```mermaid
erDiagram
    %% ===== Account Management / アカウント管理 =====
    auth_users ||--|| profiles : "1:1"
    profiles }o--|| organizations : "belongs_to"
    organizations ||--o{ invitations : "sends"
    organizations ||--o{ vendor_applications : "applies"

    %% ===== RFI Management / RFI管理 =====
    organizations ||--o{ projects : "owns (Buyer)"
    profiles ||--o{ projects : "creates"
    projects ||--o{ project_vendors : "targets"
    organizations ||--o{ project_vendors : "receives (Vendor)"
    projects ||--o{ rfi_documents : "has"

    %% ===== Chat / チャット =====
    projects ||--o{ chat_rooms : "has"
    organizations ||--o{ chat_rooms : "participates"
    chat_rooms ||--o{ chat_room_members : "has"
    profiles ||--o{ chat_room_members : "joins"
    chat_rooms ||--o{ chat_messages : "contains"
    profiles ||--o{ chat_messages : "sends"
    chat_rooms ||--o{ chat_read_status : "tracks"
    profiles ||--o{ chat_read_status : "reads"

    %% ===== AI Chat Sessions / AIチャットセッション =====
    profiles ||--o{ ai_chat_sessions : "owns"
    projects ||--o{ ai_chat_sessions : "relates"
    ai_chat_sessions ||--o{ ai_chat_messages : "contains"

    %% ========================================
    %% Table Definitions / テーブル定義
    %% ========================================

    auth_users {
        uuid id PK "Managed by Supabase / Supabase管理"
        string email UK
        timestamp created_at
    }

    profiles {
        uuid id PK "= auth.users.id"
        uuid org_id FK "nullable until org joined"
        string email "from auth.users"
        string display_name
        string department "nullable"
        string avatar_url "nullable"
        enum role "admin | member"
        enum status "active | inactive | pending"
        timestamp created_at
        timestamp updated_at
    }

    organizations {
        uuid id PK
        string name
        enum type "buyer | vendor"
        enum status "active | inactive | pending | suspended"
        timestamp created_at
        timestamp updated_at
    }

    invitations {
        uuid id PK
        uuid org_id FK
        uuid invited_by FK "profiles.id"
        string email
        enum role "admin | member"
        string token UK "for email link"
        enum status "pending | accepted | expired"
        timestamp expires_at
        timestamp created_at
    }

    vendor_applications {
        uuid id PK
        uuid org_id FK
        string company_name
        string contact_email
        text business_description
        enum status "pending | approved | rejected"
        uuid reviewed_by FK "nullable, profiles.id"
        text review_note "nullable"
        timestamp reviewed_at "nullable"
        timestamp created_at
        timestamp updated_at
    }

    projects {
        uuid id PK
        uuid buyer_org_id FK
        uuid created_by FK "profiles.id"
        string title
        text description "nullable"
        enum status "draft | in_discussion | closed"
        timestamp started_at "nullable"
        timestamp closed_at "nullable"
        timestamp created_at
        timestamp updated_at
    }

    project_vendors {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        enum status "pending | notified | read"
        timestamp notified_at "nullable"
        timestamp read_at "nullable"
        timestamp created_at
    }

    rfi_documents {
        uuid id PK
        uuid project_id FK
        string file_name
        string file_path "Supabase Storage path"
        string mime_type
        int file_size "bytes"
        uuid uploaded_by FK "profiles.id"
        timestamp created_at
    }

    chat_rooms {
        uuid id PK
        uuid project_id FK
        uuid buyer_org_id FK
        uuid vendor_org_id FK
        timestamp created_at
    }

    chat_room_members {
        uuid id PK
        uuid room_id FK
        uuid user_id FK "profiles.id"
        uuid added_by FK "profiles.id, nullable"
        timestamp added_at
    }

    chat_messages {
        uuid id PK
        uuid room_id FK
        uuid sender_id FK "profiles.id"
        text content
        enum message_type "text | file | system"
        string file_url "nullable"
        timestamp created_at
    }

    chat_read_status {
        uuid id PK
        uuid room_id FK
        uuid user_id FK "profiles.id"
        timestamp last_read_at
    }

    ai_chat_sessions {
        uuid id PK
        uuid user_id FK "profiles.id"
        uuid project_id FK "nullable"
        string title "nullable"
        boolean is_presentation_mode "for slide generation"
        timestamp created_at
        timestamp updated_at
    }

    ai_chat_messages {
        uuid id PK
        uuid session_id FK
        enum role "user | assistant | system"
        text content
        jsonb metadata "nullable"
        vector embedding "pgvector, 1536 dim"
        timestamp created_at
    }
```

---

## Table Summary / テーブル一覧

| Category | Table | Description | Related UC |
|----------|-------|-------------|------------|
| Account | `profiles` | User profiles linked to auth.users / auth.usersに紐づくユーザープロフィール | UC01, UC16 |
| Account | `organizations` | Buyer/Vendor organizations / Buyer/Vendor組織 | UC01, UC03, UC17 |
| Account | `invitations` | Member invitation tokens / メンバー招待トークン | UC02 |
| Account | `vendor_applications` | Vendor application for approval / Vendor利用あ申請 | UC03 |
| RFI | `projects` | RFI projects (Draft → In Discussion → Closed) / RFIプロジェクト | UC06, UC07, UC10, UC11 |
| RFI | `project_vendors` | Project-Vendor assignments / プロジェクトとVendorの紐付け | UC07, UC08 |
| RFI | `rfi_documents` | Attached files / 添付ファイル | UC06, UC07 |
| Chat | `chat_rooms` | Buyer-Vendor chat rooms per project / プロジェクト毎のBuyer-Vendorチャットルーム | UC09 |
| Chat | `chat_messages` | Chat messages / チャットメッセージ | UC09 |
| Chat | `chat_read_status` | Read status for unread badge / 既読状態（未読バッジ用） | UC12 |
| AI | `ai_chat_sessions` | AI chat sessions for RFI drafting / RFI草案作成用AIチャットセッション | UC06 |
| AI | `ai_chat_messages` | AI chat messages with embeddings / embedding付きAIチャットメッセージ | UC06 |

---

## Notes / 備考

1. **Vendor Contracts & Payments**: Payment-related tables (`subscriptions`, `stripe_event_logs`, etc.) will be added separately.
   / 決済関連テーブル（`subscriptions`, `stripe_event_logs` 等）は別途追加予定。

2. **RLS Policies**: Each table requires RLS policies based on `org_id` and user role.
   / 各テーブルには `org_id` とユーザーロールに基づくRLSポリシーが必要。

3. **Soft Delete**: Consider adding `deleted_at` for soft delete if needed.
   / 必要に応じて `deleted_at` による論理削除を検討。

---

[← Previous: System Architecture / 前へ: システム構成図](./system.md) | [Next: Authentication Flow / 次へ: 認証フロー →](./auth.md)
