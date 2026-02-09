"""Security utilities for JWT verification."""

import base64
import json
import logging
from typing import Optional
from fastapi import Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx
from supabase import Client

from app.core.config import get_settings
from app.core.supabase import get_supabase

logger = logging.getLogger(__name__)
security = HTTPBearer()

# -----------------------------------------------------------------------------
# Internal: load profile and enforce not soft-deleted (single place for 403 msg)
# -----------------------------------------------------------------------------


def _load_profile_not_deleted(
    supabase: Client, user_id: str, columns: str = "id,is_deleted,org_id"
) -> dict:
    """
    Load profile by user_id; raise 403 if not found or soft-deleted.

    Returns profile row dict. Used by get_current_user, get_current_user_for_onboarding,
    get_current_platform_admin, get_current_org_owner_or_admin.
    """
    result = (
        supabase.table("profiles")
        .select(columns)
        .eq("id", user_id)
        .execute()
    )
    rows = result.data or []
    if not rows:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Profile not found or access restricted / プロフィールが見つからないかアクセスが制限されています",
        )
    profile = rows[0]
    if profile.get("is_deleted"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Account removed or suspended / アカウントは削除または停止されています",
        )
    return profile


async def verify_token(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> dict:
    """
    Verify Supabase JWT token.

    Args:
        credentials: Bearer token from Authorization header

    Returns:
        Decoded user information from token

    Raises:
        HTTPException: If token is invalid or expired
    """
    settings = get_settings()
    token = credentials.credentials

    try:
        # Verify token with Supabase
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.supabase_url}/auth/v1/user",
                headers={
                    "Authorization": f"Bearer {token}",
                    "apikey": settings.supabase_anon_key,
                },
            )

            if response.status_code != 200:
                sub = None
                try:
                    payload_b64 = token.split(".")[1]
                    payload = json.loads(base64.urlsafe_b64decode(payload_b64 + "=="))
                    sub = payload.get("sub")
                except Exception:
                    pass
                logger.warning(
                    "JWT rejected by Supabase. status=%s body=%s sub=%s",
                    response.status_code,
                    response.text,
                    sub,
                )
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired token",
                )

            user = response.json()
            logger.info("Authenticated user_id=%s", user.get("id"))
            return user

    except httpx.RequestError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Authentication service unavailable: {str(e)}",
        )


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """
    Get current authenticated user.

    Enforces access restriction (Task 005): returns 403 if profile is
    soft-deleted or organization is not active (suspended/pending/inactive).
    """
    user = await verify_token(credentials)
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / 権限がありません",
        )
    profile = _load_profile_not_deleted(supabase, user_id, "id,is_deleted,org_id,role")
    org_id = profile.get("org_id")
    if not org_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / No organization / 組織に所属していません",
        )
    org_result = (
        supabase.table("organizations")
        .select("id, status")
        .eq("id", org_id)
        .execute()
    )
    org_rows = org_result.data or []
    if not org_rows or org_rows[0].get("status") != "active":
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization is not active / 組織は停止中または未承認です",
        )
    return {
        **user,
        "org_id": str(org_id),
        "role": profile.get("role") or "member",
    }


async def get_current_user_for_onboarding(
    credentials: HTTPAuthorizationCredentials = Security(security),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """
    Get current authenticated user for onboarding endpoints.

    Unlike get_current_user, this does NOT check org_id or org status,
    because onboarding users have org_id=NULL until onboarding completes.
    Only verifies JWT and that profile exists and is not soft-deleted.

    オンボーディングエンドポイント用の認証。
    get_current_userと異なり、org_id/org statusはチェックしない。
    オンボーディングユーザーはorg_id=NULLのため。
    """
    user = await verify_token(credentials)
    user_id = user.get("id")
    if not user_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / 権限がありません",
        )
    _load_profile_not_deleted(supabase, user_id, "id,is_deleted")
    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(
        HTTPBearer(auto_error=False)
    ),
    supabase: Client = Depends(get_supabase),
) -> Optional[dict]:
    """
    Get current user if authenticated and profile not soft-deleted, None otherwise.

    Returns None when no token, invalid token, or profile is soft-deleted.
    Useful for endpoints that work with or without valid authentication.
    """
    if credentials is None:
        return None
    try:
        user = await verify_token(credentials)
    except HTTPException:
        return None
    user_id = user.get("id")
    if not user_id:
        return None
    try:
        _load_profile_not_deleted(supabase, user_id, "id,is_deleted")
    except HTTPException:
        return None
    return user


async def get_current_platform_admin(
    credentials: HTTPAuthorizationCredentials = Security(security),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """
    Require current user to be a Platform Admin.

    Used by admin-only routes (e.g. application approval, suspend/reactivate).
    Does NOT enforce org status so platform admins can access admin APIs
    even when their organization is suspended.
    """
    user = await verify_token(credentials)
    if not user or not user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / 権限がありません",
        )
    profile = _load_profile_not_deleted(
        supabase, user["id"], "id,is_deleted,is_platform_admin"
    )
    if not profile.get("is_platform_admin"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Platform Admin only / プラットフォーム管理者のみ利用可能",
        )
    return user


async def get_current_org_owner_or_admin(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """
    Require current user to be owner or admin of their organization.

    Used by invitation routes (create / list / cancel). Returns 403 if
    the user has no profile or role is not owner/admin.
    Returns dict with user id, org_id, role for use in routes.
    """
    if not current_user or not current_user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / 権限がありません",
        )
    profile = _load_profile_not_deleted(
        supabase, current_user["id"], "id,is_deleted,org_id,role"
    )
    role = profile.get("role")
    org_id = profile.get("org_id")
    if role not in ("owner", "admin"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Owner or Admin only / オーナーまたは管理者のみ利用可能",
        )
    if not org_id:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / No organization / 組織に所属していません",
        )
    return {
        "id": current_user["id"],
        "org_id": str(org_id),
        "role": role,
    }
