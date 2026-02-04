"""Organization CRUD operations."""

from datetime import datetime, timezone
from typing import Any, Optional
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

    # --- Organization settings (Task 01-10) ---

    async def update_by_id(
        self, org_id: str, payload: dict[str, Any], updated_by: str
    ) -> Optional[dict]:
        """
        Update organization by ID (name, billing_email only).

        Args:
            org_id: Organization UUID.
            payload: Dict with name and/or billing_email.
            updated_by: User ID performing the update.

        Returns:
            Updated organization dict or None if not found.
        """
        allowed = {"name", "billing_email"}
        update_data = {k: v for k, v in payload.items() if k in allowed and v is not None}
        if not update_data:
            return await self.get_by_id(org_id)
        update_data["updated_by"] = updated_by
        update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
        result = (
            self.supabase.table("organizations")
            .update(update_data)
            .eq("id", org_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def get_buyer_details(self, org_id: str) -> Optional[dict]:
        """Get buyer_org_details by org_id."""
        result = (
            self.supabase.table("buyer_org_details")
            .select("*")
            .eq("org_id", org_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def get_vendor_details(self, org_id: str) -> Optional[dict]:
        """Get vendor_org_details by org_id."""
        result = (
            self.supabase.table("vendor_org_details")
            .select("*")
            .eq("org_id", org_id)
            .execute()
        )
        return result.data[0] if result.data else None

    async def upsert_buyer_details(
        self, org_id: str, payload: dict[str, Any], updated_by: str
    ) -> dict:
        """
        Insert or update buyer_org_details.

        Payload may include: industry, employee_count, purpose.
        """
        now = datetime.now(timezone.utc).isoformat()
        allowed = {"industry", "employee_count", "purpose"}
        update_data = {k: v for k, v in payload.items() if k in allowed}
        update_data["updated_by"] = updated_by
        update_data["updated_at"] = now

        existing = await self.get_buyer_details(org_id)
        if existing:
            result = (
                self.supabase.table("buyer_org_details")
                .update(update_data)
                .eq("org_id", org_id)
                .execute()
            )
            return result.data[0] if result.data else existing

        insert_data = {"org_id": org_id, "created_by": updated_by, **update_data}
        result = self.supabase.table("buyer_org_details").insert(insert_data).execute()
        return result.data[0] if result.data else insert_data

    async def upsert_vendor_details(
        self, org_id: str, payload: dict[str, Any], updated_by: str
    ) -> dict:
        """
        Insert or update vendor_org_details.

        Payload may include: industry, employee_count, business_description,
        service_description, website_url.
        """
        now = datetime.now(timezone.utc).isoformat()
        allowed = {
            "industry",
            "employee_count",
            "business_description",
            "service_description",
            "website_url",
        }
        update_data = {k: v for k, v in payload.items() if k in allowed}
        update_data["updated_by"] = updated_by
        update_data["updated_at"] = now

        existing = await self.get_vendor_details(org_id)
        if existing:
            result = (
                self.supabase.table("vendor_org_details")
                .update(update_data)
                .eq("org_id", org_id)
                .execute()
            )
            return result.data[0] if result.data else existing

        insert_data = {"org_id": org_id, "created_by": updated_by, **update_data}
        result = self.supabase.table("vendor_org_details").insert(insert_data).execute()
        return result.data[0] if result.data else insert_data
