# Task Definitions / タスク定義書

[← Back to Architecture / アーキテクチャに戻る](../architecture/index.md)

---

## 運用方針 / Operational Policy

**GitLab（管理）+ Markdown（指示書）のハイブリッド運用**

| 管理項目 | 場所 | 用途 |
|---------|------|------|
| Issue管理 | GitLab Issues | ステータス、担当者、ラベル、コメント |
| AIへの指示書 | `docs/tasks/*.md` | 実装詳細、AIプロンプト、完了条件 |

### ワークフロー

1. GitLabでIssue作成（タイトル、ラベル、担当者）
2. `docs/tasks/{番号}-{名前}.md` に指示書を作成
3. 指示書のGitLab Issue Linkを更新
4. AIに指示書を渡して実装
5. 完了条件をチェックしてIssueクローズ

---

## Task List / タスク一覧

### 01_User / ユーザー周り

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| ~~01-01~~ | ~~[Self-Signup](./01-01-signup.md)~~ | ~~[#26](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/26)~~ | ~~create_signup~~ | ⚠️ Deprecated (→01-02) |
| 01-02 | [Backend Onboarding](./01-02-backend-onboarding.md) | [#44](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/44) | ✅ complete_buyer_onboarding<br/>✅ complete_vendor_onboarding | 🔲 Not Started |
| 01-03 | [Application Approval](./01-03-application-approval.md) | [#27](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/27) | ✅ approve_application | 🔲 Not Started |
| 01-04 | [Invitation](./01-04-invitation.md) | [#28](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/28) | ✅ accept_invitation | 🔲 Not Started |
| 01-05 | [Role Change & Owner Transfer](./01-05-role-change.md) | [#29](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/29) | ✅ transfer_ownership | 🔲 Not Started |
| 01-06 | [Account Suspension & Member Removal](./01-06-account-management.md) | [#30](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/30) | ❌ | 🔲 Not Started |
| 01-08 | [Login/Logout](./01-08-login-logout.md) | [#45](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/45) | ❌ | 🔲 Not Started |
| 01-09 | [User Profile Update](./01-09-user-profile-update.md) | [#46](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/46) | ❌ | 🔲 Not Started |
| 01-10 | [Organization Settings](./01-10-organization-settings.md) | [#47](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/47) | ❌ | 🔲 Not Started |
| 01-11 | [Email Change](./01-11-email-change.md) | [#48](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/48) | ❌ | 🔲 Not Started |

### 02_Project / プロジェクト計画書まわり

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| 02-01 | [Project Management](./02-01-project-management.md) | [#31](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/31) | ❌ | 🔲 Not Started |
| 02-02 | [Project Plans](./02-02-project-plans.md) | [#32](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/32) | ❌ | 🔲 Not Started |
| 02-03 | [Project Attachments](./02-03-project-attachments.md) | [#33](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/33) | ❌ | 🔲 Not Started |

### 03_Chat / チャット周り

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| 03-01 | [AI Chat Sessions](./03-01-ai-chat.md) | [#34](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/34) | ❌ | 🔲 Not Started |
| 03-02 | [Buyer-Vendor Chat](./03-02-buyer-vendor-chat.md) | [#35](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/35) | ❌ | 🔲 Not Started |

### 04_Billing / 決済まわり

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| 04-01 | [Subscription Management](./04-01-subscription.md) | [#37](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/37) | ❌ | 🔲 Not Started |
| 04-02 | [Invoice Management](./04-02-invoice.md) | [#38](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/38) | ❌ | 🔲 Not Started |
| 04-03 | [Stripe Webhook](./04-03-stripe-webhook.md) | [#39](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/39) | ✅ handle_stripe_webhook | 🔲 Not Started |
| 04-04 | [Payment Methods](./04-04-payment-methods.md) | [#49](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/49) | ❌ | 🔲 Not Started |

### 05_Common / 共通機能

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| 05-01 | [Notifications](./05-01-notifications.md) | [#36](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/36) | ❌ | 🔲 Not Started |

---

## Dependencies / 依存関係

### 01_User / ユーザー周り

```
01-02 Backend Onboarding (Signup + オンボーディング)
  ↓
01-08 Login/Logout (ログイン・ログアウト) ←────────┐
  ↓                                              │
01-03 Application Approval (ステータス更新)        │
  ↓                                              │
01-09 User Profile Update (ユーザー情報更新) ───┬──┤
  ↓                                            │  │
01-11 Email Change (メールアドレス変更) ────────┘  │
  ↓                                              │
01-10 Organization Settings (組織情報更新) ───────┤
  ↓                                              │
01-04 Invitation (招待機能)
  ↓
01-05 Role Change (ロール管理)
  ↓
01-06 Account Management (停止・削除)
```

### 02_Project / プロジェクト計画書まわり

```
01-02 Backend Onboarding
  ↓
02-01 Project Management ─────────────────┐
  ↓                                        ↓
02-02 Project Plans                  02-03 Project Attachments
```

### 03_Chat / チャット周り

```
                    02-01 Project Management
                      ↓                ↓
            03-01 AI Chat Sessions   03-02 Buyer-Vendor Chat
                      ↓                ↓
                  02-02 Project Plans  05-01 Notifications
                  (計画書生成連携)       (新着通知)

※ 03-01 と 03-02 は独立した機能（両方とも 02-01 に依存）
```

### 04_Billing / 決済まわり

```
01-02 Backend Onboarding
  ↓
04-04 Payment Methods (決済方法管理) ───┐
  ↓                                    ↓
04-01 Subscription Management (Stripe Checkout)
  ↓
04-03 Stripe Webhook (契約確定・請求書同期)
  ↓
04-02 Invoice Management (請求書一覧表示)
```

### 05_Common / 共通機能

```
02-01 Project Management ──┐
                           ↓
03-02 Buyer-Vendor Chat ──→ 05-01 Notifications
                           ↑
04-01 Subscription ────────┘
(各機能から通知をトリガー)
```

---

## Record Creation Overview / レコード作成概要

| Flow | auth.users | organizations | profiles | applications |
|------|------------|---------------|----------|--------------|
| **01-02 Backend Onboarding (Step 1: Signup)** | INSERT | - | INSERT (pending) | - |
| **01-02 Backend Onboarding (Step 2: Onboard)** | - | INSERT (active) | UPDATE (active) | INSERT (pending) |
| **01-03 Approval** | - | UPDATE (active) | UPDATE (active) | UPDATE (approved) |
| **01-04 Invitation** | INSERT | - | INSERT (active) | - |

詳細: [Account Workflow - Record Creation Overview](../workflows/account.md#record-creation-overview--レコード作成タイミング概要)

---

## Files / ファイル一覧

### Templates / テンプレート
| File | Description |
|------|-------------|
| [TEMPLATE.md](./TEMPLATE.md) | タスク作成用テンプレート |

### 01_User / ユーザー周り
| File | Description |
|------|-------------|
| ~~[01-01-signup.md](./01-01-signup.md)~~ | ~~Self-Signup 指示書~~ (Deprecated → 01-02) |
| [01-02-backend-onboarding.md](./01-02-backend-onboarding.md) | Backend Onboarding 指示書 |
| [01-03-application-approval.md](./01-03-application-approval.md) | Application Approval 指示書 |
| [01-04-invitation.md](./01-04-invitation.md) | Invitation 指示書 |
| [01-05-role-change.md](./01-05-role-change.md) | Role Change 指示書 |
| [01-06-account-management.md](./01-06-account-management.md) | Account Management 指示書 |
| [01-08-login-logout.md](./01-08-login-logout.md) | Login/Logout 指示書 |
| [01-09-user-profile-update.md](./01-09-user-profile-update.md) | User Profile Update 指示書 |
| [01-10-organization-settings.md](./01-10-organization-settings.md) | Organization Settings 指示書 |
| [01-11-email-change.md](./01-11-email-change.md) | Email Change 指示書 |

### 02_Project / プロジェクト計画書まわり
| File | Description |
|------|-------------|
| [02-01-project-management.md](./02-01-project-management.md) | Project Management 指示書 |
| [02-02-project-plans.md](./02-02-project-plans.md) | Project Plans 指示書 |
| [02-03-project-attachments.md](./02-03-project-attachments.md) | Project Attachments 指示書 |

### 03_Chat / チャット周り
| File | Description |
|------|-------------|
| [03-01-ai-chat.md](./03-01-ai-chat.md) | AI Chat Sessions 指示書 |
| [03-02-buyer-vendor-chat.md](./03-02-buyer-vendor-chat.md) | Buyer-Vendor Chat 指示書 |

### 04_Billing / 決済まわり
| File | Description |
|------|-------------|
| [04-01-subscription.md](./04-01-subscription.md) | Subscription Management 指示書 |
| [04-02-invoice.md](./04-02-invoice.md) | Invoice Management 指示書 |
| [04-03-stripe-webhook.md](./04-03-stripe-webhook.md) | Stripe Webhook 指示書 |
| [04-04-payment-methods.md](./04-04-payment-methods.md) | Payment Methods 指示書 |

### 05_Common / 共通機能
| File | Description |
|------|-------------|
| [05-01-notifications.md](./05-01-notifications.md) | Notifications 指示書 |

---

## Related Documents / 関連ドキュメント

- [Workflows](../workflows/index.md) - ワークフロー詳細
- [Database Design](../architecture/database.md) - テーブル定義
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - GitLab運用ルール
