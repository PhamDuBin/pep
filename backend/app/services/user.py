"""User service (business logic)."""

from typing import Optional
from fastapi import HTTPException
from supabase import Client

from app.crud.user import UserCRUD
from app.schemas.user import (
    UserProfile,
    UserProfileUpdate,
    AvatarUpdate,
    AvatarColor,
)


# Predefined avatar colors
AVATAR_COLORS = [
    AvatarColor(id="1", color="#8ec5d0", border_color="#6ba3ad"),
    AvatarColor(id="2", color="#a8d5ba", border_color="#86b398"),
    AvatarColor(id="3", color="#f5c6aa", border_color="#d3a488"),
    AvatarColor(id="4", color="#c5b8d6", border_color="#a396b4"),
    AvatarColor(id="5", color="#f5aab9", border_color="#d38897"),
    AvatarColor(id="6", color="#ffd699", border_color="#ddb477"),
]


class UserService:
    """User profile business logic."""

    def __init__(self, supabase: Client):
        self.crud = UserCRUD(supabase)
        self.supabase = supabase

    async def get_profile(self, user_id: str) -> UserProfile:
        """
        Get user profile.

        Args:
            user_id: Current user ID

        Returns:
            UserProfile

        Raises:
            HTTPException: If profile not found
        """
        profile = await self.crud.get_profile_by_id(user_id)
        if not profile:
            raise HTTPException(status_code=404, detail="Profile not found")

        return UserProfile(**profile)

    async def update_profile(
        self, user_id: str, data: UserProfileUpdate
    ) -> UserProfile:
        """
        Update user profile.

        Args:
            user_id: Current user ID
            data: Fields to update

        Returns:
            Updated UserProfile
        """
        updated = await self.crud.update_profile(user_id, data, updated_by=user_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Profile not found")

        return UserProfile(**updated)

    async def update_avatar(self, user_id: str, data: AvatarUpdate) -> UserProfile:
        """
        Update user avatar.

        Args:
            user_id: Current user ID
            data: Avatar URL and/or color

        Returns:
            Updated UserProfile
        """
        # Validate color if provided
        if data.avatar_color:
            valid_colors = [c.color for c in AVATAR_COLORS]
            if data.avatar_color not in valid_colors:
                raise HTTPException(status_code=400, detail="Invalid avatar color")

        updated = await self.crud.update_avatar(user_id, data, updated_by=user_id)
        if not updated:
            raise HTTPException(status_code=404, detail="Profile not found")

        return UserProfile(**updated)

    async def change_password(
        self, user_id: str, current_password: str, new_password: str
    ) -> bool:
        """
        Change user password via Supabase Auth.

        Args:
            user_id: Current user ID (for logging)
            current_password: Current password for verification
            new_password: New password

        Returns:
            True if successful

        Raises:
            HTTPException: If password change fails
        """
        # Note: Password change is handled by Supabase Auth API
        # This requires the user's access token, which should be passed from frontend
        # The actual implementation depends on how frontend handles this
        raise HTTPException(
            status_code=501,
            detail="Password change should be handled via Supabase Auth directly",
        )

    async def request_email_change(self, user_id: str, new_email: str) -> bool:
        """
        Request email change via Supabase Auth.

        Args:
            user_id: Current user ID
            new_email: New email address

        Returns:
            True if request sent successfully

        Raises:
            HTTPException: If request fails
        """
        # Note: Email change is handled by Supabase Auth API
        # This sends a confirmation email to the new address
        raise HTTPException(
            status_code=501,
            detail="Email change should be handled via Supabase Auth directly",
        )

    def get_avatar_colors(self) -> list[AvatarColor]:
        """
        Get available avatar colors.

        Returns:
            List of AvatarColor options
        """
        return AVATAR_COLORS
