# 2. Database Design (ER Diagram) / データベース設計 (ER図)

[← Back to Index / 目次に戻る](./index.md)

---

**Constraints / 制約事項:**
- **RLS (Row Level Security)** required for all tables / すべてのテーブルに **RLS (Row Level Security)** 必須
- Use **UUID** for primary keys / 主キーは **UUID** を使用
- `auth.users` is managed by Supabase Auth (no direct manipulation) / `auth.users` は Supabase Auth が管理（直接操作不可）

**User Model / ユーザーモデル: Platform Organization Unified Model**

All users belong to exactly one organization. User types are determined by `organizations.type`:
全ユーザーは必ず1つの組織に所属。ユーザー種別は `organizations.type` で判定:

| User Type | organizations.type | Description |
|-----------|-------------------|-------------|
| Buyer | `buyer` | Buyer organization users / Buyer組織のユーザー |
| Vendor | `vendor` | Vendor organization users / Vendor組織のユーザー |
| Platform Admin | `platform` | Platform admin users / プラットフォーム管理者 |

**Common Audit Fields / 共通監査フィールド:**

All tables (except `auth_users`) include the following audit fields:
`auth_users` 以外の全テーブルに以下の監査フィールドを含める:

| Field | Type | Description |
|-------|------|-------------|
| `created_by` | uuid FK | Creator (profiles.id) / 作成者 |
| `created_at` | timestamp | Creation time / 作成日時 |
| `updated_by` | uuid FK nullable | Last updater (profiles.id) / 更新者 |
| `updated_at` | timestamp | Last update time / 更新日時 |
| `is_deleted` | boolean | Soft delete flag (default: false) / 削除フラグ |

---

## ER Diagram / ER図

```mermaid
erDiagram
    %% ===== Account Management / アカウント管理 =====
    auth_users ||--|| profiles : "1:1"
    organizations ||--o{ profiles : "has_many"
    organizations ||--o| buyer_org_details : "has (if buyer)"
    organizations ||--o| vendor_org_details : "has (if vendor)"
    organizations ||--o{ invitations : "sends"
    organizations ||--o{ buyer_applications : "applies (Buyer)"
    organizations ||--o{ vendor_applications : "applies (Vendor)"

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
        uuid org_id FK "NOT NULL"
        string email "from auth.users"
        string display_name
        string department "nullable"
        string avatar_url "nullable"
        string avatar_color "nullable, アバター背景色"
        enum role "owner | admin | member"
        enum status "active | inactive | pending"
        uuid created_by FK "profiles.id, nullable for self-signup"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    organizations {
        uuid id PK
        string name
        enum type "buyer | vendor | platform"
        enum status "active | inactive | pending | suspended"
        string stripe_customer_id "nullable, Stripe Customer ID"
        uuid created_by FK "profiles.id, nullable for seed"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    buyer_org_details {
        uuid org_id PK_FK "organizations.id"
        string industry "nullable, 業種"
        string employee_count "nullable, 従業員規模"
        text purpose "nullable, 利用目的"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    vendor_org_details {
        uuid org_id PK_FK "organizations.id"
        string industry "nullable, 業種"
        string employee_count "nullable, 従業員規模"
        text business_description "nullable, 事業内容"
        text service_description "nullable, 提供サービス"
        string website_url "nullable, Webサイト"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    invitations {
        uuid id PK
        uuid org_id FK
        string email
        enum role "admin | member"
        string token UK "for email link"
        enum status "pending | accepted | expired"
        timestamp expires_at
        uuid created_by FK "profiles.id (= invited_by)"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    buyer_applications {
        uuid id PK
        uuid org_id FK
        string company_name
        string contact_email
        string industry "nullable, 業種"
        string employee_count "nullable, 従業員規模"
        text purpose "nullable, 利用目的"
        enum status "pending | approved | rejected"
        uuid reviewed_by FK "profiles.id, nullable"
        text review_note "nullable"
        timestamp reviewed_at "nullable"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    vendor_applications {
        uuid id PK
        uuid org_id FK
        string company_name
        string contact_email
        string industry "nullable, 業種"
        string employee_count "nullable, 従業員規模"
        text business_description "nullable, 事業内容"
        text service_description "nullable, 提供サービス"
        string website_url "nullable"
        enum status "pending | approved | rejected"
        uuid reviewed_by FK "profiles.id, nullable"
        text review_note "nullable"
        timestamp reviewed_at "nullable"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    projects {
        uuid id PK
        uuid buyer_org_id FK
        string title
        text description "nullable"
        enum status "draft | in_discussion | closed"
        timestamp started_at "nullable"
        timestamp closed_at "nullable"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    project_vendors {
        uuid id PK
        uuid project_id FK
        uuid vendor_org_id FK
        enum status "pending | notified | read"
        timestamp notified_at "nullable"
        timestamp read_at "nullable"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    rfi_documents {
        uuid id PK
        uuid project_id FK
        string file_name
        string file_path "Supabase Storage path"
        string mime_type
        int file_size "bytes"
        uuid created_by FK "profiles.id (= uploaded_by)"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    chat_rooms {
        uuid id PK
        uuid project_id FK
        uuid buyer_org_id FK
        uuid vendor_org_id FK
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    chat_room_members {
        uuid id PK
        uuid room_id FK
        uuid user_id FK "profiles.id"
        uuid created_by FK "profiles.id (= added_by)"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    chat_messages {
        uuid id PK
        uuid room_id FK
        uuid sender_id FK "profiles.id"
        text content
        enum message_type "text | file | system"
        string file_url "nullable"
        uuid created_by FK "profiles.id (= sender_id)"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    chat_read_status {
        uuid id PK
        uuid room_id FK
        uuid user_id FK "profiles.id"
        timestamp last_read_at
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    ai_chat_sessions {
        uuid id PK
        uuid user_id FK "profiles.id (owner)"
        uuid project_id FK "nullable"
        string title "nullable"
        boolean is_presentation_mode "for slide generation"
        uuid created_by FK "profiles.id"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }

    ai_chat_messages {
        uuid id PK
        uuid session_id FK
        enum role "user | assistant | system"
        text content
        jsonb metadata "nullable"
        vector embedding "pgvector, 1536 dim"
        uuid created_by FK "profiles.id, nullable for assistant"
        timestamp created_at
        uuid updated_by FK "profiles.id, nullable"
        timestamp updated_at
        boolean is_deleted "default false"
    }
```

