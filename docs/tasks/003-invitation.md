# [Task] Invitation / 招待機能

## 🔗 GitLab Issue
- Link: https://gitlab.i-stech.net:9080/bbs/pep/-/issues/28

---

## 📝 概要

組織のOwner/Adminがメンバーを招待し、招待されたユーザーがアカウントを作成して組織に参加する機能。

**重要**: 招待経由で参加するユーザーは承認不要。profiles は `active` 状態で作成される。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Invitation State Transitions](../workflows/account.md#12-invitation-state-transitions--招待の状態遷移) | ワークフロー詳細 |
| [Record Creation Overview](../workflows/account.md#record-creation-overview--レコード作成タイミング概要) | 作成タイミング |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

### 招待作成（Owner/Admin）

```
POST /api/invitations { email, role }
  └─→ invitations INSERT (status='pending', expires_at=7日後)
  └─→ 招待メール送信
```

### 招待承諾（招待されたユーザー）

```
1. Frontend → Supabase Auth: signUp(email, password)
   └─→ auth.users INSERT

2. POST /api/invitations/{token}/accept
   └─→ accept_invitation RPC
       ├─→ invitations UPDATE (status='accepted')
       └─→ profiles INSERT (status='active')
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `invitations` テーブル作成
- [ ] `accept_invitation` RPC関数作成
- [ ] RLSポリシー設定

### Backend (FastAPI)

- [ ] `POST /api/invitations` 招待作成
- [ ] `GET /api/invitations` 招待一覧
- [ ] `POST /api/invitations/{token}/accept` 承諾
- [ ] `DELETE /api/invitations/{id}` 取消
- [ ] Pydantic schemas
- [ ] Service層・CRUD層

### Tests

- [ ] RPC関数のユニットテスト
- [ ] 有効期限切れテスト
- [ ] 権限チェックテスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/003-invitation.md` に基づき Invitation（招待）機能を実装してください。

## 重要な前提
- 招待経由のユーザーは承認不要（profiles は `active` で作成）
- organizations は作成しない（既存組織に参加）
- applications は作成しない

## 参照ドキュメント
- ワークフロー: docs/workflows/account.md の「1.2 Invitation State Transitions」セクション
- レコード作成タイミング: docs/workflows/account.md の「Record Creation Overview」セクション
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`invitations` テーブル:
- id (UUID, PK)
- organization_id (UUID, FK)
- email (TEXT)
- role (TEXT: 'admin' | 'member')
- token (TEXT, UNIQUE)
- status (TEXT: 'pending' | 'accepted' | 'expired')
- invited_by (UUID, FK to profiles)
- expires_at (TIMESTAMPTZ) - デフォルト7日後
- accepted_at (TIMESTAMPTZ, nullable)
- created_at, updated_at
- UNIQUE(organization_id, email)

`accept_invitation(p_token, p_user_id)` RPC:
- invitations の有効性チェック（status='pending', expires_at > now()）
- invitations UPDATE (status='accepted', accepted_at=now())
- profiles INSERT (organization_id, role from invitation, status='active')
- トランザクション内で実行
- RETURNS { profile_id, organization_id }

### 2. FastAPI Endpoints

- POST /api/invitations - 招待作成（Owner/Admin only）
  - Request: { email, role }
  - Response: { invitation_id, token }

- GET /api/invitations - 招待一覧
  - Query: ?status=pending

- POST /api/invitations/{token}/accept - 招待承諾
  - Request: { user_id }
  - Response: { profile_id, organization_id }

- DELETE /api/invitations/{id} - 招待取消

### 3. レイヤー構成
- api/routes/invitations.py
- services/invitation_service.py
- crud/invitation_crud.py

### 4. RLSポリシー
- invitations: Owner/Adminのみ作成・一覧可能

## 制約
- accept_invitationはRPC内で完結
- profiles は `active` 状態で作成
- 有効期限切れの招待はacceptでエラー
- 型ヒント必須

--------------------------------------------------

---

## ✅ 完了条件

- [ ] `invitations` テーブルが作成済み
- [ ] `accept_invitation` RPCが正常動作
- [ ] 招待 → 承諾 → メンバー追加が動作
- [ ] 招待承諾後、profiles.status = 'active'
- [ ] 有効期限切れ招待がエラーになる
- [ ] 重複招待がエラーになる
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [001-signup.md](./001-signup.md)
- 前提: [002-application-approval.md](./002-application-approval.md)
- 後続: [004-role-change.md](./004-role-change.md)

---

## 📝 メモ

- トークンは `gen_random_uuid()` で生成
- 招待メールURL: `{FRONTEND_URL}/invitations/{token}`
- **Self-Signup との違い**: 招待経由は承認不要で即 active
