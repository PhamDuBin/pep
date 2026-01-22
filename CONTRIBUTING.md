# CONTRIBUTING.md

This document defines GitLab workflow rules for the PEP project.

このドキュメントは PEP プロジェクトの GitLab 運用ルールを定義します。

---

## Table of Contents / 目次

1. [Group/Project](#rule-1-groupproject)
2. [Branches](#rule-2-branches)
3. [Issue Name](#rule-3-issue-name)
4. [Issue Template](#rule-4-issue-template)
5. [Commit Convention](#rule-5-commit-convention)
6. [Merge](#rule-6-merge)
7. [Bug](#rule-7-bug)
8. [Issue Status Flow](#issue-status-flow)

---

## Rule 1: Group/Project

| GitLab Item | Description | Example |
|-------------|-------------|---------|
| Group | Client name / クライアント名 | Awesome Co |
| Sub group | Optional / 任意 | - |
| Project | Project name / プロジェクト名 | Budget Calculator |

---

## Rule 2: Branches

### Branch Structure / ブランチ構成

| Branch Name | Type | Required | Notes |
|-------------|------|----------|-------|
| `production` | Protected / 保護 | Yes | Developers cannot push directly. For production environment. / 開発者は直接プッシュ不可。本番環境用。 |
| `staging` | Protected / 保護 | No | Developers cannot push directly. For pre-production environment. / 開発者は直接プッシュ不可。再生産環境用。 |
| `main` | Protected / 保護 | Yes | Developers cannot push directly. Becomes staging environment if `staging` doesn't exist. / 開発者は直接プッシュ不可。`staging`がない場合はこれがステージング環境となる。 |
| `xxx/[issue-id-]short-description` | Unprotected / 非保護 | Yes | Created by developers for specific features/bugs. / 特定の機能/バグ対応のために開発者が作成。 |

### Branch Prefixes / 接頭辞の使い分け

| Prefix | Purpose / 用途 |
|--------|----------------|
| `feature/` | New feature development / 新機能の開発 |
| `bugfix/` | Minor bug fixes / 軽微なバグ修正 |
| `hotfix/` | Urgent critical fixes (mainly for production) / 緊急の重大な修正（主に本番用） |
| `spike/` | Experiments or prototyping / 実験やプロトタイプ作成 |
| `refactor/` | Code structure improvements without changing functionality / 機能を変えずにコード構造を改善 |
| `chore/` | Technical tasks like config, CI/CD, cleanup / 設定、CI/CD、クリーンアップなどの技術的タスク |
| `test/` | Test code creation / テストコード作成 |
| `doc/` | Documentation creation / ドキュメント作成 |
| `style/` | Code style updates (indentation, line breaks, etc.) / コードスタイルの更新（インデント、改行など） |

---

## Rule 3: Issue Name

Format / 形式: `[Type] Name`

| Type | Format | Example |
|------|--------|---------|
| Feature | `[Feature] feature name` | `[Feature] Create user` |
| Bug | `[Bug] bug name` | `[Bug] Login is not working` |
| Hotfix | `[Hotfix] name` | `[Hotfix] Username not showed` |
| Refactor | `[Refactor] name` | `[Refactor] Implement calculation as recursion` |
| Doc | `[Doc] name` | `[Doc] Correct spelling of CHANGELOG` |
| Style | `[Style] name` | `[Style] Remove empty line` |
| Test | `[Test] name` | `[Test] Create user creation test case` |
| Spike | `[Spike] name` | `[Spike] Practice Angular` |
| Chore | `[Chore] name` | `[Chore] Improve code coverage` |

**Scope examples / Scopeの例**: `api`, `fe`, `be`, `screen`, etc.

---

## Rule 4: Issue Template

PM/Leader creates Issue and Bug description templates at group level and applies them to each project.
Developers must follow templates when creating Issues/Bugs.

PM/リーダーがグループ単位でIssueとBugの説明テンプレートを作成し、各プロジェクトに適用する。
開発者はIssue/Bug作成時に必ずテンプレートに従うこと。

### Feature Template Sample / Feature テンプレート サンプル

```markdown
### Summary

### Tasks
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

/label ~"Type::Feature" ~"Status::Open"
```

### Bug Template Sample / Bug テンプレート サンプル

```markdown
### Describe the Bug

### Steps to reproduce

### The current *bug* behavior?

### The expected behavior?

### OS, Browser

### Relevant logs and/or screenshots

### Possible fixes

/label ~"Type::Bug" ~"Status::Open"
```

---

## Rule 5: Commit Convention

Format / 形式: `git commit -m "type(scope)[issue-id]: description"`

| Type | Format | Example |
|------|--------|---------|
| Feature | `feat(scope)[issue-id]: name` | `feat[5]: Create user` |
| Bugfix | `fix(scope)[issue-id]: name` | `fix[5]: Login is not working` |
| Hotfix | `hotfix(scope)[issue-id]: name` | `hotfix[4]: Username not showed` |
| Refactor | `refactor[issue-id]: name` | `refactor[5]: Implement calculation...` |
| Doc | `doc[issue-id]: name` | `doc[4]: Correct spelling...` |
| Style | `style[issue-id]: name` | `style[3]: Remove empty line` |
| Test | `test(scope)[issue-id]: name` | `test(be)[15]: Test login page` |
| Chore | `chore(scope)[issue-id]: name` | `chore(ci)[20]: Add sonarqube job...` |
| Spike | `spike(scope)[issue-id]: name` | `spike(fe)[21]: Try to fix bug...` |

---

## Rule 6: Merge

### Developer / 開発者

**Allowed / 許可:**
- Create feature branches / 機能ブランチの作成
- Regular pushes / 定期的なプッシュ
- Create Merge Requests (MR) / マージリクエスト (MR) の作成
- Code review / コードレビュー

**Prohibited / 禁止:**
- Merge to `main`/`staging`/`production` branches / main/staging/production ブランチへのマージ

### Leader / PM / リーダー・PM

**Allowed / 許可:**
- All Developer permissions above / 上記の開発者権限すべて
- Merge to `main`/`staging`/`production` / main/staging/production へのマージ

---

## Rule 7: Bug

When creating a bug, apply at least the following labels:

バグ作成時には少なくとも以下のラベルを付与すること:

- `Type::Bug`
- `Bug::Xxx` (cause category / 原因のカテゴリ)
- `Phase::Xxx` (detection phase / 検出フェーズ)

**Note:** Title must have `[Bug]` prefix. / タイトルには `[Bug]` プレフィックスを付けること。

---

## Issue Status Flow

```
Open → In Progress → Code Review → QA → Done
  ↓                      ↓
Blocked ←──────────────←─┘
```

| Status | Description |
|--------|-------------|
| Open | Issue created, not started / Issue作成済み、未着手 |
| In Progress | Development in progress / 開発中 |
| Code Review | MR created, under review / MR作成済み、レビュー中 |
| QA | Testing in progress / テスト中 |
| Blocked | Blocked by dependency / 依存関係でブロック中 |
| Done | Completed / 完了 |
