"""Auth CRUD: profile + organization for GET /api/v1/auth/me."""

from typing import Optional
from supabase import Client


class AuthCRUD:
    """CRUD for /auth/me: get user profile with organization info."""

    def __init__(self, supabase: Client):
        self.supabase = supabase

    def get_user_profile_with_org(self, user_id: str) -> Optional[dict]:
        """
        Get user profile by ID with organization name and type.
        Excludes soft-deleted profiles.

        Args:
            user_id: User UUID (= auth.users.id)

        Returns:
            Dict with profile fields plus org_name, org_type, org_status,
            or None if profile not found.
        """
        profile_result = (
            self.supabase.table("profiles")
            .select("id, email, display_name, role, status, org_id")
            .eq("id", user_id)
            .eq("is_deleted", False)
            .execute()
        )
        rows = profile_result.data or []
        if not rows:
            return None
        profile = dict(rows[0])
        org_id = profile.get("org_id")
        if org_id:
            org_result = (
                self.supabase.table("organizations")
                .select("name, type, status")
                .eq("id", org_id)
                .execute()
            )
            org_rows = org_result.data or []
            if org_rows:
                profile["org_name"] = org_rows[0].get("name")
                profile["org_type"] = org_rows[0].get("type")
                profile["org_status"] = org_rows[0].get("status")
            else:
                profile["org_name"] = None
                profile["org_type"] = None
                profile["org_status"] = None
        else:
            profile["org_name"] = None
            profile["org_type"] = None
            profile["org_status"] = None
        return profile
