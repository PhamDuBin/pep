# 5. State Machines / 状態遷移

[← Back to Index / 目次に戻る](./index.md)

---

> **Note:** 詳細なワークフローは [docs/workflows/](../workflows/index.md) に移動しました。
>
> **Note:** Detailed workflows have been moved to [docs/workflows/](../workflows/index.md).

---

## Overview / 概要

本システムの主要な状態遷移を機能ドメイン別に整理しています。

| Domain | Document | Key States |
|--------|----------|------------|
| **Account & Organization** | [account.md](../workflows/account.md) | Application, Invitation, Signup, Role, Suspension |
| **Projects & RFI** | [projects.md](../workflows/projects.md) | Project Status, RFI Response |

---

## Quick State Reference / 状態クイックリファレンス

### Project Status

```
Draft → InDiscussion → Closed
```

### Application Status

```
Pending → Approved / Rejected
```

### Invitation Status

```
Pending → Accepted / Expired
```

### Organization Status

```
pending → active → suspended / inactive
```

### Profile Role

```
owner ↔ admin ↔ member → Removed
```

---

## Detailed Documentation / 詳細ドキュメント

### Account & Organization Domain

| Flow | Link | RPC Required |
|------|------|--------------|
| Application Approval | [1.1](../workflows/account.md#11-application-state-transitions--利用申請の状態遷移) | ✅ Yes |
| Invitation Accept | [1.2](../workflows/account.md#12-invitation-state-transitions--招待の状態遷移) | ✅ Yes |
| Self-Signup | [1.3](../workflows/account.md#13-self-signup-process--新規登録フロー) | ✅ Yes |
| Role Change | [1.4](../workflows/account.md#14-role-change--ロール変更) | Partial (Owner Transfer) |
| Account Suspension | [1.5](../workflows/account.md#15-account-suspension--アカウント停止) | ❌ No |
| Member Removal | [1.6](../workflows/account.md#16-member-removal--メンバー削除) | ❌ No |

### Projects & RFI Domain

| Flow | Link | RPC Required |
|------|------|--------------|
| Project State Transitions | [2.1](../workflows/projects.md#21-project-state-transitions--プロジェクト状態遷移) | ❌ No |
| RFI Response State | [2.2](../workflows/projects.md#22-rfi-response-state-transitions--rfi回答の状態遷移) | ❌ No |

---

[← Previous: AI Integration / 前へ: AI連携](./ai-integration.md) | [Next: Payments / 次へ: 決済 →](./payments.md)
