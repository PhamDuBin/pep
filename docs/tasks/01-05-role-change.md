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

- [ ] `GET /api/v1/organizations/{org_id}/members` - メンバー一覧取得【追加】
- [ ] `PUT /api/v1/organizations/{org_id}/members/{profile_id}/role` - ロール変更
- [ ] `POST /api/v1/organizations/{org_id}/transfer-ownership` - オーナー移譲
- [ ] Pydantic schemas (`MemberResponse`, `MemberListResponse`, `RoleUpdateRequest`)
- [ ] Service層・CRUD層

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_members.py` | Service層 |
| Services | `tests/unit/test_services/test_member_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_member_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（権限チェック・ロール変更ロジック検証）
- [ ] CRUD層テスト（RPC呼び出し検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | メンバー一覧取得成功 | Service | members list + total_count |
| 2 | ステータスフィルター | Service | filtered members |
| 3 | 他組織のメンバー一覧取得 | Service | PermissionError |
| 4 | Owner→Adminへのロール変更 | Service | Error (Ownerは変更不可) |
| 5 | Admin→Memberへのロール変更（Ownerが実行） | Service | 成功 |
| 6 | Admin→Memberへのロール変更（Adminが実行） | Service | Error |
| 7 | Owner移譲成功 | Service | 元Owner=admin, 新Owner=owner |
| 8 | pending ユーザーへのOwner移譲 | Service | Error |

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

- GET /api/v1/organizations/{org_id}/members - メンバー一覧取得【追加】
  - Query params: ?status=active, ?role=admin
  - Response: { members: [...], total_count: int }
  - 組織メンバーのみアクセス可能

- PUT /api/v1/organizations/{org_id}/members/{profile_id}/role
  - Request: { role: 'admin' | 'member' }
  - 権限チェック実装
  - Owner への変更は不可

- POST /api/v1/organizations/{org_id}/transfer-ownership
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

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] `GET /api/v1/organizations/{org_id}/members` が動作する【追加】
- [ ] メンバー一覧にステータス/ロールフィルター機能がある【追加】
- [ ] `transfer_ownership` RPCが正常動作
- [ ] ロール変更APIが権限マトリックス通りに動作
- [ ] Owner移譲後、元Ownerがadminになる
- [ ] 組織に常に1人のOwnerが存在する
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [01-01 Signup](./01-01-signup.md)
- 前提: [01-03 Application Approval](./01-03-application-approval.md)
- 後続: [01-06 Account Management](./01-06-account-management.md)

---

## 📝 メモ

- Owner移譲は確認ダイアログ（UI側）で誤操作防止
- pending ステータスのユーザーにはOwner移譲不可
