# [Task] Notifications / 通知機能

## 🔗 GitLab Issue
- Link: (後で作成)

---

## 📝 概要

プロジェクト計画書通知、チャット新着通知などをメール・WebPush・アプリ内で配信する機能。
SendGridを使用したメール送信、Supabase Realtimeを使用したリアルタイム通知を実装。

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

### Backend (FastAPI)

- [ ] SendGrid統合（メール送信）
- [ ] 通知サービス (`notification_service.py`)
- [ ] プロジェクト計画書通知テンプレート
- [ ] チャット通知テンプレート
- [ ] Webhook/イベントハンドラ

### Frontend (Optional - Phase 2)

- [ ] Supabase Realtime購読
- [ ] WebPush設定
- [ ] 通知バッジUI

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Services | `tests/unit/test_services/test_notification_service.py` | SendGrid API |
| Services | `tests/unit/test_services/test_email_service.py` | SendGrid API |

- [ ] Service層テスト（通知ロジック検証）
- [ ] メール送信テスト（SendGrid mock）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | プロジェクト計画書通知成功 | Service | メール送信呼出, チャットルーム作成 |
| 2 | チャット通知成功 | Service | 通知送信呼出 |
| 3 | SendGridエラー時 | Service | エラーログ記録, 処理継続 |
| 4 | 通知頻度制限 | Service | 連続通知抑制 |

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

### 1. SendGrid Integration

環境変数:
- SENDGRID_API_KEY
- SENDGRID_FROM_EMAIL
- FRONTEND_URL (メール内リンク用)

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
- services/email_service.py (SendGrid wrapper)
- templates/email/ (HTML templates)

## 制約
- メール送信は非同期（バックグラウンドタスク）
- SendGridエラー時はログに記録、処理は継続
- 通知頻度制限（同一ユーザーへの連続通知抑制）
- 型ヒント必須

## テスト要件
- Service層のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- SendGrid APIはモック使用（実API呼び出し不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] SendGrid統合が動作
- [ ] プロジェクト計画書通知メールが送信される
- [ ] チャットルームが自動作成される
- [ ] 初回システムメッセージが投稿される
- [ ] エラーハンドリングが適切
- [ ] ユニットテスト作成（notification_service, email_service）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [006-project-management.md](./006-project-management.md) (start-discussion trigger)
- 前提: [010-buyer-vendor-chat.md](./010-buyer-vendor-chat.md) (chat notification)

---

## 📝 メモ

- WebPush は Phase 2 で実装
- ダイジェストメール（1日1回の未読まとめ）は将来検討
- 通知設定（オン/オフ）UIは将来検討
- SendGrid の Dynamic Templates 使用推奨
