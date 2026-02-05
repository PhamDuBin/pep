# [Task] Admin Dashboard / 管理者：ダッシュボード

> **[Phase 2]** MVP後に実装予定

## 🔗 GitLab Issue
- Link: TBD

---

## 📝 概要

システム管理者向けのKPIダッシュボード。
組織数、ユーザー数、プロジェクト数、売上などの統計情報を表示。

**前提**: 06-01（管理者認証）が完了していること

---

## 📋 スコープ

### Backend (FastAPI)

- [ ] `GET /api/admin/stats/overview` - 概要統計
- [ ] `GET /api/admin/stats/organizations` - 組織統計
- [ ] `GET /api/admin/stats/revenue` - 売上統計
- [ ] `GET /api/admin/stats/usage` - 利用統計

---

## 🤖 AIへの指示プロンプト

--------------------------------------------------

`docs/tasks/06-05-admin-dashboard.md` に基づき Admin Dashboard（管理者：ダッシュボード）機能を実装してください。

## FastAPI Endpoints

#### GET /api/admin/stats/overview - 概要統計
- Response: { total_organizations, total_users, total_projects, monthly_revenue }

#### GET /api/admin/stats/organizations - 組織統計
- Query: period? (7d | 30d | 90d | 1y)
- Response: { buyers, vendors, pending_applications, new_signups[] }

#### GET /api/admin/stats/revenue - 売上統計
- Query: period?
- Response: { total, mrr, arr, by_plan[], trend[] }

#### GET /api/admin/stats/usage - 利用統計
- Query: period?
- Response: { active_projects, ai_sessions, messages_sent }

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 全APIエンドポイントが動作
- [ ] ユニットテスト作成

---

## 🔗 関連タスク

- 前提: [06-01-admin-application-approval.md](./06-01-admin-application-approval.md)
