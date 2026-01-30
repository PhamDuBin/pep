"""Security utilities for JWT verification."""

from typing import Optional
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import httpx

from app.core.config import get_settings

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
                raise HTTPException(
                    status_code=401,
                    detail="Invalid or expired token",
                )

            return response.json()

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
