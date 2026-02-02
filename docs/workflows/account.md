# 1. Account & Organization Workflows / アカウント・組織ワークフロー

[← Back to Workflows Index / ワークフロー目次に戻る](./index.md)

---

## Record Creation Overview / レコード作成タイミング概要

各フローで作成されるレコードと作成タイミングを整理。

### Flow Summary / フロー別まとめ

| Flow | auth.users | organizations | profiles | applications |
|------|------------|---------------|----------|--------------|
| **Self-Signup & Onboarding** | ① ユーザー登録時 | ③ Onboarding RPC内（active） | ① Trigger（pending）→ ③ UPDATE（active） | ③ Onboarding RPC内（pending） |
| **Application Approval** | 作成済み | UPDATE→active | UPDATE→active | UPDATE→approved |
| **Invitation Accept** | ① 招待承諾時 | 作成しない（既存） | ② RPC内（active） | 作成しない |

### Creation Timeline Diagram / 作成タイミング図

```mermaid
flowchart LR
    subgraph "Self-Signup & Onboarding Flow"
        SS1[auth.users] -->|handle_new_user trigger| SS2[profiles<br/>status=pending, org_id=NULL]
        SS2 -->|Onboarding RPC| SS3[organizations<br/>status=active]
        SS2 -->|Onboarding RPC| SS4[profiles<br/>UPDATE: status=active, org_id=set]
        SS2 -->|Onboarding RPC| SS5[applications<br/>status=pending]
    end

    subgraph "Application Approval Flow"
        AA1[applications<br/>status=pending] -->|approve_application RPC| AA2[organizations<br/>status=active]
        AA1 -->|approve_application RPC| AA3[profiles<br/>status=active]
        AA1 -->|approve_application RPC| AA4[applications<br/>status=approved]
    end

    subgraph "Invitation Accept Flow"
        IA1[auth.users] -->|accept_invitation RPC| IA2[profiles<br/>role=invited role]
        IA3[invitations] -->|accept_invitation RPC| IA4[invitations<br/>status=accepted]
    end
```

### Key Points / 重要ポイント

1. **Self-Signup & Onboarding は3ステップ**
   - ① signUp（auth.users作成 → triggerでprofile(pending)作成）
   - ② メール確認
   - ③ Onboarding API（org作成(active) + profile更新(active) + application作成(pending) + Stripe Customer作成）

2. **Onboarding完了後、org/profileは即座に `active`**
   - application のみ `pending`（Platform Admin承認待ち）

3. **Application Approvalでapplicationが `approved` に更新**
   - org/profile は既に active

4. **auth.users の作成場所**
   - Self-Signup: Frontend → Supabase Auth 直接
   - Invitation: 招待承諾時に Frontend → Supabase Auth

---

## 1.1 Application State Transitions / 利用申請の状態遷移

**Tables / 対象テーブル:**
- `buyer_applications` (Buyer申請)
- `vendor_applications` (Vendor申請)

```mermaid
stateDiagram-v2
    [*] --> Pending: POST /applications<br/>Submit application / 申請提出

    Pending --> Approved: PUT /admin/applications/{id}/approve<br/>Platform Admin approves / 管理者承認
    Pending --> Rejected: PUT /admin/applications/{id}/reject<br/>Platform Admin rejects / 管理者却下

    Approved --> [*]
    Rejected --> [*]

    note right of Pending
        Application submitted
        申請が提出された状態
        Awaiting review
        審査待ち
    end note

    note right of Approved
        User & Org activated
        ユーザー・組織が有効化
        Can start using service
        サービス利用開始可能
    end note

    note right of Rejected
        Application denied
        申請が却下された
        review_note に理由記載
    end note
```

### 1.1.1 Approval Process / 承認時の処理フロー

**POST /admin/applications/{id}/approve**

承認時は以下の処理を **1トランザクション (RPC)** で実行:

