# 5. State Machines / 状態遷移

[← Back to Index / 目次に戻る](./index.md)

---

## 5.1 Project State Transitions / プロジェクト状態遷移

**Constraints / 制約:**
- `Draft → InDiscussion`: Vendor selection required / Vendor選択必須
- `InDiscussion → Closed`: Manual only (no auto-close) / 手動のみ（自動クローズなし）
- Once `Closed`, cannot reopen / 一度 `Closed` になると再オープン不可

```mermaid
stateDiagram-v2
    [*] --> Draft: POST /projects

    Draft --> Draft: PUT /projects/{id}<br/>Edit content / 内容編集
    Draft --> InDiscussion: POST /projects/{id}/start-discussion<br/>Select Vendor + Send / Vendor選択 + 送信

    InDiscussion --> InDiscussion: Chat discussion / チャット協議<br/>Receive RFI response / RFI回答受信
    InDiscussion --> Closed: POST /projects/{id}/close<br/>Complete / 完了処理

    Closed --> [*]

    note right of Draft
        Buyer creating RFI draft
        Buyer が RFI 草案を作成中
        Refine with AI chat
        AI チャットで内容をブラッシュアップ
    end note

    note right of InDiscussion
        RFI sent to Vendor
        Vendor に RFI を送信済み
        In discussion via chat
        チャットで協議中
    end note

    note right of Closed
        Project completed
        プロジェクト完了
        No changes allowed
        変更不可
    end note
```

---

## 5.2 RFI Response State Transitions / RFI回答の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Draft: Vendor starts response / Vendor が回答開始

    Draft --> Draft: PUT /rfi/{id}/responses/{rid}<br/>Update draft / 下書き更新
    Draft --> Submitted: POST /rfi/{id}/responses/{rid}/submit<br/>Submit response / 回答提出

    Submitted --> [*]

    note right of Draft
        Vendor creating response
        Vendor が回答を作成中
        Can edit multiple times
        何度でも編集可能
    end note

    note right of Submitted
        Response submitted to Buyer
        Buyer に回答を提出済み
        No further edits allowed
        以降は編集不可
    end note
```

---

## 5.3 Application State Transitions / 利用申請の状態遷移

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

### 5.3.1 Approval Process / 承認時の処理フロー

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

### 5.3.2 Rejection Process / 却下時の処理フロー

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

## 5.4 Invitation State Transitions / 招待の状態遷移

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

### 5.4.1 Invitation Accept Process / 招待承諾時の処理

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

[← Previous: AI Integration / 前へ: AI連携](./ai-integration.md) | [Next: Payments / 次へ: 決済 →](./payments.md)
