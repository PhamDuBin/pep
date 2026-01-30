"""Organization CRUD operations."""

from datetime import datetime, timezone
from typing import Optional
from supabase import Client


class OrganizationCRUD:
    """CRUD operations for organizations."""

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_by_id(self, org_id: str) -> Optional[dict]:
        """
        Get organization by ID.

        Args:
            org_id: Organization UUID.

        Returns:
            Organization dict or None if not found.
        """
        result = (
            self.supabase.table("organizations")
            .select("*")
            .eq("id", org_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def update_organization_status(
        self, org_id: str, status: str, updated_by: str
    ) -> Optional[dict]:
        """
        Update organization status (e.g. active, suspended).

        Args:
            org_id: Organization UUID.
            status: New status value.
            updated_by: User ID performing the update.

        Returns:
            Updated organization dict or None if not found.
        """
        result = (
            self.supabase.table("organizations")
            .update(
                {
                    "status": status,
                    "updated_by": updated_by,
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                }
            )
            .eq("id", org_id)
            .execute()
        )
        return result.data[0] if result.data else None