```mermaid
sequenceDiagram
    participant Admin as Platform Admin
    participant API as FastAPI
    participant RPC as Supabase RPC
    participant DB as Database

    Admin->>API: PUT /admin/applications/{id}/approve
    API->>RPC: call approve_application(application_id)

    rect rgb(240, 248, 255)
        Note over RPC,DB: Transaction Start / トランザクション開始
        RPC->>DB: 1. Update application.status = 'approved'
        RPC->>DB: 2. Update organization.status = 'active'
        RPC->>DB: 3. Copy to org_details table
        Note over DB: buyer_applications → buyer_org_details<br/>vendor_applications → vendor_org_details
        RPC->>DB: 4. Update profile.status = 'active'
        Note over RPC,DB: Transaction Commit / トランザクション完了
    end

    RPC-->>API: Success
    API-->>Admin: 200 OK
```

**Data Copy Details / データコピー詳細:**

| Source (申請) | Destination (組織詳細) |
|--------------|----------------------|
| `buyer_applications.industry` | `buyer_org_details.industry` |
| `buyer_applications.employee_count` | `buyer_org_details.employee_count` |
| `buyer_applications.purpose` | `buyer_org_details.purpose` |
| `vendor_applications.industry` | `vendor_org_details.industry` |
| `vendor_applications.employee_count` | `vendor_org_details.employee_count` |
| `vendor_applications.business_description` | `vendor_org_details.business_description` |
| `vendor_applications.service_description` | `vendor_org_details.service_description` |
| `vendor_applications.website_url` | `vendor_org_details.website_url` |

### 1.1.2 Rejection Process / 却下時の処理フロー

**POST /admin/applications/{id}/reject**

```mermaid
sequenceDiagram
    participant Admin as Platform Admin
    participant API as FastAPI
    participant DB as Database
    participant Email as Email Service

    Admin->>API: PUT /admin/applications/{id}/reject<br/>{ review_note: "理由..." }
    API->>DB: Update application.status = 'rejected'
    API->>DB: Set review_note, reviewed_by, reviewed_at
    API->>Email: Send rejection notification (optional)
    API-->>Admin: 200 OK
```

**Rejection does NOT change / 却下時に変更しないもの:**
- `organizations.status` (remains 'pending')
- `profiles.status` (remains 'pending')

**Note:** Rejected users can re-apply with a new application.
却下されたユーザーは新しい申請で再申請可能。

---

## 1.2 Invitation State Transitions / 招待の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Pending: POST /invitations<br/>Send invitation / 招待送信

    Pending --> Accepted: POST /invitations/{token}/accept<br/>User accepts / ユーザー承諾
    Pending --> Expired: expires_at passed / 期限切れ

    Accepted --> [*]
    Expired --> [*]

    note right of Pending
        Invitation email sent
        招待メール送信済み
        Token valid until expires_at
        expires_at まで有効
    end note

    note right of Accepted
        User joined organization
        ユーザーが組織に参加
        Profile created with invited role
        招待時のロールでプロフィール作成
    end note
```

### 1.2.1 Invitation Accept Process / 招待承諾時の処理

**POST /invitations/{token}/accept**

```mermaid
sequenceDiagram
    participant User as Invited User
    participant API as FastAPI
    participant Auth as Supabase Auth
    participant RPC as Supabase RPC
    participant DB as Database

    User->>API: POST /invitations/{token}/accept<br/>{ password: "..." }
    API->>DB: Validate token & check expiry
    API->>Auth: Create auth.users (signUp)
    Auth-->>API: user_id

    rect rgb(240, 248, 255)
        Note over API,DB: Transaction / トランザクション
        API->>RPC: call accept_invitation(token, user_id)
        RPC->>DB: 1. Create profile (org_id, role from invitation)
        RPC->>DB: 2. Update invitation.status = 'accepted'
    end

    RPC-->>API: Success
    API-->>User: 200 OK + JWT token
