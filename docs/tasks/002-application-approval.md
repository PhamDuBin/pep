# [Task] Application Approval / 利用申請承認

## 🔗 GitLab Issue
- Link: https://gitlab.i-stech.net:9080/bbs/pep/-/issues/27

---

## 📝 概要

Platform Admin が利用申請を承認/却下する機能。承認時は **既存の** organizations と profiles のステータスを `active` に更新する。

**重要**: auth.users, organizations, profiles は Self-Signup 時点で既に作成済み（`pending` 状態）。承認時は新規作成ではなく **ステータス更新のみ**。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Application State Transitions](../workflows/account.md#11-application-state-transitions--利用申請の状態遷移) | ワークフロー詳細 |
| [Record Creation Overview](../workflows/account.md#record-creation-overview--レコード作成タイミング概要) | 作成タイミング |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

### 事前状態（Self-Signup完了時点）

| Table | Status |
|-------|--------|
| auth.users | 作成済み |
| organizations | `pending` |
| profiles | `pending` |
| applications | `pending` |

### 承認後の状態

| Table | Status |
|-------|--------|
| organizations | `active` |
| profiles | `active` |
| applications | `approved` |

---

## 📋 スコープ

### Database (Supabase)

- [ ] `approve_application` RPC関数作成（ステータス更新 + データコピー）
- [ ] RLSポリシー設定（Platform Adminのみ操作可能）

### Backend (FastAPI)

- [ ] `GET /api/admin/applications` 申請一覧
- [ ] `PUT /api/admin/applications/{id}/approve` 承認
- [ ] `PUT /api/admin/applications/{id}/reject` 却下
- [ ] Pydantic schemas
- [ ] Service層・CRUD層

### Tests

- [ ] RPC関数のユニットテスト
- [ ] APIエンドポイントのテスト
- [ ] 権限チェックテスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/002-application-approval.md` に基づき Application Approval（利用申請承認）機能を実装してください。

## 重要な前提
- auth.users, organizations, profiles, applications は Self-Signup 時点で既に作成済み
- 承認処理は新規レコード作成ではなく、ステータス更新のみ
- applications から org_details へのデータコピーも承認時に実行

## 参照ドキュメント
- ワークフロー: docs/workflows/account.md の「1.1 Application State Transitions」セクション
- レコード作成タイミング: docs/workflows/account.md の「Record Creation Overview」セクション
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase RPC

`approve_application(p_application_id, p_admin_id)` RPC:
- applications UPDATE (status='approved', reviewed_by, reviewed_at)
- organizations UPDATE (status='active')
- profiles UPDATE (status='active')
- applications → org_details へデータコピー
  - buyer_applications → buyer_org_details
  - vendor_applications → vendor_org_details
- トランザクション内で実行

### 2. FastAPI Endpoints

- GET /api/admin/applications - 申請一覧（Platform Admin only）
  - Query params: status, org_type
  - Response: List of pending/approved/rejected applications

- PUT /api/admin/applications/{id}/approve - 承認
  - approve_application RPC を呼び出し
  - Response: Updated application

- PUT /api/admin/applications/{id}/reject - 却下
  - Request: { review_note: "却下理由" }
  - applications のみ UPDATE (status='rejected')
  - organizations, profiles は pending のまま

### 3. レイヤー構成
- api/routes/admin/applications.py
- services/application_service.py
- crud/application_crud.py

### 4. RLSポリシー
- applications: Platform Adminのみ一覧・更新可能

## 制約
- approve_applicationはRPC内で完結
- 承認済み申請の再承認はエラー
- 却下は organizations/profiles のステータスを変更しない
- 型ヒント必須

--------------------------------------------------

---

## ✅ 完了条件

- [ ] `approve_application` RPCが正常動作
- [ ] 承認後、organizations.status = 'active'
- [ ] 承認後、profiles.status = 'active'
- [ ] 承認後、applications → org_details にデータコピー済み
- [ ] 却下時に review_note が保存される
- [ ] 却下時は organizations/profiles が pending のまま
- [ ] 権限チェックが正しく機能
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md)
- 後続: [003-invitation.md](./003-invitation.md)

---

## 📝 メモ

- **auth.users は承認時に作成しない**（Self-Signup 時点で作成済み）
- 却下後の再申請は新しい applications レコードを作成（Self-Signup からやり直し）
- Platform Admin 判定は profiles.is_platform_admin フラグまたは別テーブルで管理
