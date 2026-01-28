# 8. API Endpoints / API エンドポイント一覧

[← Back to Index / 目次に戻る](./index.md)

---

## User Profile / ユーザープロフィール

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/users/profile` | Get my profile / プロフィール取得 | UC16 |
| `PUT` | `/api/users/profile` | Update profile / プロフィール更新 | UC16 |
| `PUT` | `/api/users/avatar` | Update avatar / アバター更新 | UC16 |
| `PUT` | `/api/users/password` | Change password / パスワード変更 | UC16 |
| `POST` | `/api/users/email/request-change` | Request email change / メール変更リクエスト | UC16 |
| `GET` | `/api/users/avatar-colors` | List avatar colors / アバター色一覧 | UC16 |
| `GET` | `/api/users/platform-admin` | Check platform admin flag / 管理者フラグ確認 | - |

## Organizations / 組織

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/organizations/me` | Get my organization / 自組織取得 | UC17 |
| `PUT` | `/api/organizations/me` | Update organization / 組織情報更新 | UC17 |
| `GET` | `/api/organizations/me/members` | List members / メンバー一覧 | UC02 |
| `DELETE` | `/api/organizations/me/members/{id}` | Remove member / メンバー削除 | UC02 |

## Invitations / 招待

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/invitations` | List invitations / 招待一覧 | UC02 |
| `POST` | `/api/invitations` | Create invitation / 招待作成 | UC02 |
| `DELETE` | `/api/invitations/{id}` | Cancel invitation / 招待取消 | UC02 |
| `POST` | `/api/invitations/{token}/accept` | Accept invitation / 招待承認 | UC02 |

## Applications / 申請

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `POST` | `/api/applications/buyer` | Apply as Buyer / Buyer申請 | UC01 |
| `POST` | `/api/applications/vendor` | Apply as Vendor / Vendor申請 | UC03 |
| `GET` | `/api/applications/me` | Get my application status / 申請状況取得 | UC01, UC03 |

## Platform Admin / プラットフォーム管理

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/admin/applications` | List applications / 申請一覧 | - |
| `GET` | `/api/admin/applications/{id}` | Application details / 申請詳細 | - |
| `PUT` | `/api/admin/applications/{id}/approve` | Approve application / 申請承認 | - |
| `PUT` | `/api/admin/applications/{id}/reject` | Reject application / 申請却下 | - |
| `GET` | `/api/admin/organizations` | List organizations / 組織一覧 | - |
| `PUT` | `/api/admin/organizations/{id}/suspend` | Suspend organization / 組織停止 | - |

## Projects / プロジェクト

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/projects` | List projects / プロジェクト一覧 | UC11 |
| `POST` | `/api/projects` | Create project / プロジェクト作成 | UC06 |
| `GET` | `/api/projects/{id}` | Project details / プロジェクト詳細 | UC07 |
| `PUT` | `/api/projects/{id}` | Update project / プロジェクト更新 | UC07 |
| `POST` | `/api/projects/{id}/start-discussion` | Start discussion / 送信開始 | UC07 |
| `POST` | `/api/projects/{id}/close` | Close project / 完了 | UC10 |

## Project Plans / プロジェクト計画書

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `POST` | `/api/project-plans/ai-suggest` | AI draft generation / AI草案生成 | UC06 |
| `GET` | `/api/project-plans/{project_id}/responses` | List responses / 回答一覧 | UC10 |
| `POST` | `/api/project-plans/{project_id}/responses` | Submit response / 回答提出 | UC08 |

## Chat / チャット

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `POST` | `/api/chat/sessions` | Create session / セッション作成 | - |
| `POST` | `/api/chat/sessions/{id}/messages` | Send message / メッセージ送信 | UC06, UC09 |

## AI / Slides

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `POST` | `/api/slides/generate` | Generate slides / スライド生成 | - |

## Payments / 決済

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/payments/info` | Get payment info / 決済情報取得 | UC13 |
| `GET` | `/api/payments/history` | Payment history / 決済履歴 | UC13 |
| `POST` | `/api/payments/setup-intent` | Create setup intent / 支払方法設定 | UC13 |
| `POST` | `/api/webhooks/stripe` | Stripe notification / Stripe通知 | UC13-15 |

---

[← Previous: Software Layers / 前へ: ソフトウェア層](./layers.md) | [Next: CI/CD Pipeline / 次へ: CI/CD パイプライン →](./cicd.md)
