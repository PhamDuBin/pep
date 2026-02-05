# [Task] Notifications / 通知機能

## 🔗 GitLab Issue
- Link: [#36](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/36)

---

## 📝 概要

プロジェクト計画書通知、チャット新着通知などをメール・WebPush・アプリ内で配信する機能。

**メール送信の役割分担**:
- **認証系メール**: Supabase Auth（サインアップ確認、パスワードリセット等）
- **トランザクション系メール**: Resend（申請承認/却下、招待、通知等）

Supabase Realtimeを使用したリアルタイム通知も実装。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC08](../UC/UC8.md) | ベンダーへのプロジェクト計画書通知 |
| [UC12](../UC/UC12.md) | チャット新着確認 |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. プロジェクト計画書送信通知（UC08）
   project.status → in_discussion
   └─→ 各Vendorにメール送信
   └─→ チャットルーム作成 + 初回メッセージ

2. チャット新着通知
   POST /api/chat-rooms/{id}/messages
   └─→ 相手組織ユーザーに通知
   └─→ WebPush / アプリ内バッジ更新

3. 未読バッジ更新（Realtime）
   Supabase Realtime → Frontend
   └─→ ヘッダーバッジ更新
```

---

## 📋 スコープ

### メール一覧

| 種別 | 送信元 | トリガー | 宛先 |
|------|--------|---------|------|
| サインアップ確認 | Supabase Auth | サインアップ時 | ユーザー |
| パスワードリセット | Supabase Auth | リセット要求時 | ユーザー |
| マジックリンク | Supabase Auth | ログイン要求時 | ユーザー |
| **申請承認** | Resend | 管理者承認時 | 申請者 |
| **申請却下** | Resend | 管理者却下時 | 申請者（理由付き） |
| **メンバー招待** | Resend | 招待作成時 | 招待先 |
| **計画書送信** | Resend | Vendor送信時 | Vendor管理者 |
| チャット新着（オプション） | Resend | メッセージ受信時 | 相手方 |

**太字**: 本タスクで実装

### Backend (FastAPI)

- [ ] Resend統合（トランザクション系メール送信）
- [ ] メールサービス (`email_service.py`)
- [ ] 通知サービス (`notification_service.py`)
- [ ] メールテンプレート作成
  - [ ] 申請承認通知
  - [ ] 申請却下通知
  - [ ] メンバー招待
  - [ ] プロジェクト計画書通知
  - [ ] チャット通知（オプション）
- [ ] Webhook/イベントハンドラ

### Frontend (Optional - Phase 2)

- [ ] Supabase Realtime購読
- [ ] WebPush設定
- [ ] 通知バッジUI

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Services | `tests/unit/test_services/test_notification_service.py` | Email Service |
| Services | `tests/unit/test_services/test_email_service.py` | Resend API |

- [ ] Service層テスト（通知ロジック検証）
- [ ] メール送信テスト（Resend mock）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | 申請承認通知成功 | Service | メール送信呼出 |
| 2 | 申請却下通知成功 | Service | メール送信（理由付き） |
| 3 | メンバー招待メール成功 | Service | 招待リンク含むメール |
| 4 | プロジェクト計画書通知成功 | Service | Vendorへメール送信 |
| 5 | Resendエラー時 | Service | エラーログ記録, 処理継続 |
| 6 | 通知頻度制限 | Service | 連続通知抑制 |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/011-notifications.md` に基づき Notifications（通知）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC8.md, UC12.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Resend Integration

環境変数:
- RESEND_API_KEY
- RESEND_FROM_EMAIL (例: noreply@pep.example.com)
- FRONTEND_URL (メール内リンク用)

```bash
pip install resend
```

### 2. Notification Service

`services/notification_service.py`:

```python
class NotificationService:
    async def send_project_plan_notification(
        self,
        project: Project,
        vendor_org: Organization,
        vendor_users: List[Profile]
    ) -> None:
        """プロジェクト計画書通知をVendorに送信"""
        # 1. メール送信（各ユーザーに）
        # 2. チャットルーム作成
        # 3. 初回システムメッセージ投稿

    async def send_chat_notification(
        self,
        room: ChatRoom,
        message: ChatMessage,
        recipients: List[Profile]
    ) -> None:
        """チャット新着通知"""
        # 1. WebPush (optional)
        # 2. アプリ内通知更新

    async def send_project_completed_notification(
        self,
        project: Project,
        vendor_orgs: List[Organization]
    ) -> None:
        """プロジェクト完了通知"""
```

### 3. Email Templates

テンプレート（HTMLメール）:

**プロジェクト計画書通知メール**:
```
件名: [PEP] 新しいプロジェクト計画書が届きました - {project.title}

本文:
{buyer_org.name} 様から新しいプロジェクト計画書が届きました。

プロジェクト: {project.title}

詳細を確認するには以下のリンクをクリックしてください:
{frontend_url}/vendor/projects/{project.id}

---
PEP (Project Enhancement Platform)
```

**チャット通知メール** (オプション、即時通知ではなくダイジェスト):
```
件名: [PEP] 未読メッセージがあります

本文:
以下のプロジェクトで未読メッセージがあります:
- {project.title}: {unread_count}件

{frontend_url}/vendor/chat
```

### 4. Integration Points

**プロジェクト送信開始時 (006-project-management.md)**:
```python
# project_service.py
async def start_discussion(project_id: UUID):
    # ... status update ...

    # 通知送信
    for vendor in project_vendors:
        await notification_service.send_project_plan_notification(
            project, vendor.org, vendor.users
        )
```

**チャットメッセージ送信時 (010-buyer-vendor-chat.md)**:
```python
# chat_service.py
async def send_message(room_id: UUID, content: str):
    # ... message insert ...

    # 通知送信（相手組織のユーザー）
    recipients = get_other_org_members(room, sender)
    await notification_service.send_chat_notification(
        room, message, recipients
    )
```

### 5. レイヤー構成
- services/notification_service.py (Notification Logic)
- services/email_service.py (Resend wrapper)
- templates/email/ (HTML templates)

## 制約
- メール送信は非同期（バックグラウンドタスク）
- Resendエラー時はログに記録、処理は継続
- 通知頻度制限（同一ユーザーへの連続通知抑制）
- 型ヒント必須

## テスト要件
- Service層のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- Resend APIはモック使用（実API呼び出し不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] Resend統合が動作
- [ ] 申請承認通知メールが送信される
- [ ] 申請却下通知メールが送信される（理由付き）
- [ ] メンバー招待メールが送信される
- [ ] プロジェクト計画書通知メールが送信される
- [ ] エラーハンドリングが適切（送信失敗時もビジネス処理は継続）
- [ ] ユニットテスト作成（notification_service, email_service）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [02-01 Project Management](./02-01-project-management.md) (start-discussion trigger)
- 前提: [03-02 Buyer-Vendor Chat](./03-02-buyer-vendor-chat.md) (chat notification)

---

## 📝 メモ

- **認証系メールはSupabase Auth**: サインアップ確認、パスワードリセット、マジックリンク等は自動送信
- **トランザクション系メールはResend**: 申請承認/却下、招待、通知等をFastAPIから送信
- WebPush は Phase 2 で実装
- ダイジェストメール（1日1回の未読まとめ）は将来検討
- 通知設定（オン/オフ）UIは将来検討
- Resend + React Email でテンプレート管理推奨
