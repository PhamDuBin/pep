# Supabase Development / Supabase開発環境

## 現在の環境構成 / Current Environment Configuration

> **Note**: 当面は全環境でSupabase Cloudを共有して使用します。Localは将来的なオプションです。
>
> **Note**: For now, all environments share Supabase Cloud. Local is a future option.

| 環境 | Supabase | 用途 |
|------|----------|------|
| **開発（dev）** | Cloud (共有) | 個人開発・ローカルテスト |
| **検証（stg）** | Cloud (共有) | チーム検証・結合テスト |
| **本番（prod）** | Cloud (別プロジェクト) | 本番稼働 |

---

## Cloud Setup (推奨) / Cloud Setup (Recommended)

### 1. Supabaseプロジェクト作成 / Create Supabase Project

1. https://supabase.com にアクセス
2. サインイン（GitHub / Google / Email など）
3. 「New Project」をクリック
4. 設定:
   - **Name**: `PEP` (開発用) / `pep-prod` (本番用)
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: Northeast Asia (Tokyo)
5. 「Create new project」をクリック

### 2. 接続情報の取得 / Get Connection Details

1. プロジェクトダッシュボードを開く
2. **Settings** → **API** で以下を確認:
   - `Project URL` → `SUPABASE_URL`
   - `service_role key` (secret) → `SUPABASE_SERVICE_KEY`
3. **Settings** → **API** → **JWT Settings** で:
   - `JWT Secret` → `SUPABASE_JWT_SECRET`

### 3. Backend .env 設定 / Backend .env Configuration

```env
# Supabase Cloud
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...(service_role key)
SUPABASE_JWT_SECRET=your-jwt-secret-from-dashboard
FRONTEND_URL=http://localhost:4200
```

### 4. マイグレーション適用 / Apply Migrations

```bash
# Supabase CLIでCloudにリンク
supabase link --project-ref <project-id>

# マイグレーション適用
supabase db push
```

---

## Local Setup (将来オプション) / Local Setup (Future Option)

> Supabase Localを使用する場合の手順。Docker必須。

### Prerequisites / 前提条件

- Docker Desktop
- Supabase CLI

---

## Setup / セットアップ

### 1. Supabase CLIインストール / Install Supabase CLI

**macOS (Homebrew):**
```bash
brew install supabase/tap/supabase
```

**または / Or (Manual):**
```bash
mkdir -p ~/bin
curl -sSL https://github.com/supabase/cli/releases/latest/download/supabase_darwin_arm64.tar.gz | tar -xz -C ~/bin
echo 'export PATH=$HOME/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
```

### 2. Supabase起動 / Start Supabase

```bash
cd /path/to/pep
supabase start
```

初回はDockerイメージのダウンロードで数分かかります。

### 3. 起動確認 / Verify Startup

```bash
supabase status
```

出力例:
```
         API URL: http://localhost:54321
     GraphQL URL: http://localhost:54321/graphql/v1
  S3 Storage URL: http://localhost:54321/storage/v1/s3
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJ...
service_role key: eyJ...
   S3 Access Key: ...
   S3 Secret Key: ...
       S3 Region: local
```

---

## Local URLs / ローカルURL一覧

| Service | URL | Description |
|---------|-----|-------------|
| **API** | http://localhost:54321 | Supabase API |
| **Studio** | http://localhost:54323 | 管理画面（テーブル/ユーザー管理） |
| **Inbucket** | http://localhost:54324 | メール確認（開発用） |
| **Database** | postgresql://postgres:postgres@localhost:54322/postgres | PostgreSQL直接接続 |

---

## Backend .env 設定 / Backend .env Configuration

```env
# Supabase Local
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_KEY=<service_role key from supabase status>
SUPABASE_JWT_SECRET=super-secret-jwt-token-with-at-least-32-characters-long
FRONTEND_URL=http://localhost:4200
```

`supabase status` で表示される `service_role key` を使用してください。

---

## Common Commands / よく使うコマンド

