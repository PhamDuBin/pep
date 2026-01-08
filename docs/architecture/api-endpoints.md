# 8. API Endpoints / API エンドポイント一覧

[← Back to Index / 目次に戻る](./index.md)

---

| Method | Path | Description | UC |
|--------|------|-------------|-----|
| `GET` | `/api/projects` | List projects / プロジェクト一覧 | UC11 |
| `POST` | `/api/projects` | Create project / プロジェクト作成 | UC06 |
| `GET` | `/api/projects/{id}` | Project details / プロジェクト詳細 | UC07 |
| `PUT` | `/api/projects/{id}` | Update project / プロジェクト更新 | UC07 |
| `POST` | `/api/projects/{id}/start-discussion` | Start discussion / 送信開始 | UC07 |
| `POST` | `/api/projects/{id}/close` | Close project / 完了 | UC10 |
| `POST` | `/api/rfi/ai-suggest` | AI draft generation / AI草案生成 | UC06 |
| `GET` | `/api/rfi/{project_id}/responses` | List responses / 回答一覧 | UC10 |
| `POST` | `/api/rfi/{project_id}/responses` | Submit response / 回答提出 | UC08 |
| `POST` | `/api/chat/sessions` | Create session / セッション作成 | - |
| `POST` | `/api/chat/sessions/{id}/messages` | Send message / メッセージ送信 | UC06, UC09 |
| `POST` | `/api/slides/generate` | Generate slides / スライド生成 | - |
| `POST` | `/api/webhooks/stripe` | Stripe notification / Stripe通知 | UC13-15 |

---

[← Previous: Software Layers / 前へ: ソフトウェア層](./layers.md) | [Next: CI/CD Pipeline / 次へ: CI/CD パイプライン →](./cicd.md)