---

## Table Summary / テーブル一覧

| Category | Table | Description | Related UC |
|----------|-------|-------------|------------|
| Account | `profiles` | User profiles linked to auth.users / auth.usersに紐づくユーザープロフィール | UC01, UC16 |
| Account | `organizations` | Buyer/Vendor/Platform organizations / Buyer/Vendor/Platform組織 | UC01, UC03, UC17 |
| Account | `buyer_org_details` | Buyer organization details (1:1) / Buyer組織の詳細情報 | UC01 |
| Account | `vendor_org_details` | Vendor organization details (1:1) / Vendor組織の詳細情報 | UC03 |
| Account | `invitations` | Member invitation tokens / メンバー招待トークン | UC02 |
| Account | `buyer_applications` | Buyer application for approval / Buyer利用申請 | UC01 |
| Account | `vendor_applications` | Vendor application for approval / Vendor利用申請 | UC03 |
| RFI | `projects` | RFI projects (Draft → In Discussion → Closed) / RFIプロジェクト | UC06, UC07, UC10, UC11 |
| RFI | `project_vendors` | Project-Vendor assignments / プロジェクトとVendorの紐付け | UC07, UC08 |
| RFI | `rfi_documents` | Attached files / 添付ファイル | UC06, UC07 |
| Chat | `chat_rooms` | Buyer-Vendor chat rooms per project / プロジェクト毎のBuyer-Vendorチャットルーム | UC09 |
| Chat | `chat_room_members` | Chat room participants / チャットルーム参加者 | UC09 |
| Chat | `chat_messages` | Chat messages / チャットメッセージ | UC09 |
| Chat | `chat_read_status` | Read status for unread badge / 既読状態（未読バッジ用） | UC12 |
| AI | `ai_chat_sessions` | AI chat sessions for RFI drafting / RFI草案作成用AIチャットセッション | UC06 |
| AI | `ai_chat_messages` | AI chat messages with embeddings / embedding付きAIチャットメッセージ | UC06 |

---

## Notes / 備考

1. **Platform Organization**: A single `platform` type organization is created as seed data. Platform Admin users belong to this organization.
   / `platform` タイプの組織は初期データとして1つ作成。Platform Adminユーザーはこの組織に所属。

2. **Stripe Integration**: Billing information (invoice number, address, phone) is managed in Stripe Customer. Only `stripe_customer_id` is stored in DB.
   / 請求情報（インボイス番号、住所、電話番号）は Stripe Customer で管理。DBには `stripe_customer_id` のみ保持。

3. **Vendor Contracts & Payments**: Payment-related tables (`subscriptions`, `stripe_event_logs`, etc.) will be added separately.
   / 決済関連テーブル（`subscriptions`, `stripe_event_logs` 等）は別途追加予定。

4. **RLS Policies**: Each table requires RLS policies based on `org_id` and user role.
   / 各テーブルには `org_id` とユーザーロールに基づくRLSポリシーが必要。

5. **Soft Delete**: All tables use `is_deleted` flag for soft delete. Queries should filter `WHERE is_deleted = false`.
   / 全テーブルは `is_deleted` フラグで論理削除。クエリ時は `WHERE is_deleted = false` でフィルタすること。

6. **Audit Fields**: Some tables have semantic aliases (e.g., `sender_id` = `created_by` in `chat_messages`). See comments in table definitions.
   / 一部テーブルには意味的な別名あり（例: `chat_messages` の `sender_id` = `created_by`）。テーブル定義のコメント参照。

---

[← Previous: System Architecture / 前へ: システム構成図](./system.md) | [Next: Authentication Flow / 次へ: 認証フロー →](./auth.md)
