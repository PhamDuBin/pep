"""Authentication service (business logic)."""

from fastapi import HTTPException
from supabase import Client

from app.crud.auth import AuthCRUD
from app.schemas.auth import SignupRequest, SignupResponse


class AuthService:
    """
    Authentication service.

    ビジネスロジックとエラーハンドリングを担当。
    """

    def __init__(self, supabase: Client):
        self.crud = AuthCRUD(supabase)
        self.supabase = supabase

    async def signup(self, data: SignupRequest) -> SignupResponse:
        """
        Process user signup.

        新規ユーザー登録を処理する。

        Flow:
        1. メールアドレスの重複チェック
        2. create_signup RPC呼び出し（組織・プロフィール・申請を作成）
        3. エラー時はauth.usersを削除してロールバック

        Args:
            data: Signup request data

        Returns:
            SignupResponse with created IDs

        Raises:
            HTTPException: If signup fails
        """
        # 1. Check if email already exists
        email_exists = await self.crud.check_email_exists(data.contact_email)
        if email_exists:
            raise HTTPException(
                status_code=409,
                detail="このメールアドレスは既に登録されています / Email already registered",
            )

        # 2. Call create_signup RPC
        try:
            result = await self.crud.call_create_signup_rpc(data)

            if not result:
                raise HTTPException(
                    status_code=500,
                    detail="サインアップに失敗しました / Signup failed",
                )

            return SignupResponse(
                organization_id=str(result["organization_id"]),
                profile_id=str(result["profile_id"]),
                application_id=str(result["application_id"]),
            )

        except HTTPException:
            # Re-raise HTTP exceptions
            raise

        except Exception as e:
            # 3. Cleanup: Delete auth user if RPC fails
            await self.crud.delete_auth_user(data.user_id)

            raise HTTPException(
                status_code=400,
                detail=f"サインアップに失敗しました: {str(e)} / Signup failed: {str(e)}",
            )
