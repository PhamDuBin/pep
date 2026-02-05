# [Task] Project Management / プロジェクト管理

## 🔗 GitLab Issue
- Link: [#31](https://gitlab.i-stech.net:9080/bbs/pep/-/issues/31)

---

## 📝 概要

Buyerがプロジェクトを作成・編集・管理する機能。
プロジェクトのステータス遷移（Draft → In Discussion → Closed）と、計画書のVendor送信を含む。

**Vendor側対応**: Vendorは招待されたプロジェクトの閲覧・チャット参加が可能。ただしAIチャットセッションにはアクセス不可。

---

## 📍 参照ドキュメント

| Document | Section |
|----------|---------|
| [UC06](../UC/UC6.md) | プロジェクト計画書草案作成 |
| [UC07](../UC/UC7.md) | プロジェクト計画書編集・送信開始 |
| [UC08](../UC/UC8.md) | Vendor通知（チャットルーム作成） |
| [UC10](../UC/UC10.md) | プロジェクト完了 |
| [UC11](../UC/UC11.md) | プロジェクト一覧・検索 |
| [Database Design](../architecture/database.md) | テーブル定義 |
| [API Endpoints](../architecture/api-endpoints.md) | APIエンドポイント |
| [Software Layers](../architecture/layers.md) | 3層アーキテクチャ |

---

## 📊 処理フロー概要

```
1. プロジェクト作成 (Draft) + AIセッション自動作成
   POST /api/projects
   └─→ projects INSERT (status='draft')
   └─→ ai_chat_sessions INSERT (project_id=new project)

2. プロジェクト編集（draftのみ）
   PUT /api/projects/{id}
   └─→ projects UPDATE (title, description)

3. プロジェクト削除（draftのみ）
   DELETE /api/projects/{id}
   └─→ projects UPDATE (is_deleted=true)
   └─→ ai_chat_sessions UPDATE (is_deleted=true)

4. Vendor一覧取得（選択用）
   GET /api/vendors?search=xxx
   └─→ organizations SELECT (type='vendor', status='active')

5. 計画書送信（Draft → In Discussion）
   POST /api/projects/{id}/send
   └─→ 計画書をSupabase Storageに保存
   └─→ project_plans INSERT
   └─→ IF status='draft': projects UPDATE (status='in_discussion', started_at=now)
   └─→ project_vendors INSERT（新規Vendorのみ）
   └─→ project_plan_vendors INSERT（今回の計画書×Vendor）
   └─→ chat_rooms INSERT（新規Vendorのみ）
   └─→ Vendor通知処理（UC08 → 05-01連携）

6. プロジェクトクローズ (In Discussion → Closed) = アーカイブ
   POST /api/projects/{id}/close
   └─→ projects UPDATE (status='closed', closed_at=now)

7. プロジェクト一覧
   GET /api/projects?status=xxx
   └─→ Buyer: buyer_org_id = 自組織
   └─→ Vendor: project_vendors に自組織が含まれる
   └─→ デフォルト: closed除外（アーカイブ扱い）
```

---

## 📋 スコープ

### Database (Supabase)

- [ ] `projects` テーブル作成
- [ ] `project_vendors` テーブル作成
- [ ] RLSポリシー設定（Buyer/Vendor両対応）
- [ ] インデックス作成（buyer_org_id, status）
- [ ] ※ `chat_rooms`, `chat_room_members` は 03-02 で作成（send時に利用）
- [ ] ※ `project_plans`, `project_plan_vendors` は 02-02 で作成（send時に利用）

### Backend (FastAPI)

- [ ] `GET /api/vendors` - Vendor一覧取得（選択用）
- [ ] `GET /api/projects` - 一覧取得（Buyer/Vendor両対応）
- [ ] `POST /api/projects` - 新規作成（AIセッション自動作成含む）
- [ ] `GET /api/projects/{id}` - 詳細取得
- [ ] `PUT /api/projects/{id}` - 更新（draftのみ）
- [ ] `DELETE /api/projects/{id}` - 削除（draftのみ）
- [ ] `POST /api/projects/{id}/send` - 計画書送信（Vendor選択・ステータス遷移・チャットルーム作成）
- [ ] `POST /api/projects/{id}/close` - クローズ（アーカイブ）
- [ ] Pydantic schemas
- [ ] Service層 (`project_service.py`)
- [ ] CRUD層 (`project_crud.py`)

### Tests

#### Unit Tests / ユニットテスト

| Layer | Test File | Mock Target |
|-------|-----------|-------------|
| Routes | `tests/unit/test_routes/test_projects.py` | Service層 |
| Services | `tests/unit/test_services/test_project_service.py` | CRUD層 |
| CRUD | `tests/unit/test_crud/test_project_crud.py` | Supabase client |

- [ ] Routes層テスト（リクエスト/レスポンス検証）
- [ ] Service層テスト（ステータス遷移ロジック検証）
- [ ] CRUD層テスト（DB操作検証）

#### Test Cases / テストケース

| # | Test Case | Layer | Expected |
|---|-----------|-------|----------|
| 1 | プロジェクト作成成功 | Service | status = draft, AIセッション作成 |
| 2 | プロジェクト削除（draft） | Service | is_deleted=true, AIセッションも削除 |
| 3 | プロジェクト削除（in_discussion） | Service | 409 Error |
| 4 | 計画書送信（初回：draft → in_discussion） | Service | ステータス遷移、計画書・Vendor・チャットルーム作成 |
| 5 | 計画書送信（2回目：追加Vendor） | Service | 新規Vendorのみ追加、既存は維持 |
| 6 | in_discussion → closed 遷移 | Service | 成功、closed_at設定 |
| 7 | draft以外からの編集 | Service | 409 Error |
| 8 | 不正なステータス遷移（draft → closed） | Service | Error |
| 9 | 他組織のプロジェクトアクセス | Routes | 403/404 |
| 10 | Vendor一覧取得（検索） | Service | activeなVendorのみ返却 |
| 11 | Vendor側プロジェクト一覧 | Service | 招待されたプロジェクトのみ（in_discussion以降） |
| 12 | プロジェクト一覧（デフォルト） | Service | closed除外 |
| 13 | プロジェクト一覧（status=closed） | Service | closedのみ（アーカイブ一覧） |

---

## 🤖 AIへの指示プロンプト

以下をAI（Claude Code / Cursor）にコピペして実装を依頼してください：

--------------------------------------------------

`docs/tasks/02-01-project-management.md` に基づき Project Management（プロジェクト管理）機能を実装してください。

## 参照ドキュメント
- UC: docs/UC/UC6.md, UC7.md, UC10.md, UC11.md
- DB設計: docs/architecture/database.md
- API定義: docs/architecture/api-endpoints.md
- レイヤー構成: docs/architecture/layers.md

## 実装内容

### 1. Supabase Migration

`projects` テーブル:
- id (UUID, PK)
- buyer_org_id (UUID, FK → organizations.id)
- title (TEXT, NOT NULL)
- description (TEXT, nullable)
- status (TEXT: 'draft' | 'in_discussion' | 'closed', default 'draft')
- started_at (TIMESTAMP, nullable) - In Discussion開始日時
- closed_at (TIMESTAMP, nullable) - 完了日時
- created_by (UUID, FK → profiles.id)
- created_at, updated_at, updated_by, is_deleted

`project_vendors` テーブル:
- id (UUID, PK)
- project_id (UUID, FK → projects.id)
- vendor_org_id (UUID, FK → organizations.id)
- status (TEXT: 'pending' | 'notified' | 'read', default 'pending')
- notified_at (TIMESTAMP, nullable)
- read_at (TIMESTAMP, nullable)
- created_by, created_at, updated_by, updated_at, is_deleted

UNIQUE制約: (project_id, vendor_org_id)

### 2. FastAPI Endpoints

#### GET /api/vendors - Vendor一覧（選択用）
- Query: search?, industry?, page, limit
- Response: { items: Vendor[], total, page, limit }
- Filter: type='vendor', status='active'

#### GET /api/projects - プロジェクト一覧（Buyer/Vendor両対応）
- Query: status?, search?, page?, limit?
- Response: { items: Project[], total, page, limit }
- 各Projectに `has_chat_unread` (boolean)（チャット未読有無）を含む
- **status パラメータ**:
  - 未指定: draft, in_discussion のみ（closedは除外＝アーカイブ）
  - `draft`: draftのみ
  - `in_discussion`: in_discussionのみ
  - `closed`: closedのみ（アーカイブ一覧）
  - `all`: 全ステータス
- **Buyerの場合**: buyer_org_id = 自組織
- **Vendorの場合**: project_vendors に自組織が含まれる（in_discussion以降）

#### POST /api/projects - 新規作成
- Request: { title, description? }
- Response: { project: Project, ai_session: AiChatSession }
- **プロジェクト作成と同時にAIチャットセッションを自動作成**
- buyer_org_id from JWT
- **Buyerのみ**

#### GET /api/projects/{id} - 詳細取得
- Response: Project with vendors
- **Vendor**: project_vendorsに含まれ、かつin_discussion以降の場合のみアクセス可能

#### PUT /api/projects/{id} - 更新
- Request: { title?, description? }
- Only if status='draft'
- **Buyerのみ**

#### DELETE /api/projects/{id} - 削除
- Only if status='draft'
- 論理削除（is_deleted=true）
- 紐づくai_chat_sessionsも論理削除
- **Buyerのみ**

#### POST /api/projects/{id}/send - 計画書送信
- Request: { vendor_org_ids: UUID[], plan: { title, content } }
- Response: { project: Project, plan: Plan, vendors: Vendor[] }
- **処理フロー（RPC推奨）**:
  1. 計画書をSupabase Storageに保存
  2. project_plans INSERT
  3. IF status='draft': projects UPDATE (status='in_discussion', started_at=now)
  4. 新規Vendorを project_vendors INSERT（既存は除く）
  5. project_plan_vendors INSERT（今回の計画書×全対象Vendor）
  6. 新規Vendorの chat_rooms INSERT
- **Buyerのみ**
- 2回目以降の送信でも同じAPIを使用（追加の計画書バージョン送信）

#### POST /api/projects/{id}/close - クローズ
- Transition: in_discussion → closed
- Set closed_at
- **Buyerのみ**
- クローズ後は一覧からデフォルト除外（アーカイブ扱い）

### 3. レイヤー構成
- api/routes/projects.py (Controller)
- api/routes/vendors.py (Controller) - Vendor一覧用
- services/project_service.py (Business Logic)
- crud/project_crud.py (Data Access)
- schemas/project.py (Pydantic models)

### 4. RLSポリシー
- **projects (SELECT)**: buyer_org_id = 自組織 OR 自組織がproject_vendorsに存在
- **projects (INSERT/UPDATE/DELETE)**: buyer_org_id = 自組織
- **project_vendors (SELECT)**: project.buyer_org_id = 自組織 OR vendor_org_id = 自組織
- **project_vendors (INSERT/UPDATE/DELETE)**: project.buyer_org_id = 自組織

## 制約
- ステータス遷移は draft → in_discussion → closed の順のみ
- draft以外は編集・削除不可
- VendorはAIチャットセッションにアクセス不可（プロジェクトと計画書のみ閲覧可）
- 型ヒント必須
- Pydanticでリクエスト/レスポンス定義
- soft delete (is_deleted=true)

## テスト要件
- 各レイヤー（Routes/Services/CRUD）のユニットテストを作成
- Service層は80%以上のカバレッジを目標
- 依存先はモックを使用（実DBアクセス不要）

--------------------------------------------------

---

## ✅ 完了条件

- [ ] マイグレーションファイルが `supabase/migrations/` に存在
- [ ] 全APIエンドポイントが正常に動作
- [ ] **Vendor一覧API**が正常に動作
- [ ] ステータス遷移が正しく機能（draft → in_discussion → closed）
- [ ] **sendで計画書保存・Vendor紐付け・チャットルーム作成が動作**
- [ ] **Vendor側からプロジェクト・計画書閲覧が可能**
- [ ] **プロジェクト一覧でclosedがデフォルト除外**
- [ ] RLSポリシーが正しく機能（Buyer/Vendor両方）
- [ ] ユニットテスト作成（Routes/Services/CRUD）
- [ ] `pytest tests/unit/` がパス
- [ ] Service層カバレッジ 80%以上

---

## 🔗 関連タスク

- 前提: [01-02-backend-onboarding.md](./01-02-backend-onboarding.md) (organizations, profiles テーブル)
- 連携: [02-02-project-plans.md](./02-02-project-plans.md) (計画書テーブル・Storage)
- 連携: [03-01-ai-chat.md](./03-01-ai-chat.md) (プロジェクト作成時にAIセッション自動作成)
- 連携: [03-02-buyer-vendor-chat.md](./03-02-buyer-vendor-chat.md) (sendでチャットルーム作成)
- 連携: [05-01-notifications.md](./05-01-notifications.md) (Vendor通知)

---

## 📝 メモ

- **ChatGPT風UX**: プロジェクト作成と同時にAIチャットセッションを自動作成。ユーザーはすぐにAIとのチャットを開始できる
- **計画書単位のVendor管理**: `project_plan_vendors` で各計画書バージョンをどのVendorに送信したかを管理。計画書v1はVendor A,B、v2はVendor A,Cのような運用が可能
- **close = アーカイブ**: クローズしたプロジェクトは一覧からデフォルト除外。status=closedで明示的に取得可能
- **Vendor一覧API**: Vendor選択時に利用。statusがactiveのVendor組織のみ返却
- **Vendor側プロジェクト一覧**: project_vendors 経由で自組織が招待されたプロジェクトを取得（in_discussion以降のみ）
- **VendorはAIチャット不可**: Vendorはプロジェクトと計画書の閲覧、Buyer-Vendorチャットのみ可能
- **send処理のトランザクション**: 複数テーブル操作のためRPC推奨
- **has_chat_unread**: プロジェクト一覧で各プロジェクトのチャット未読有無を返却（boolean）。画面では未読プロジェクト名を太字表示
