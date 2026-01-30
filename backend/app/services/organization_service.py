"""Organization service (admin suspend/reactivate business logic)."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.organization_crud import OrganizationCRUD
from app.schemas.organization import OrganizationStatusResponse


class OrganizationService:
    """
    Organization service for admin suspend/reactivate.

    Business logic: lookup org, update status, return response.
    """

    def __init__(self, supabase: Client):
        self.crud = OrganizationCRUD(supabase)
        self.supabase = supabase

    async def suspend_organization(
        self, org_id: str, admin_id: str, reason: Optional[str] = None
    ) -> OrganizationStatusResponse:
        """
        Suspend an organization (set status to suspended).

        Args:
            org_id: Organization UUID.
            admin_id: Platform admin user ID (audit).
            reason: Optional reason for suspension (not persisted in this implementation).

        Returns:
            OrganizationStatusResponse with id and status.

        Raises:
            HTTPException: 404 if organization not found.
        """
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )
        updated = await self.crud.update_organization_status(
            org_id, "suspended", admin_id
        )
        if not updated:
            raise HTTPException(
                status_code=500,
                detail="Suspend failed / 停止処理に失敗しました",
            )
        return OrganizationStatusResponse.model_validate(updated)

    async def reactivate_organization(
        self, org_id: str, admin_id: str
    ) -> OrganizationStatusResponse:
        """
        Reactivate an organization (set status to active).

        Args:
            org_id: Organization UUID.
            admin_id: Platform admin user ID (audit).

        Returns:
            OrganizationStatusResponse with id and status.

        Raises:
            HTTPException: 404 if organization not found.
        """
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )
        updated = await self.crud.update_organization_status(
            org_id, "active", admin_id
        )
        if not updated:
            raise HTTPException(
                status_code=500,
                detail="Reactivate failed / 再開処理に失敗しました",
            )
        return OrganizationStatusResponse.model_validate(updated)
