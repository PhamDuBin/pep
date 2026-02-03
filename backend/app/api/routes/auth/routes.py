"""Auth API: GET /me only (minimal)."""

from fastapi import APIRouter, Depends

from app.core.security import verify_token
from app.core.supabase import get_supabase
from app.services.auth_service import AuthService
from app.schemas.auth import UserInfo

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
