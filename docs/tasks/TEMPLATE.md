# [Task] {Task Name}

## 🔗 GitLab Issue
- Link: {GitLab Issue URL}

---

## 📝 概要

{機能の概要を記載}

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [Workflow](../workflows/{filename}.md) | ワークフロー詳細 |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
{処理フローを簡潔に記載}
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] テーブル作成
- [ ] RPC関数作成
- [ ] RLSポリシー設定

### Backend (FastAPI)

- [ ] エンドポイント実装
- [ ] Pydantic schemas
- [ ] Service層
- [ ] CRUD層

### Tests

- [ ] ユニットテスト
- [ ] 統合テスト

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/{filename}.md` に基づき {機能名} を実装してください。

## 参照ドキュメント
- ワークフロー: docs/workflows/{filename}.md
- DB設計: docs/architecture/database.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

{テーブル・RPC定義}

### 2. FastAPI Endpoints

{エンドポイント定義}

### 3. レイヤー構成

{ファイル構成}

## 制約
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義

--------------------------------------------------

---

## ✅ 完了条件

- [ ] {条件1}
- [ ] {条件2}
- [ ] テストがパス

---

## 🔗 関連タスク

- 前提: [{前提タスク}](./{filename}.md)
- 後続: [{後続タスク}](./{filename}.md)

---

## 📝 メモ

{実装上の注意点やメモ}
