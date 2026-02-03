"""Auth service: get_current_user_info, refresh_tokens, password_reset (Task 01-08)."""

import logging
from typing import Optional

import httpx
from fastapi import HTTPException
from supabase import Client

from app.core.config import get_settings
from app.crud.auth_crud import AuthCRUD
from app.schemas.auth import (
    UserInfo,
    LoginResponse,
    PasswordResetMessage,
)

logger = logging.getLogger(__name__)

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
        if status == "suspended":
            raise HTTPException(
                status_code=403,
                detail=ACCOUNT_SUSPENDED,
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

    async def refresh_tokens(self, refresh_token: str) -> LoginResponse:
        """
        Exchange refresh_token for new access_token and refresh_token via Supabase.

        Raises:
            HTTPException 401 if refresh fails
        """
        settings = get_settings()
        url = f"{settings.supabase_url}/auth/v1/token?grant_type=refresh_token"
        headers = {
            "apikey": settings.supabase_anon_key,
            "Content-Type": "application/json",
        }
        body = {"refresh_token": refresh_token}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.post(url, json=body, headers=headers)
        except httpx.RequestError as e:
            logger.warning("Auth refresh request failed: %s", e)
            raise HTTPException(
                status_code=503,
                detail="Authentication service unavailable",
            ) from e
        if resp.status_code != 200:
            logger.warning("Auth refresh rejected: %s %s", resp.status_code, resp.text)
            raise HTTPException(
                status_code=401,
                detail="Invalid or expired refresh token",
            )
        data = resp.json()
        return LoginResponse(
            access_token=data.get("access_token", ""),
            refresh_token=data.get("refresh_token", ""),
            expires_in=int(data.get("expires_in", 3600)),
        )

    async def password_reset_request(self, email: str) -> PasswordResetMessage:
        """
        Send password reset email via Supabase. Does not reveal whether email exists.

        Returns:
            Success message always (for security)
        """
        settings = get_settings()
        url = f"{settings.supabase_url}/auth/v1/recover"
        headers = {
            "apikey": settings.supabase_anon_key,
            "Content-Type": "application/json",
        }
        redirect_to = f"{settings.frontend_url.rstrip('/')}/auth/reset-password"
        body = {"email": email, "redirect_to": redirect_to}
        logger.info("Password reset redirect_to: %s", redirect_to)
        try:
            async with httpx.AsyncClient() as client:
                await client.post(url, json=body, headers=headers)
        except httpx.RequestError as e:
            logger.warning("Password reset request failed: %s", e)
        return PasswordResetMessage(
            message="パスワードリセットメールを送信しました。"
        )

    async def password_reset_confirm(
        self, access_token: str, new_password: str
    ) -> PasswordResetMessage:
        """
        Update user password using recovery access_token (from reset link).

        Raises:
            HTTPException 400 if token invalid or update fails
        """
        settings = get_settings()
        url = f"{settings.supabase_url}/auth/v1/user"
        headers = {
            "apikey": settings.supabase_anon_key,
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
        body = {"password": new_password}
        try:
            async with httpx.AsyncClient() as client:
                resp = await client.put(url, json=body, headers=headers)
        except httpx.RequestError as e:
            logger.warning("Password reset confirm request failed: %s", e)
            raise HTTPException(
                status_code=503,
                detail="Authentication service unavailable",
            ) from e
        if resp.status_code != 200:
            logger.warning(
                "Password reset confirm rejected: %s %s", resp.status_code, resp.text
            )
            raise HTTPException(
                status_code=400,
                detail="Invalid or expired reset token / 無効または期限切れのトークンです",
            )
        return PasswordResetMessage(
            message="パスワードをリセットしました。"
        )
