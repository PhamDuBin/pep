"""User profile endpoints."""

from fastapi import APIRouter, Depends

from app.core.supabase import get_supabase
from app.core.security import get_current_user
from app.services.user import UserService
from app.schemas.user import (
    UserProfile,
    UserProfileUpdate,
    AvatarUpdate,
    AvatarColor,
)

router = APIRouter()


def get_user_service(supabase=Depends(get_supabase)) -> UserService:
    """Dependency to get UserService instance."""
    return UserService(supabase)


@router.get("/profile", response_model=UserProfile)
async def get_profile(
    current_user: dict = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserProfile:
    """
    Get current user's profile.

    現在のユーザーのプロフィールを取得
    """
    return await service.get_profile(current_user["id"])


@router.put("/profile", response_model=UserProfile)
async def update_profile(
    data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserProfile:
    """
    Update current user's profile.

    現在のユーザーのプロフィールを更新
    """
    return await service.update_profile(current_user["id"], data)


@router.put("/avatar", response_model=UserProfile)
async def update_avatar(
    data: AvatarUpdate,
    current_user: dict = Depends(get_current_user),
    service: UserService = Depends(get_user_service),
) -> UserProfile:
    """
    Update current user's avatar.

    現在のユーザーのアバターを更新
    """
    return await service.update_avatar(current_user["id"], data)


@router.get("/avatar-colors", response_model=list[AvatarColor])
async def get_avatar_colors(
    service: UserService = Depends(get_user_service),
) -> list[AvatarColor]:
    """
    Get available avatar colors.

    利用可能なアバター色の一覧を取得
    """
    return service.get_avatar_colors()
