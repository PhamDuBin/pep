# PEP Backend API

FastAPI backend for Project Enhancement Platform.

PEP (Project Enhancement Platform) のバックエンドAPI。

---

## Prerequisites / 前提条件

- Python 3.11+
- pip

---

## Setup / セットアップ

### 1. Create virtual environment / 仮想環境の作成

```bash
cd backend
python3 -m venv venv
```

### 2. Activate virtual environment / 仮想環境の有効化

**macOS / Linux:**
```bash
source venv/bin/activate
```

**Windows (PowerShell):**
```powershell
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
.\venv\Scripts\activate.bat
```

### 3. Install dependencies / 依存関係のインストール

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables / 環境変数の設定

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
`.env` を編集して認証情報を設定:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=http://localhost:3000
```

---

## Development / 開発

### Start development server / 開発サーバーの起動

```bash
uvicorn app.main:app --reload
```

Server will start at: http://localhost:8000

サーバーは http://localhost:8000 で起動します。

### API Documentation / APIドキュメント

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Swagger UIでのAPI実行方法 / How to Execute APIs in Swagger

#### 1. 認証不要のAPI / Public APIs

1. Swagger UI (http://localhost:8000/docs) を開く
2. 実行したいAPIを選択
3. 「Try it out」をクリック
4. パラメータを入力
5. 「Execute」をクリック

#### 2. 認証が必要なAPI / Authenticated APIs

1. **JWTトークンを取得** / Get JWT Token

   **方法A: Supabase Studio (Local)**
   1. http://localhost:54323 を開く
   2. Authentication → Users でテストユーザー作成
   3. SQL Editor で以下を実行してトークン取得:
      ```sql
      SELECT auth.jwt();
      ```

   **方法B: curl でログイン**
   ```bash
   curl -X POST 'http://localhost:54321/auth/v1/token?grant_type=password' \
     -H 'apikey: YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{"email": "test@example.com", "password": "password123"}'
   ```
   レスポンスの `access_token` を使用

   **方法C: フロントエンドから取得**
   ```javascript
   const { data } = await supabase.auth.getSession()
   console.log(data.session.access_token)
   ```

2. **Swagger UIで認証** / Authorize in Swagger UI

   - 右上の「Authorize」ボタンをクリック
   - Value欄に入力（`Bearer `は不要、トークンのみ）:
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
   - 「Authorize」→「Close」

3. **APIを実行** / Execute API

   - 実行したいAPIを選択
   - 「Try it out」→ パラメータ入力 →「Execute」

---

## Project Structure / プロジェクト構成

```
backend/
├── app/
│   ├── api/
│   │   └── routes/       # Endpoints / エンドポイント
│   ├── core/             # Config, Security / 設定・セキュリティ
│   ├── crud/             # Database operations / DB操作
│   ├── schemas/          # Pydantic models / リクエスト・レスポンス型
│   ├── services/         # Business logic / ビジネスロジック
│   └── main.py           # FastAPI app / アプリケーション
├── templates/            # HTML templates (PDF) / HTMLテンプレート
├── requirements.txt
├── Dockerfile
└── README.md
```

### Architecture / アーキテクチャ

3-Layer Architecture / 3層アーキテクチャ:

```
routes/ → services/ → crud/
   ↓         ↓          ↓
 HTTP    Business     Database
 処理    ロジック      操作
```

---

## Testing / テスト

### Install dev dependencies / 開発用依存関係インストール

```bash
pip install -r requirements-dev.txt
```

### Run tests / テスト実行

```bash
# Run all tests / 全テスト実行
pytest

# Run with verbose output / 詳細出力
pytest -v

# Run specific test file / 特定ファイルのみ
pytest tests/test_users.py

# Run with coverage / カバレッジ付き
pytest --cov=app
```

---

## Useful Commands / 便利なコマンド

```bash
# Activate venv / 仮想環境有効化
source venv/bin/activate

# Deactivate venv / 仮想環境無効化
deactivate

# Install new package / 新規パッケージ追加
pip install <package-name>
pip freeze > requirements.txt

# Check installed packages / インストール済みパッケージ確認
pip list
```

---

## Deployment / デプロイ

### Cloud Run

```bash
gcloud run deploy pep-api \
  --source . \
  --region asia-northeast1 \
  --set-env-vars "SUPABASE_URL=...,SUPABASE_SERVICE_KEY=..."
```

See [CI/CD Pipeline](../docs/architecture/cicd.md) for automated deployment.

自動デプロイについては [CI/CD Pipeline](../docs/architecture/cicd.md) を参照。
