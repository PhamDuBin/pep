"""Authentication endpoints."""

from fastapi import APIRouter, Depends

from app.core.supabase import get_supabase
from app.services.auth import AuthService
from app.schemas.auth import SignupRequest, SignupResponse

router = APIRouter()


def get_auth_service(supabase=Depends(get_supabase)) -> AuthService:
    """Dependency to get AuthService instance."""
    return AuthService(supabase)


@router.post("/signup", response_model=SignupResponse, status_code=201)
async def signup(
    data: SignupRequest,
    service: AuthService = Depends(get_auth_service),
) -> SignupResponse:
    """
    Register a new user (Buyer or Vendor).

    新規ユーザー登録（BuyerまたはVendor）

    ## 処理フロー
    1. Frontendがauth.usersを作成（Supabase Auth）
    2. このエンドポイントにuser_idと登録情報を送信
    3. organizations, profiles, applicationsを作成
    4. 全レコードはpending状態で作成される

    ## エラー時の処理
    - RPC失敗時はauth.usersを削除してロールバック

    ## リクエスト例（Buyer）
    ```json
    {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "org_type": "buyer",
        "company_name": "株式会社サンプル",
        "contact_email": "contact@example.com",
        "display_name": "山田太郎",
        "industry": "製造業",
        "employee_count": "100-500",
        "purpose": "サービス選定のため"
    }
    ```

    ## リクエスト例（Vendor）
    ```json
    {
        "user_id": "550e8400-e29b-41d4-a716-446655440001",
        "org_type": "vendor",
        "company_name": "株式会社ベンダー",
        "contact_email": "contact@vendor.com",
        "display_name": "鈴木花子",
        "industry": "IT・ソフトウェア",
        "employee_count": "50-100",
        "business_description": "クラウドサービスの開発・提供",
        "service_description": "SaaS型業務管理システム",
        "website_url": "https://vendor.example.com"
    }
    ```

    Note: This endpoint does not require authentication.
    認証なしで利用可能なエンドポイントです。
    """
    return await service.signup(data)
