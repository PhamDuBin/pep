"""User CRUD operations."""

from typing import Optional
from supabase import Client

from app.schemas.user import UserProfileUpdate, AvatarUpdate


class UserCRUD:
    """CRUD operations for user profiles."""

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_profile_by_id(self, user_id: str) -> Optional[dict]:
        """
        Get user profile by ID.

        Args:
            user_id: User UUID (= auth.users.id)

        Returns:
            Profile dict or None if not found
        """
        result = (
            self.supabase.table("profiles")
            .select("*")
            .eq("id", user_id)
            .eq("is_deleted", False)
            .single()
            .execute()
        )
        return result.data

    async def update_profile(
        self, user_id: str, data: UserProfileUpdate, updated_by: str
    ) -> Optional[dict]:
        """
        Update user profile.

        Args:
            user_id: User UUID
            data: Fields to update
            updated_by: ID of user making the update

        Returns:
            Updated profile dict
        """
        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_by"] = updated_by
        update_data["updated_at"] = "now()"

        result = (
            self.supabase.table("profiles")
            .update(update_data)
            .eq("id", user_id)
            .eq("is_deleted", False)
            .execute()
        )
        return result.data[0] if result.data else None

    async def update_avatar(
        self, user_id: str, data: AvatarUpdate, updated_by: str
    ) -> Optional[dict]:
        """
        Update user avatar.

        Args:
            user_id: User UUID
            data: Avatar URL and/or color
            updated_by: ID of user making the update

        Returns:
            Updated profile dict
        """
        update_data = data.model_dump(exclude_unset=True)
        update_data["updated_by"] = updated_by
        update_data["updated_at"] = "now()"

        result = (
            self.supabase.table("profiles")
            .update(update_data)
            .eq("id", user_id)
            .eq("is_deleted", False)
            .execute()
        )
        return result.data[0] if result.data else None

    async def get_profile_by_id_and_org(
        self, profile_id: str, org_id: str
    ) -> Optional[dict]:
        """
        Get profile by ID and org_id (for member removal: verify member belongs to org).

        Args:
            profile_id: Profile (user) UUID.
            org_id: Organization UUID.

        Returns:
            Profile dict or None if not found or not in org.
        """
        result = (
            self.supabase.table("profiles")
            .select("*")
            .eq("id", profile_id)
            .eq("org_id", org_id)
            .eq("is_deleted", False)
            .execute()
        )
        return result.data[0] if result.data else None

    async def soft_delete_profile(
        self, profile_id: str, updated_by: str
    ) -> Optional[dict]:
        """
        Soft-delete a profile (set is_deleted=true, deleted_at=now()).

        Args:
            profile_id: Profile UUID to soft-delete.
            updated_by: User ID performing the update (audit).

        Returns:
            Updated profile dict or None if not found or already deleted.
        """
        result = (
            self.supabase.table("profiles")
            .update(
                {
                    "is_deleted": True,
                    "deleted_at": "now()",
                    "updated_by": updated_by,
                    "updated_at": "now()",
                }
            )
            .eq("id", profile_id)
            .eq("is_deleted", False)
            .execute()
        )
        return result.data[0] if result.data else None
