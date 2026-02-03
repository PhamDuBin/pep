"""Auth API: GET /me, POST /refresh, password-reset (Task 01-08)."""

from fastapi import APIRouter, Depends

from app.core.security import verify_token
from app.core.supabase import get_supabase
from app.services.auth_service import AuthService
from app.schemas.auth import (
    UserInfo,
    LoginResponse,
    RefreshRequest,
    PasswordResetRequest,
    PasswordResetConfirm,
    PasswordResetMessage,
)

router = APIRouter()


def get_auth_service(supabase=Depends(get_supabase)) -> AuthService:
    """Dependency to get AuthService instance."""
    return AuthService(supabase)


@router.get("/me", response_model=UserInfo)
async def get_me(
    user: dict = Depends(verify_token),
    service: AuthService = Depends(get_auth_service),
) -> UserInfo:
    """
    Get current user info (for login flow).

    Returns full user info with org. Raises 403 with ONBOARDING_INCOMPLETE,
    ACCOUNT_SUSPENDED, or ACCOUNT_INACTIVE when profile/org status does not allow login.
    """
    return await service.get_current_user_info(
        user_id=user.get("id", ""),
        email=user.get("email"),
    )


@router.post("/refresh", response_model=LoginResponse)
async def refresh(
    body: RefreshRequest,
    service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    """Exchange refresh_token for new access_token and refresh_token."""
    return await service.refresh_tokens(body.refresh_token)


@router.post("/password-reset-request", response_model=PasswordResetMessage)
async def password_reset_request(
    body: PasswordResetRequest,
    service: AuthService = Depends(get_auth_service),
) -> PasswordResetMessage:
    """
    Request password reset email (unauthenticated).
    Always returns success message for security (do not reveal if email exists).
    """
    return await service.password_reset_request(body.email)


@router.post("/password-reset-confirm", response_model=PasswordResetMessage)
async def password_reset_confirm(
    body: PasswordResetConfirm,
    service: AuthService = Depends(get_auth_service),
) -> PasswordResetMessage:
    """Confirm password reset with token from email link and new password."""
    return await service.password_reset_confirm(body.token, body.new_password)
