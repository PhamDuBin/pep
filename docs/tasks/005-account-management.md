# [Task] Account Suspension & Member Removal / アカウント停止・メンバー削除

## 🔗 GitLab Issue
- Link: https://gitlab.i-stech.net:9080/bbs/pep/-/issues/30

---

## 📝 概要

組織の停止/再開機能とメンバーの削除（ソフトデリート）機能。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Account Suspension](../workflows/account.md#15-account-suspension--アカウント停止) | 停止ワークフロー |
| [Member Removal](../workflows/account.md#16-member-removal--メンバー削除) | 削除ワークフロー |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

### 組織ステータス

| Status | 説明 | ログイン |
|--------|------|---------|
| `pending` | 承認待ち | ❌ |
| `active` | 正常稼働 | ✅ |
| `inactive` | 自主停止 | ❌ |
| `suspended` | 管理者停止 | ❌ |

### メンバー削除

```
DELETE /api/organizations/{org_id}/members/{profile_id}
  └─→ profiles UPDATE (is_deleted=true, deleted_at=now())
```

**ハードデリートは禁止**

---

## 📋 スコープ

### Database (Supabase)

- [ ] `profiles.is_deleted` カラム追加
- [ ] `profiles.deleted_at` カラム追加
- [ ] RLSポリシー更新

### Backend (FastAPI)

- [ ] `PUT /api/admin/organizations/{org_id}/suspend`
- [ ] `PUT /api/admin/organizations/{org_id}/reactivate`
- [ ] `DELETE /api/organizations/{org_id}/members/{profile_id}`
- [ ] `DELETE /api/organizations/{org_id}/members/me`
- [ ] Pydantic schemas
- [ ] Service層・CRUD層

### Tests

- [ ] 停止/再開テスト
- [ ] ソフトデリートテスト
- [ ] アクセス制限テスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/005-account-management.md` に基づき Account Suspension & Member Removal 機能を実装してください。

## 参照ドキュメント
- ワークフロー: docs/workflows/account.md の「1.5 Account Suspension」「1.6 Member Removal」セクション
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

profilesテーブルに追加:
- is_deleted (BOOLEAN, DEFAULT false)
- deleted_at (TIMESTAMPTZ, nullable)

### 2. Account Suspension APIs

- PUT /api/admin/organizations/{org_id}/suspend
  - Request: { reason: string }
  - Platform Adminのみ
  - organizations.status = 'suspended'

- PUT /api/admin/organizations/{org_id}/reactivate
  - Platform Adminのみ
  - organizations.status = 'active'

### 3. Member Removal APIs

- DELETE /api/organizations/{org_id}/members/{profile_id}
  - Owner/Adminが実行可能
  - 削除ルール:
    - member: owner/admin が削除可能
    - admin: owner のみ削除可能
    - owner: 削除不可
  - ソフトデリート: is_deleted = true, deleted_at = now()

- DELETE /api/organizations/{org_id}/members/me
  - 自己退会
  - Ownerは実行不可

### 4. レイヤー構成
- api/routes/admin/organizations.py
- api/routes/members.py
- services/organization_service.py
- services/member_service.py

### 5. RLSポリシー更新
- is_deleted = true を通常クエリから除外

## 制約
- ハードデリートは禁止
- Ownerの削除/退会は不可
- 型ヒント必須

--------------------------------------------------

---

## ✅ 完了条件

- [ ] 組織の停止/再開が正常動作
- [ ] 停止組織のメンバーがアクセス制限される
- [ ] メンバー削除（ソフトデリート）が動作
- [ ] 自己退会が動作
- [ ] Ownerの削除/退会がエラーになる
- [ ] RLSポリシーが正しく機能
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md)
- 前提: [004-role-change.md](./004-role-change.md)

---

## 📝 メモ

- auth.users は削除しない（再登録時のメール重複防止）
- 削除されたユーザーの表示名は「削除されたユーザー」に統一（UI側）
- GDPR対応（完全削除）は将来的に別途対応
