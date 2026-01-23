# Workflows / ワークフロー

[← Back to Architecture / アーキテクチャに戻る](../architecture/index.md)

---

業務フローの詳細ドキュメントを機能ドメイン別に整理しています。

## Documents / ドキュメント一覧

| Document | Description | Contents |
|----------|-------------|----------|
| [Account & Organization](./account.md) | アカウント・組織管理 | 申請承認、招待、新規登録、ロール変更、停止、削除 |
| [Projects & RFI](./projects.md) | プロジェクト・RFI管理 | プロジェクト状態遷移、RFI回答状態遷移 |

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

### Projects & RFI Domain

| Flow | Section | RPC Required |
|------|---------|--------------|
| Project State | [2.1](./projects.md#21-project-state-transitions--プロジェクト状態遷移) | ❌ No |
| RFI Response | [2.2](./projects.md#22-rfi-response-state-transitions--rfi回答の状態遷移) | ❌ No |

---

## Related Documents / 関連ドキュメント

- [Database Design](../architecture/database.md) - テーブル定義
- [API Endpoints](../architecture/api-endpoints.md) - APIエンドポイント一覧
- [Authentication Flow](../architecture/auth.md) - 認証フロー
