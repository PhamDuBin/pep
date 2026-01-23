# 2. Projects & RFI Workflows / プロジェクト・RFIワークフロー

[← Back to Workflows Index / ワークフロー目次に戻る](./index.md)

---

## 2.1 Project State Transitions / プロジェクト状態遷移

**Constraints / 制約:**
- `Draft → InDiscussion`: Vendor selection required / Vendor選択必須
- `InDiscussion → Closed`: Manual only (no auto-close) / 手動のみ（自動クローズなし）
- Once `Closed`, cannot reopen / 一度 `Closed` になると再オープン不可

```mermaid
stateDiagram-v2
    [*] --> Draft: POST /projects

    Draft --> Draft: PUT /projects/{id}<br/>Edit content / 内容編集
    Draft --> InDiscussion: POST /projects/{id}/start-discussion<br/>Select Vendor + Send / Vendor選択 + 送信

    InDiscussion --> InDiscussion: Chat discussion / チャット協議<br/>Receive RFI response / RFI回答受信
    InDiscussion --> Closed: POST /projects/{id}/close<br/>Complete / 完了処理

    Closed --> [*]

    note right of Draft
        Buyer creating RFI draft
        Buyer が RFI 草案を作成中
        Refine with AI chat
        AI チャットで内容をブラッシュアップ
    end note

    note right of InDiscussion
        RFI sent to Vendor
        Vendor に RFI を送信済み
        In discussion via chat
        チャットで協議中
    end note

    note right of Closed
        Project completed
        プロジェクト完了
        No changes allowed
        変更不可
    end note
```

---

## 2.2 RFI Response State Transitions / RFI回答の状態遷移

```mermaid
stateDiagram-v2
    [*] --> Draft: Vendor starts response / Vendor が回答開始

    Draft --> Draft: PUT /rfi/{id}/responses/{rid}<br/>Update draft / 下書き更新
    Draft --> Submitted: POST /rfi/{id}/responses/{rid}/submit<br/>Submit response / 回答提出

    Submitted --> [*]

    note right of Draft
        Vendor creating response
        Vendor が回答を作成中
        Can edit multiple times
        何度でも編集可能
    end note

    note right of Submitted
        Response submitted to Buyer
        Buyer に回答を提出済み
        No further edits allowed
        以降は編集不可
    end note
```

---

## 2.3 API Summary / API一覧

### Project APIs

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| POST | `/projects` | Buyer | Create new project (Draft) |
| PUT | `/projects/{id}` | Buyer | Update project content |
| POST | `/projects/{id}/start-discussion` | Buyer | Start discussion with vendors |
| POST | `/projects/{id}/close` | Buyer | Close project |
| GET | `/projects` | Buyer/Vendor | List projects |
| GET | `/projects/{id}` | Buyer/Vendor | Get project details |

### RFI Response APIs

| Method | Endpoint | Actor | Description |
|--------|----------|-------|-------------|
| POST | `/rfi/{id}/responses` | Vendor | Create response draft |
| PUT | `/rfi/{id}/responses/{rid}` | Vendor | Update response |
| POST | `/rfi/{id}/responses/{rid}/submit` | Vendor | Submit response |
| GET | `/rfi/{id}/responses` | Buyer/Vendor | List responses |

---

[← Back to Workflows Index / ワークフロー目次に戻る](./index.md)
