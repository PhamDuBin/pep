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
) -> dict:
    """
    Get current authenticated user.

    This is a dependency that can be used in route handlers.
    """
    return await verify_token(credentials)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(
        HTTPBearer(auto_error=False)
    ),
) -> Optional[dict]:
    """
    Get current user if authenticated, None otherwise.

    This is useful for endpoints that work with or without authentication.
    """
    if credentials is None:
        return None
    return await verify_token(credentials)


async def get_current_platform_admin(
    current_user: dict = Depends(get_current_user),
    supabase: Client = Depends(get_supabase),
) -> dict:
    """
    Require current user to be a Platform Admin.

    Used by admin-only routes (e.g. application approval). Returns 403 if
    the user has no profile or is_platform_admin is not True.
    """
    if not current_user or not current_user.get("id"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / 権限がありません",
        )
    result = (
        supabase.table("profiles")
        .select("is_platform_admin")
        .eq("id", current_user["id"])
        .eq("is_deleted", False)
        .execute()
    )
    rows = result.data or []
    if not rows or not rows[0].get("is_platform_admin"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Platform Admin only / プラットフォーム管理者のみ利用可能",
        )
    return current_user


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
    result = (
        supabase.table("profiles")
        .select("org_id, role")
        .eq("id", current_user["id"])
        .eq("is_deleted", False)
        .execute()
    )
    rows = result.data or []
    if not rows:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Profile not found / プロフィールが見つかりません",
        )
    row = rows[0]
    role = row.get("role")
    org_id = row.get("org_id")
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
