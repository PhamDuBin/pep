# [Task] Role Change & Owner Transfer / ロール変更・オーナー移譲

## 🔗 GitLab Issue
- Link: https://gitlab.i-stech.net:9080/bbs/pep/-/issues/29

---

## 📝 概要

組織内のメンバーロール変更とOwner権限の移譲機能。Owner移譲はトランザクションで原子的に実行。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Role Change](../workflows/account.md#14-role-change--ロール変更) | ワークフロー詳細 |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

### ロール階層

```
owner (最高権限) - 組織に必ず1人
  ↓
admin (管理権限) - 複数可
  ↓
member (一般権限) - 複数可
```

### 権限マトリクス

| 操作 | owner | admin | member |
|------|-------|-------|--------|
| member → admin | ✅ | ✅ | ❌ |
| admin → member | ✅ | ❌ | ❌ |
| Owner移譲 | ✅ | ❌ | ❌ |

---

## 📋 スコープ

### Database (Supabase)

- [ ] `transfer_ownership` RPC関数作成

### Backend (FastAPI)

- [ ] `PUT /api/organizations/{org_id}/members/{profile_id}/role`
- [ ] `POST /api/organizations/{org_id}/transfer-ownership`
- [ ] Pydantic schemas
- [ ] Service層・CRUD層

### Tests

- [ ] RPC関数のユニットテスト
- [ ] 権限マトリックスのテスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/004-role-change.md` に基づき Role Change & Owner Transfer 機能を実装してください。

## 参照ドキュメント
- ワークフロー: docs/workflows/account.md の「1.4 Role Change」セクション
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## ロール階層と権限

| Role | Can Change To | Can Be Changed By |
|------|---------------|-------------------|
| owner | - (移譲のみ) | - |
| admin | member | owner |
| member | admin | owner, admin |

## 実装内容

### 1. Supabase RPC

`transfer_ownership(p_org_id, p_current_owner_id, p_new_owner_id)` RPC:
- 現在のOwnerがownerであることを検証
- 新しいOwnerが同じ組織のメンバーであることを検証
- 新しいOwnerが `active` ステータスであることを検証
- 現在のOwner: role = 'admin' に変更
- 新しいOwner: role = 'owner' に変更
- トランザクション内で原子的に実行

### 2. FastAPI Endpoints

- PUT /api/organizations/{org_id}/members/{profile_id}/role
  - Request: { role: 'admin' | 'member' }
  - 権限チェック実装
  - Owner への変更は不可

- POST /api/organizations/{org_id}/transfer-ownership
  - Request: { new_owner_profile_id }
  - Ownerのみ実行可能

### 3. レイヤー構成
- api/routes/organizations.py
- api/routes/members.py
- services/member_service.py
- crud/member_crud.py

## 制約
- transfer_ownershipはRPC内で完結
- 組織には常に1人のOwnerが存在
- 型ヒント必須

--------------------------------------------------

---

## ✅ 完了条件

- [ ] `transfer_ownership` RPCが正常動作
- [ ] ロール変更APIが権限マトリックス通りに動作
- [ ] Owner移譲後、元Ownerがadminになる
- [ ] 組織に常に1人のOwnerが存在する
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md)
- 前提: [002-application-approval.md](./002-application-approval.md)
- 後続: [005-account-management.md](./005-account-management.md)

---

## 📝 メモ

- Owner移譲は確認ダイアログ（UI側）で誤操作防止
- pending ステータスのユーザーにはOwner移譲不可
