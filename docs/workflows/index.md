# Workflows / ワークフロー

[← Back to Architecture / アーキテクチャに戻る](../architecture/index.md)

---

業務フローの詳細ドキュメントを機能ドメイン別に整理しています。

## Documents / ドキュメント一覧

| Document | Description | Contents |
|----------|-------------|----------|
| [Account & Organization](./account.md) | アカウント・組織管理 | レコード作成タイミング、申請承認、招待、新規登録、ロール変更、停止、削除 |
| [Projects](./projects.md) | プロジェクト管理 | プロジェクト状態遷移、プロジェクト計画書回答状態遷移 |
| [Billing & Payments](./billing.md) | 決済・請求 | サブスクリプション、従量課金、請求書払い、決済失敗復旧、アクセス制御 |

---

## Record Creation Overview / レコード作成概要

**重要**: 各フローでのテーブル操作タイミング

| Flow | auth.users | organizations | profiles | applications |
|------|------------|---------------|----------|--------------|
| **Self-Signup** | INSERT | INSERT (pending) | INSERT (pending) | INSERT (pending) |
| **Application Approval** | - | UPDATE (active) | UPDATE (active) | UPDATE (approved) |
| **Invitation Accept** | INSERT | - | INSERT (active) | - |

詳細: [Account Workflow - Record Creation Overview](./account.md#record-creation-overview--レコード作成タイミング概要)

---

## Quick Reference / クイックリファレンス

### Account & Organization Domain

| Flow | Section | RPC Required |
|------|---------|--------------|
| Application Approval | [1.1](./account.md#11-application-state-transitions--利用申請の状態遷移) | ✅ Yes |
| Invitation Accept | [1.2](./account.md#12-invitation-state-transitions--招待の状態遷移) | ✅ Yes |
| Self-Signup | [1.3](./account.md#13-self-signup-process--新規登録フロー) | ✅ Yes |
| Role Change | [1.4](./account.md#14-role-change--ロール変更) | Partial |
| Account Suspension | [1.5](./account.md#15-account-suspension--アカウント停止) | ❌ No |
| Member Removal | [1.6](./account.md#16-member-removal--メンバー削除) | ❌ No |

### Projects Domain

| Flow | Section | RPC Required |
|------|---------|--------------|
| Project State | [2.1](./projects.md#21-project-state-transitions--プロジェクト状態遷移) | ❌ No |
| Project Plan Response | [2.2](./projects.md#22-project-plan-response-state-transitions--プロジェクト計画書回答の状態遷移) | ❌ No |

### Billing & Payments Domain

| Flow | Section | Webhook |
|------|---------|---------|
| Subscription States | [6.1](./billing.md#61-subscription-states--サブスクリプション状態遷移) | ✅ Yes |
| Buyer Billing | [6.2](./billing.md#62-buyer-billing-model--buyer-決済モデル) | ✅ Yes |
| Vendor Invoice | [6.3](./billing.md#63-vendor-billing-model--vendor-決済モデル) | ✅ Yes |
| Payment Recovery | [6.4](./billing.md#64-payment-failure--recovery--決済失敗と復旧) | ✅ Yes |
| Access Control | [6.5](./billing.md#65-access-control-logic--アクセス制御ロジック) | - |

---

## Related Documents / 関連ドキュメント

- [Database Design](../architecture/database.md) - テーブル定義
- [API Endpoints](../architecture/api-endpoints.md) - APIエンドポイント一覧
- [Authentication Flow](../architecture/auth.md) - 認証フロー
