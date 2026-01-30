"""Authentication CRUD operations."""

from typing import Optional

from supabase import Client

from app.schemas.auth import SignupRequest


class AuthCRUD:
    """
    CRUD operations for authentication.

    DB操作のみを担当。ビジネスロジックはService層で行う。
    """

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def call_create_signup_rpc(
        self,
        data: SignupRequest,
    ) -> Optional[dict]:
        """
        Call create_signup RPC to create organization, profile, and application.

        create_signup RPCを呼び出して、組織・プロフィール・申請を作成。
        トランザクション処理はRPC内で行われる。

        Args:
            data: Signup request data

        Returns:
            Dict with organization_id, profile_id, application_id

        Raises:
            Exception: If RPC fails
        """
        result = self.supabase.rpc(
            "create_signup",
            {
                "p_user_id": data.user_id,
                "p_org_type": data.org_type,
                "p_company_name": data.company_name,
                "p_contact_email": data.contact_email,
                "p_display_name": data.display_name,
                "p_industry": data.industry,
                "p_employee_count": data.employee_count,
                # Buyer only
                "p_purpose": data.purpose,
                # Vendor only
                "p_business_description": data.business_description,
                "p_service_description": data.service_description,
                "p_website_url": data.website_url,
            },
        ).execute()

        return result.data

    async def delete_auth_user(self, user_id: str) -> bool:
        """
        Delete auth user for cleanup when signup fails.

        サインアップ失敗時のクリーンアップ用。
        auth.usersからユーザーを削除する。

        Args:
            user_id: User ID to delete

        Returns:
            True if deleted successfully
        """
        try:
            # Use admin API to delete auth user
            self.supabase.auth.admin.delete_user(user_id)
            return True
        except Exception:
            # Log error but don't raise - cleanup is best effort
            return False

    async def check_email_exists(self, email: str) -> bool:
        """
        Check if email already exists in profiles.

        profilesテーブルにメールアドレスが存在するか確認。
        profileはsignup RPC内でのみ作成されるため、
        profileの存在 = signup完了を意味する。

        Args:
            email: Email address to check

        Returns:
            True if email exists in profiles
        """
        result = (
            self.supabase.table("profiles")
            .select("id")
            .eq("email", email)
            .eq("is_deleted", False)
            .limit(1)
            .execute()
        )
        return len(result.data) > 0