```

---

## 1.3 Self-Signup & Onboarding Process / 新規登録・オンボーディングフロー

新規Buyer/Vendorが自己登録し、オンボーディングを完了するまでの処理フロー。
3ステップ: signUp → メール確認 → Onboarding API。

### 1.3.1 Design Principles / 設計方針

1. **No Metadata in Signup**: signUp時に `options.data` は送らない（Frontendをシンプルに保つ）
2. **Maintain Trigger**: `handle_new_user` トリガーで `profiles` (status='pending') を即座に作成
3. **URL Parameters**: Buyer/Vendorの区別は `emailRedirectTo` のURLパラメータで引き継ぐ
4. **Stripe Customer**: Onboarding時にStripe Customerを作成し、`billing_customer_id` を保存

### 1.3.2 Onboarding Sequence / オンボーディングシーケンス

```mermaid
sequenceDiagram
    participant User as New User
    participant FE as Frontend
    participant Auth as Supabase Auth
    participant Trigger as handle_new_user<br/>trigger
    participant API as FastAPI<br/>/api/v1/auth/onboarding/*
    participant Stripe as Stripe API
    participant DB as Database

    Note over User,FE: Step 1: Signup (No metadata)
    User->>FE: Fill signup form (email, password)
    FE->>Auth: signUp(email, password)<br/>emailRedirectTo=/onboarding?type=vendor
    Auth->>DB: INSERT auth.users
    DB->>Trigger: Trigger fires
    Trigger->>DB: INSERT profiles<br/>(status='pending', org_id=NULL, role='owner')
    Auth-->>FE: Email sent (with ?type=vendor in link)

    Note over User,FE: Step 2: Email confirmation
    User->>FE: Click email confirmation link
    FE->>Auth: Verify email
    Auth-->>FE: Redirect to /onboarding?type=vendor

    Note over FE,DB: Step 3: Onboarding API (JWT required)
    FE->>API: POST /api/v1/auth/onboarding/vendor<br/>{company_name, business_description, ...}
    API->>API: Verify JWT + profile exists
    API->>Stripe: Create Customer
    Stripe-->>API: customer_id (cus_xxx)

    API->>DB: CALL complete_vendor_onboarding RPC
    rect rgb(240, 248, 255)
        Note over DB: BEGIN TRANSACTION
        DB->>DB: INSERT organizations (status='active', billing_customer_id)
        DB->>DB: UPDATE profiles (org_id=set, status='active')
        DB->>DB: UPDATE auth.users.raw_user_meta_data (org_type)
        DB->>DB: INSERT vendor_applications (status='pending')
        Note over DB: COMMIT
    end

    DB-->>API: {org_id, profile_id, application_id, status}
    API-->>FE: 200 OK
    FE->>FE: Redirect to /vendor/dashboard
```

### 1.3.3 Endpoints / エンドポイント

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/onboarding/buyer` | JWT required | Buyer onboarding |
| POST | `/api/v1/auth/onboarding/vendor` | JWT required | Vendor onboarding |

### 1.3.4 Created/Updated Records / 作成・更新されるレコード

| Timing | Table | Action | Status | Notes |
|--------|-------|--------|--------|-------|
| Step 1 | `auth.users` | INSERT | - | Supabase Authが作成 |
| Step 1 | `profiles` | INSERT (trigger) | `pending` | org_id=NULL, role='owner' |
| Step 3 | `organizations` | INSERT (RPC) | `active` | billing_customer_id付き |
| Step 3 | `profiles` | UPDATE (RPC) | `active` | org_id設定、display_name更新 |
| Step 3 | `auth.users` | UPDATE (RPC) | - | raw_user_meta_dataにorg_type追加 |
| Step 3 | `buyer/vendor_applications` | INSERT (RPC) | `pending` | Platform Admin承認待ち |

### 1.3.5 Request Body / リクエストボディ

**Buyer Onboarding (POST /api/v1/auth/onboarding/buyer):**
```json
{
  "company_name": "株式会社サンプル",
  "contact_email": "contact@example.com",
  "display_name": "山田太郎",
  "industry": "製造業",
  "employee_count": "100-500",
  "purpose": "サービス選定のため"
}
```

**Vendor Onboarding (POST /api/v1/auth/onboarding/vendor):**
```json
{
  "company_name": "株式会社ベンダー",
  "contact_email": "contact@vendor.com",
  "display_name": "鈴木花子",
  "industry": "IT・ソフトウェア",
  "employee_count": "50-100",
  "business_description": "クラウドサービスの開発・提供",
  "service_description": "SaaS型業務管理システム",
  "website_url": "https://vendor.example.com"
}
```

### 1.3.6 Post-Onboarding Flow / オンボーディング後のフロー

```mermaid
stateDiagram-v2
    [*] --> SignupPending: Step 1: signUp<br/>auth.users + profile(pending)

    SignupPending --> EmailConfirmed: Step 2: Email confirmed<br/>メール確認済み

    EmailConfirmed --> OnboardingComplete: Step 3: Onboarding API<br/>org(active) + profile(active) + application(pending)

    OnboardingComplete --> ApplicationApproved: Admin approves application<br/>管理者がapplication承認

    OnboardingComplete --> ApplicationRejected: Admin rejects application<br/>管理者がapplication却下

    ApplicationRejected --> OnboardingComplete: Re-apply / 再申請

    ApplicationApproved --> [*]

    note right of SignupPending
        profiles.status = 'pending'
        profiles.org_id = NULL
        メール認証待ち
    end note

    note right of OnboardingComplete
        org.status = 'active'
        profile.status = 'active'
        application.status = 'pending'
        サービス基本利用可能
        application承認待ち
    end note

    note right of ApplicationApproved
        application.status = 'approved'
        全機能利用可能
    end note
```

### 1.3.7 Error Handling / エラーハンドリング

| Error | HTTP Status | Handling | Notes |
|-------|-------------|----------|-------|
| Email already exists | - | Supabase Auth が拒否 | Frontend側で処理 |
| Profile not found | 400 | Trigger未発火の場合 | サポートへ連絡 |
| Already has organization | 400 | 二重オンボーディング防止 | RPC内でもチェック |
| Stripe Customer creation fails | 500 | RPC呼び出し前に失敗 | トランザクション外 |
| RPC fails after Stripe | 500 | Stripe Customerは残る | 手動クリーンアップ必要 |
| Duplicate company name | - | 許可（unique制約なし） | 同じ会社名で複数申請可能 |

### 1.3.8 Authentication for Onboarding / オンボーディングの認証

Onboarding APIは `get_current_user_for_onboarding` で認証（通常の `get_current_user` ではない）。

| Check | `get_current_user` | `get_current_user_for_onboarding` |
|-------|-------------------|----------------------------------|
| JWT valid | ✅ | ✅ |
| Profile exists | ✅ | ✅ |
| is_deleted = false | ✅ | ✅ |
| org_id is not NULL | ✅ | ❌ (skip) |
| org.status = 'active' | ✅ | ❌ (skip) |

理由: オンボーディングユーザーは `org_id=NULL` のため、通常の認証では403になる。

---

## 1.4 Role Change / ロール変更

組織内でのメンバーロール変更処理。

**Roles / ロール:**
- `owner`: 組織オーナー（1組織に1人のみ）
- `admin`: 管理者（複数可）
- `member`: 一般メンバー（複数可）

### 1.4.1 Role Hierarchy / ロール階層

```
owner (最高権限)
  ↓ can manage
admin (管理権限)
  ↓ can manage
member (一般権限)
```

### 1.4.2 Permission Matrix / 権限マトリクス

| Action | owner | admin | member |
|--------|-------|-------|--------|
| Change member → admin | ✅ | ✅ | ❌ |
| Change admin → member | ✅ | ❌ | ❌ |
| Change admin → owner | ✅ | ❌ | ❌ |
| Remove member | ✅ | ✅ | ❌ |
| Remove admin | ✅ | ❌ | ❌ |
| Transfer ownership | ✅ | ❌ | ❌ |

### 1.4.3 Standard Role Change / 通常のロール変更

**PUT /organizations/{org_id}/members/{user_id}/role**

```mermaid
sequenceDiagram
    participant Admin as Owner/Admin
    participant API as FastAPI
    participant DB as Database

    Admin->>API: PUT /organizations/{org_id}/members/{user_id}/role<br/>{ role: "admin" }
    API->>API: Check permission<br/>権限チェック
    API->>DB: UPDATE profiles SET role = 'admin'<br/>WHERE id = user_id AND org_id = org_id
    DB-->>API: Success
    API-->>Admin: 200 OK
```

**Constraints / 制約:**
- Cannot change own role / 自分のロールは変更不可
- Cannot change to `owner` (use transfer instead) / `owner` への変更は不可（移譲を使用）

### 1.4.4 Owner Transfer / オーナー移譲

**POST /organizations/{org_id}/transfer-ownership**

オーナー権限を別メンバーに移譲。**RPC** でトランザクション管理。

```mermaid
sequenceDiagram
    participant Owner as Current Owner
    participant API as FastAPI
    participant RPC as Supabase RPC
    participant DB as Database

    Owner->>API: POST /organizations/{org_id}/transfer-ownership<br/>{ new_owner_id: "uuid" }
    API->>API: Verify current user is owner<br/>現オーナー確認

    API->>RPC: call transfer_ownership(org_id, current_owner_id, new_owner_id)

    rect rgb(240, 248, 255)
        Note over RPC,DB: Transaction Start / トランザクション開始
        RPC->>DB: 1. UPDATE profiles SET role = 'admin'<br/>WHERE id = current_owner_id
        Note over DB: Current owner becomes admin<br/>現オーナーをadminに降格
        RPC->>DB: 2. UPDATE profiles SET role = 'owner'<br/>WHERE id = new_owner_id
        Note over DB: New owner promoted<br/>新オーナーに昇格
        Note over RPC,DB: Transaction Commit / トランザクション完了
    end

    RPC-->>API: Success
    API-->>Owner: 200 OK
```

**Constraints / 制約:**
- Only current owner can transfer / 現オーナーのみ実行可能
- New owner must be existing member of the organization / 新オーナーは組織の既存メンバーである必要あり
- New owner must have `active` status / 新オーナーは `active` ステータスである必要あり
- Transaction ensures exactly one owner / トランザクションで必ず1人のオーナーを保証

### 1.4.5 Role Change State Diagram / ロール変更状態図

```mermaid
stateDiagram-v2
    [*] --> member: Invited user joins / 招待ユーザー参加
    [*] --> owner: Self-signup / 新規登録

    member --> admin: Promoted by owner/admin<br/>owner/adminが昇格
    admin --> member: Demoted by owner<br/>ownerが降格

    admin --> owner: Owner transfer<br/>オーナー移譲
    owner --> admin: Owner transfer (self)<br/>オーナー移譲（自身）

    member --> Removed: Removed from org<br/>組織から削除
    admin --> Removed: Removed from org<br/>組織から削除

    Removed --> [*]

    note right of owner
        Exactly ONE per organization
        組織に必ず1人
        Cannot be removed
        削除不可
    end note

    note right of admin
        Multiple allowed
        複数可
        Can manage members
        メンバー管理可能
    end note

    note right of member
        Multiple allowed
        複数可
        Basic access only
        基本アクセスのみ
    end note
```

### 1.4.6 Error Cases / エラーケース

| Error | HTTP Status | Condition |
|-------|-------------|-----------|
| Forbidden | 403 | Insufficient permission to change role / ロール変更権限なし |
| Bad Request | 400 | Cannot change own role / 自分のロールは変更不可 |
| Bad Request | 400 | Cannot directly assign owner role / owner ロールは直接割当不可 |
| Not Found | 404 | Target user not in organization / 対象ユーザーが組織に存在しない |
| Conflict | 409 | Target user is the only owner / 対象が唯一のオーナー |

---

## 1.5 Account Suspension / アカウント停止

Platform Admin による組織・ユーザーの停止処理。

### 1.5.1 Organization Status / 組織ステータス

| Status | Description | User Can Login |
|--------|-------------|----------------|
| `active` | 正常稼働中 | ✅ Yes |
| `pending` | 承認待ち | ❌ No |
| `inactive` | 非アクティブ（自主停止） | ❌ No |
| `suspended` | 停止（管理者による） | ❌ No |

### 1.5.2 Suspend Organization / 組織停止

**PUT /admin/organizations/{org_id}/suspend**

Platform Admin が組織を停止。配下の全ユーザーがログイン不可になる。

```mermaid
sequenceDiagram
    participant Admin as Platform Admin
    participant API as FastAPI
    participant DB as Database

    Admin->>API: PUT /admin/organizations/{org_id}/suspend<br/>{ reason: "利用規約違反" }
    API->>API: Verify Platform Admin role<br/>Platform Admin権限確認
    API->>DB: UPDATE organizations<br/>SET status = 'suspended'<br/>WHERE id = org_id
    DB-->>API: Success
    API-->>Admin: 200 OK
```

**Effects / 影響:**
- `organizations.status = 'suspended'`
- 配下の全ユーザーがログイン時に 403 Forbidden
- 進行中のプロジェクトは閲覧のみ可能（操作不可）
- `profiles.status` は変更しない（組織レベルで制御）

### 1.5.3 Reactivate Organization / 組織再開

**PUT /admin/organizations/{org_id}/reactivate**

停止した組織を再開。

```mermaid
sequenceDiagram
    participant Admin as Platform Admin
    participant API as FastAPI
    participant DB as Database

    Admin->>API: PUT /admin/organizations/{org_id}/reactivate
    API->>API: Verify Platform Admin role<br/>Platform Admin権限確認
    API->>DB: UPDATE organizations<br/>SET status = 'active'<br/>WHERE id = org_id
    DB-->>API: Success
    API-->>Admin: 200 OK
```

### 1.5.4 Organization Status State Diagram / 組織ステータス状態図

```mermaid
stateDiagram-v2
    [*] --> active: Self-signup + Onboarding<br/>新規登録 + オンボーディング完了

    active --> suspended: Platform Admin suspends<br/>管理者が停止
    active --> inactive: Owner deactivates<br/>オーナーが非アクティブ化

    suspended --> active: Platform Admin reactivates<br/>管理者が再開

    inactive --> active: Owner reactivates<br/>オーナーが再開

    note left of active
        Onboarding完了時にactiveで作成
        Created as active on onboarding
    end note

    note right of active
        Normal operation
        通常稼働
        All features available
        全機能利用可能
    end note

    note right of suspended
        Admin action
        管理者による停止
        TOS violation, etc.
        規約違反など
        Login blocked
        ログイン不可
    end note

    note right of inactive
        Self-deactivation
        自主的な非アクティブ化
        Can reactivate anytime
        いつでも再開可能
    end note
```

### 1.5.5 Login Check Flow / ログイン時チェックフロー

ユーザーログイン時に組織ステータスをチェック。

```mermaid
sequenceDiagram
    participant User
    participant FE as Frontend
    participant Auth as Supabase Auth
    participant API as FastAPI
    participant DB as Database

    User->>FE: Login attempt
    FE->>Auth: signInWithPassword()
    Auth-->>FE: JWT Token

    FE->>API: GET /auth/me (with JWT)
    API->>DB: Get profile + organization
    DB-->>API: { profile, organization }

    alt organization.status = 'active'
        API-->>FE: 200 OK + user data
        FE-->>User: Login success
    else organization.status != 'active'
        API-->>FE: 403 Forbidden<br/>{ error: "organization_suspended" }
        FE-->>User: Account suspended message
    end
```

### 1.5.6 Suspension Reasons / 停止理由

| Reason Code | Description |
|-------------|-------------|
| `tos_violation` | Terms of Service violation / 利用規約違反 |
| `payment_issue` | Payment failure / 支払い問題 |
| `security_concern` | Security incident / セキュリティ懸念 |
| `admin_request` | Administrative action / 管理上の措置 |
| `other` | Other reasons / その他 |

### 1.5.7 API Summary / API一覧

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| PUT | `/admin/organizations/{id}/suspend` | Platform Admin | Suspend organization |
| PUT | `/admin/organizations/{id}/reactivate` | Platform Admin | Reactivate organization |
| PUT | `/organizations/{id}/deactivate` | Owner | Self-deactivate (inactive) |
| PUT | `/organizations/{id}/activate` | Owner | Self-reactivate |

---

## 1.6 Member Removal / メンバー削除

組織からメンバーを削除する処理。

### 1.6.1 Removal Rules / 削除ルール

| Target Role | Can be removed by | Notes |
|-------------|-------------------|-------|
| `member` | owner, admin | 一般メンバーは owner/admin が削除可能 |
| `admin` | owner only | 管理者は owner のみ削除可能 |
| `owner` | ❌ Cannot remove | オーナーは削除不可（先に移譲が必要） |

### 1.6.2 Remove Member / メンバー削除

**DELETE /organizations/{org_id}/members/{user_id}**

```mermaid
sequenceDiagram
    participant Admin as Owner/Admin
    participant API as FastAPI
    participant DB as Database

    Admin->>API: DELETE /organizations/{org_id}/members/{user_id}
    API->>API: Check permission<br/>権限チェック
    API->>DB: Get target profile
    DB-->>API: { role: 'member' }

    alt Can remove
        API->>DB: UPDATE profiles<br/>SET is_deleted = true<br/>WHERE id = user_id
        DB-->>API: Success
        API-->>Admin: 200 OK
    else Cannot remove (owner or insufficient permission)
        API-->>Admin: 403 Forbidden
    end
```

### 1.6.3 Soft Delete vs Hard Delete / 論理削除 vs 物理削除

**方針: Soft Delete（論理削除）**

| Table | Action | Reason |
|-------|--------|--------|
| `profiles` | `is_deleted = true` | 監査ログ、データ整合性のため |
| `auth.users` | Keep (no deletion) | 再登録時のメール重複防止 |
| `chat_messages` | Keep (no deletion) | メッセージ履歴の保持 |
| `chat_room_members` | `is_deleted = true` | チャットルームから退出扱い |

**Note:** 完全削除が必要な場合は、別途「アカウント完全削除」機能として実装。

### 1.6.4 Post-Removal Effects / 削除後の影響

```mermaid
sequenceDiagram
    participant Removed as Removed User
    participant FE as Frontend
    participant Auth as Supabase Auth
    participant API as FastAPI

    Removed->>FE: Login attempt
    FE->>Auth: signInWithPassword()
    Auth-->>FE: JWT Token (still valid)

    FE->>API: GET /auth/me
    API->>API: Check profile.is_deleted

    alt is_deleted = true
        API-->>FE: 403 Forbidden<br/>{ error: "account_removed" }
        FE-->>Removed: Account removed message
    end
```

**Effects / 影響:**
- 削除されたユーザーはログイン不可
- 過去のチャットメッセージは表示される（送信者名は残る）
- プロジェクト作成者などの `created_by` は保持

### 1.6.5 Self-Removal / 自主退会

**DELETE /organizations/{org_id}/members/me**

メンバー自身が組織から退会。

```mermaid
sequenceDiagram
    participant User as Member
    participant API as FastAPI
    participant DB as Database

    User->>API: DELETE /organizations/{org_id}/members/me
    API->>DB: Get user profile
    DB-->>API: { role: 'member' }

    alt role = 'owner'
        API-->>User: 400 Bad Request<br/>{ error: "owner_cannot_leave" }
        Note over User: Must transfer ownership first<br/>先にオーナー移譲が必要
    else role != 'owner'
        API->>DB: UPDATE profiles<br/>SET is_deleted = true
        DB-->>API: Success
        API-->>User: 200 OK
    end
```

### 1.6.6 Error Cases / エラーケース

| Error | HTTP Status | Condition |
|-------|-------------|-----------|
| Forbidden | 403 | Insufficient permission / 削除権限なし |
| Forbidden | 403 | Admin trying to remove another admin / adminが他のadminを削除 |
| Forbidden | 403 | Trying to remove owner / ownerを削除しようとした |
| Bad Request | 400 | Owner trying to leave / ownerが自主退会しようとした |
| Not Found | 404 | User not in organization / 対象が組織に存在しない |

### 1.6.7 API Summary / API一覧

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| DELETE | `/organizations/{org_id}/members/{user_id}` | owner, admin | Remove member |
| DELETE | `/organizations/{org_id}/members/me` | member, admin | Self-removal (leave org) |

---

[← Back to Workflows Index / ワークフロー目次に戻る](./index.md)