```bash
# 起動 / Start
supabase start

# 停止 / Stop
supabase stop

# 状態確認 / Status
supabase status

# DBリセット / Reset database
supabase db reset

# マイグレーション実行 / Run migrations
supabase db push

# マイグレーション作成 / Create migration
supabase migration new <migration_name>

# TypeScript型生成 / Generate TypeScript types
supabase gen types typescript --local > ../frontend/src/shared/types/database.types.ts

# ログ確認 / View logs
supabase logs
```

---

## テストユーザー作成 / Create Test User

### 方法1: Studio UI

1. http://localhost:54323 を開く
2. **Authentication** → **Users**
3. **Add user** → **Create new user**
4. メールアドレスとパスワードを入力

### 方法2: curl

```bash
curl -X POST 'http://localhost:54321/auth/v1/signup' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## JWTトークン取得 / Get JWT Token

### Cloud環境でログインしてトークン取得

```bash
curl -X POST 'https://xxxxx.supabase.co/auth/v1/token?grant_type=password' \
  -H 'apikey: <anon_key from dashboard>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

レスポンスの `access_token` をSwagger UIで使用。

### Local環境（将来オプション）

```bash
curl -X POST 'http://localhost:54321/auth/v1/token?grant_type=password' \
  -H 'apikey: <anon_key>' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

---

## Troubleshooting / トラブルシューティング

### Docker not running
```
Error: Cannot connect to the Docker daemon
```
→ Docker Desktopを起動してください

### Port already in use
```
Error: address already in use
```
→ `supabase stop` してから `supabase start`

### Reset everything
```bash
supabase stop
supabase start --ignore-health-check
# または完全リセット
supabase db reset
```

---

## Cloud環境への切り替え / Switch to Cloud

検証/本番環境では `.env` を Cloud の値に変更:

```env
# Supabase Cloud
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...(Cloud service_role key)
SUPABASE_JWT_SECRET=<from Supabase Dashboard>
```

---

## チーム開発フロー / Team Development Workflow

### 現在の環境構成（Cloud共有） / Current Setup (Shared Cloud)

```
開発者A: Supabase Cloud（共有 pep-dev）
開発者B: Supabase Cloud（共有 pep-dev）
         ↓ マージ後
検証環境: Supabase Cloud（共有 pep-dev）
本番環境: Supabase Cloud（pep-prod）
```

> **注意**: 開発中は同じDBを共有するため、破壊的な変更（テーブル削除など）は事前にチームに確認してください。

### マイグレーション管理 / Migration Management

#### 1. テーブル変更時（開発者）

```bash
# Supabase CLIでCloudにリンク（初回のみ）
supabase link --project-ref <project-id>

# 新しいマイグレーション作成
supabase migration new add_user_profile

# supabase/migrations/20240123000000_add_user_profile.sql が作成される
# SQLを記述
```

#### 2. Cloudに適用

```bash
# マイグレーション適用
supabase db push
```

#### 3. Gitにコミット

```bash
git add supabase/migrations/
git commit -m "Add user profile table migration"
git push
```

#### 4. 他の開発者がpull後

```bash
git pull
# マイグレーションファイルを取得
# ※ Cloudはすでに適用済みなのでローカルでの操作は不要
```

### ブランチ戦略との連携 / Branch Strategy

```
feature/xxx ─→ develop ─→ staging ─→ main
     ↓            ↓          ↓         ↓
   Cloud       Cloud      Cloud     Cloud
  (pep-dev)  (pep-dev)  (pep-dev) (pep-prod)
```

| ブランチ | 環境 | Supabase |
|---------|------|----------|
| feature/* | 個人開発 | Cloud (pep-dev 共有) |
| develop | 開発統合 | Cloud (pep-dev 共有) |
| staging | 検証 | Cloud (pep-dev 共有) |
| main | 本番 | Cloud (pep-prod) |

### 将来的な構成（Local + Cloud） / Future Setup

Supabase Localに慣れたら以下の構成に移行可能：

| ブランチ | 環境 | Supabase |
|---------|------|----------|
| feature/* | 個人開発 | Local（個人PC） |
| develop | 開発統合 | Local（個人PC） |
| staging | 検証 | Cloud (staging) |
| main | 本番 | Cloud (production) |

---

## References / 参考

- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Local Development](https://supabase.com/docs/guides/local-development)
