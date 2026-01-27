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

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_{name}.py` | Service層 |
| Services | `tests/unit/test_services/test_{name}_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_{name}_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（ビジネスロジック検証）
- [ ] CRUD層テスト（DBクエリ検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | {正常系テストケース} | Service | {期待結果} |
| 2 | {異常系テストケース} | Service | {エラー内容} |

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

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] {条件1}
- [ ] {条件2}
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [{前提タスク}](./{filename}.md)
- 後続: [{後続タスク}](./{filename}.md)

---

## 📝 メモ

{実装上の注意点やメモ}
