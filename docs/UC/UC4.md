# UC04: Buyer Login/Logout / Buyerのログイン・ログアウト

```mermaid
sequenceDiagram
    autonumber
    actor BU as BuyerUser
    participant BWeb as Buyer PEP Web<br/>(Login Screen / ログイン画面)
    participant API as PEP API<br/>(Backend / バックエンド)
    participant DB as PEP DB

    rect rgb(240, 248, 255)
        Note over BU, DB: Display login screen / ログイン画面表示
        BU->>BWeb: Open /login / /login を開く
        BWeb-->>BU: Display email/password form / メールアドレス/パスワード入力フォーム表示
    end

    rect rgb(240, 248, 255)
        Note over BU, DB: Authentication request / 認証リクエスト
        BU->>BWeb: Enter email/password / メール/パスワード入力<br/>→ Click "Login" / 「ログイン」押下
        BWeb->>API: POST /login<br/>(email, password)
    end

    rect rgb(240, 248, 255)
        Note over API, DB: Check user, org & contract status / ユーザ・組織・契約状態の確認
        API->>DB: Get user / ユーザ取得<br/>(by email address / メールアドレス)
        DB-->>API: User info / ユーザ情報
    end

    alt User does not exist / ユーザが存在しない
        API-->>BWeb: Auth error / 認証エラー<br/>"Invalid email or password" / 「メールアドレスまたはパスワードが違います」
        BWeb-->>BU: Display error message / エラーメッセージ表示
    else User exists / ユーザが存在する
        API->>API: Verify password hash / パスワードハッシュ検証

        alt Password mismatch / パスワード不一致
            API-->>BWeb: Auth error / 認証エラー<br/>"Invalid email or password" / 「メールアドレスまたはパスワードが違います」
            BWeb-->>BU: Display error message / エラーメッセージ表示
        else Password match / パスワード一致
            API->>DB: Get org & contract info / 組織情報・契約状態取得<br/>(org_status, billing_status etc.)
            DB-->>API: Org & contract info / 組織・契約情報

            alt User status not Active / ユーザ状態が Active でない
                API-->>BWeb: Login denied / ログイン不可応答<br/>"Account is disabled" / 「アカウントが無効です」
                BWeb-->>BU: Display error message / エラーメッセージ表示
            else Org not Active (suspended/pending etc.) / 組織が Active でない（停止/審査中など）
                API-->>BWeb: Login denied / ログイン不可応答<br/>"Organization is suspended" / 「組織が利用停止中です」
                BWeb-->>BU: Display error message / エラーメッセージ表示
            else Buyer contract unsubscribed or expired / Buyer契約が未契約 or 失効
                API-->>BWeb: Login denied / ログイン不可応答<br/>"Subscription required" / 「ご利用には契約が必要です」
                BWeb-->>BU: Display error message / エラーメッセージ表示
            else All OK (User Active/Org Active/Contract Active) / すべてOK（ユーザActive/組織Active/契約Active）
                rect rgb(240, 255, 240)
                    Note over API, DB: Issue session / セッション発行
                    API->>API: Issue session token/JWT / セッショントークン/JWT発行
                end
                API-->>BWeb: Login success response / ログイン成功レスポンス<br/>(token, user info / トークン, ユーザ情報)
                BWeb-->>BU: Redirect to Buyer dashboard / Buyerダッシュボードへリダイレクト
            end
        end
    end

    rect rgb(248, 248, 248)
        Note over BU, DB: Post-login operations (overview) / ログイン後の画面操作（概要）
        BU->>BWeb: Navigate project list etc. / プロジェクト一覧などを操作
        BWeb->>API: Authorized API call / 認可付きAPIコール<br/>(Authorization header with token / Authorizationヘッダにトークン)
        API->>DB: Get required data / 必要なデータ取得
        DB-->>API: Data / データ
        API-->>BWeb: Return data / データ返却
        BWeb-->>BU: Update screen / 画面表示更新
    end

    rect rgb(255, 250, 240)
        Note over BU, DB: Logout / ログアウト
        BU->>BWeb: Click "Logout" / 「ログアウト」押下
        BWeb->>API: POST /logout<br/>(token invalidation request / トークン破棄要求)
        API->>API: Invalidate server session / サーバ側セッション無効化<br/>(if needed / 必要に応じて)
        API-->>BWeb: Logout success response / ログアウト成功レスポンス
        BWeb-->>BU: Navigate to login screen / ログイン画面へ遷移
    end
```
