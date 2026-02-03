"""Auth service: get_current_user_info for GET /api/v1/auth/me only."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.auth_crud import AuthCRUD
from app.schemas.auth import UserInfo

# 403 detail codes for login flow (Task 01-08)
ONBOARDING_INCOMPLETE = "ONBOARDING_INCOMPLETE"
ACCOUNT_SUSPENDED = "ACCOUNT_SUSPENDED"
ACCOUNT_INACTIVE = "ACCOUNT_INACTIVE"


class AuthService:
    """Auth business logic: get_current_user_info for /me only."""

    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.crud = AuthCRUD(supabase)

    async def get_current_user_info(
        self, user_id: str, email: Optional[str] = None
    ) -> UserInfo:
        """
        Get current user info for GET /api/v1/auth/me.
        Raises 403 with ONBOARDING_INCOMPLETE / ACCOUNT_SUSPENDED / ACCOUNT_INACTIVE
        when profile or org status does not allow login.

        Args:
            user_id: From JWT (auth.users.id)
            email: From JWT (optional fallback)

        Returns:
            UserInfo with profile + org

        Raises:
            HTTPException 403 with detail code
        """
        profile = self.crud.get_user_profile_with_org(user_id)
        if not profile:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Profile not found or access restricted / プロフィールが見つからないかアクセスが制限されています",
            )
        status = (profile.get("status") or "").strip().lower()
        org_status = (profile.get("org_status") or "").strip().lower()

        if status == "pending":
            raise HTTPException(
                status_code=403,
                detail=ONBOARDING_INCOMPLETE,
            )
        if status == "inactive":
            raise HTTPException(
                status_code=403,
                detail=ACCOUNT_INACTIVE,
            )
        if org_status == "suspended":
            raise HTTPException(
                status_code=403,
                detail=ACCOUNT_SUSPENDED,
            )

        return UserInfo(
            id=str(profile.get("id", user_id)),
            email=profile.get("email") or email or "",
            display_name=(profile.get("display_name") or "").strip() or "—",
            role=(profile.get("role") or "member").strip(),
            org_id=str(profile["org_id"]) if profile.get("org_id") else None,
            org_name=profile.get("org_name"),
            org_type=profile.get("org_type"),
            status=status or "active",
        )
