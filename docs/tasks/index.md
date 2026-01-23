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

| # | Task | GitLab Issue | RPC | Status |
|---|------|--------------|-----|--------|
| 001 | [Self-Signup](./001-signup.md) | [#26](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/26) | ✅ create_signup | 🔲 Not Started |
| 002 | [Application Approval](./002-application-approval.md) | [#27](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/27) | ✅ approve_application | 🔲 Not Started |
| 003 | [Invitation](./003-invitation.md) | [#28](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/28) | ✅ accept_invitation | 🔲 Not Started |
| 004 | [Role Change & Owner Transfer](./004-role-change.md) | [#29](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/29) | ✅ transfer_ownership | 🔲 Not Started |
| 005 | [Account Suspension & Member Removal](./005-account-management.md) | [#30](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/30) | ❌ | 🔲 Not Started |

---

## Dependencies / 依存関係

```
001 Self-Signup (テーブル作成)
  ↓
002 Application Approval (ステータス更新)
  ↓
003 Invitation (招待機能)
  ↓
004 Role Change (ロール管理)
  ↓
005 Account Management (停止・削除)
```

---

## Record Creation Overview / レコード作成概要

| Flow | auth.users | organizations | profiles | applications |
|------|------------|---------------|----------|--------------|
| **001 Self-Signup** | INSERT | INSERT (pending) | INSERT (pending) | INSERT (pending) |
| **002 Approval** | - | UPDATE (active) | UPDATE (active) | UPDATE (approved) |
| **003 Invitation** | INSERT | - | INSERT (active) | - |

詳細: [Account Workflow - Record Creation Overview](../workflows/account.md#record-creation-overview--レコード作成タイミング概要)

---

## Files / ファイル一覧

| File | Description |
|------|-------------|
| [TEMPLATE.md](./TEMPLATE.md) | タスク作成用テンプレート |
| [001-signup.md](./001-signup.md) | Self-Signup 指示書 |
| [002-application-approval.md](./002-application-approval.md) | Application Approval 指示書 |
| [003-invitation.md](./003-invitation.md) | Invitation 指示書 |
| [004-role-change.md](./004-role-change.md) | Role Change 指示書 |
| [005-account-management.md](./005-account-management.md) | Account Management 指示書 |

---

## Related Documents / 関連ドキュメント

- [Workflows](../workflows/index.md) - ワークフロー詳細
- [Database Design](../architecture/database.md) - テーブル定義
- [CONTRIBUTING.md](../../CONTRIBUTING.md) - GitLab運用ルール
