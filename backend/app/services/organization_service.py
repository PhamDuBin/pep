"""Organization service (admin suspend/reactivate and organization settings)."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.organization_crud import OrganizationCRUD
from app.schemas.organization import (
    OrgDetailsResponse,
    OrgDetailsUpdateRequest,
    OrganizationResponse,
    OrganizationStatusResponse,
    OrganizationUpdateRequest,
)


class OrganizationService:
    """
    Organization service for admin suspend/reactivate and organization settings.

    Business logic: lookup org, update status/info, permission check.
    """

    def __init__(self, supabase: Client):
        self.crud = OrganizationCRUD(supabase)
        self.supabase = supabase

    # --- Admin suspend/reactivate (existing) ---

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

    # --- Organization settings (Task 01-10) ---

    def check_permission(
        self, user_role: str, user_org_id: str, org_id: str
    ) -> None:
        """
        Ensure user is owner/admin and targets own organization. Document: check_permission().

        Raises:
            HTTPException: 403 if not owner/admin or org mismatch.
        """
        if user_role not in ("owner", "admin"):
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Owner or admin only / オーナーまたは管理者のみ",
            )
        if org_id != user_org_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Organization mismatch / 組織が一致しません",
            )

    async def get_organization(
        self, org_id: str, user_org_id: str
    ) -> OrganizationResponse:
        """
        Get organization info with industry/employee_count from details.

        Args:
            org_id: Target organization UUID.
            user_org_id: User's organization UUID (for permission check).

        Returns:
            OrganizationResponse with merged details.

        Raises:
            HTTPException: 403 if org mismatch, 404 if not found.
        """
        if org_id != user_org_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Organization mismatch / 組織が一致しません",
            )
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )

        industry: Optional[str] = None
        employee_count: Optional[str] = None
        org_type = org.get("type") or ""

        if org_type == "buyer":
            details = await self.crud.get_buyer_details(org_id)
            if details:
                industry = details.get("industry")
                employee_count = details.get("employee_count")
        elif org_type == "vendor":
            details = await self.crud.get_vendor_details(org_id)
            if details:
                industry = details.get("industry")
                employee_count = details.get("employee_count")

        return OrganizationResponse.model_validate({
            **org,
            "industry": industry,
            "employee_count": employee_count,
        })

    async def update_organization(
        self,
        org_id: str,
        user_id: str,
        user_org_id: str,
        user_role: str,
        body: OrganizationUpdateRequest,
    ) -> OrganizationResponse:
        """
        Update organization (owner/admin only).

        Args:
            org_id: Target organization UUID.
            user_id: User UUID (for audit).
            user_org_id: User's organization UUID (for permission check).
            user_role: User's role (owner/admin/member).
            body: Update request with name, industry, employee_count, billing_email.

        Returns:
            Updated OrganizationResponse.

        Raises:
            HTTPException: 403 if not owner/admin or org mismatch, 404 if not found.
        """
        self.check_permission(user_role, user_org_id, org_id)
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )

        # Update organizations table (name, billing_email)
        await self.crud.update_by_id(
            org_id,
            {"name": body.name, "billing_email": body.billing_email},
            user_id,
        )

        # Update details table (industry, employee_count)
        org_type = org.get("type") or ""
        details_payload: dict = {}
        if body.industry is not None:
            details_payload["industry"] = body.industry
        if body.employee_count is not None:
            details_payload["employee_count"] = body.employee_count

        if details_payload and org_type in ("buyer", "vendor"):
            await self.crud.update_details(org_id, org_type, details_payload, user_id)

        return await self.get_organization(org_id, user_org_id)

    async def get_org_details(
        self, org_id: str, user_org_id: str
    ) -> OrgDetailsResponse:
        """
        Get organization details (Buyer: purpose / Vendor: business_description, etc.).

        Args:
            org_id: Target organization UUID.
            user_org_id: User's organization UUID (for permission check).

        Returns:
            OrgDetailsResponse.

        Raises:
            HTTPException: 403 if org mismatch, 404 if not found.
        """
        if org_id != user_org_id:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Organization mismatch / 組織が一致しません",
            )
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )

        org_type = org.get("type") or ""

        if org_type == "buyer":
            details = await self.crud.get_buyer_details(org_id)
            if not details:
                return OrgDetailsResponse(
                    org_id=org_id, updated_at=org.get("updated_at")
                )
            return OrgDetailsResponse(
                org_id=org_id,
                industry=details.get("industry"),
                employee_count=details.get("employee_count"),
                purpose=details.get("purpose"),
                updated_at=details.get("updated_at"),
            )

        if org_type == "vendor":
            details = await self.crud.get_vendor_details(org_id)
            if not details:
                return OrgDetailsResponse(
                    org_id=org_id, updated_at=org.get("updated_at")
                )
            return OrgDetailsResponse(
                org_id=org_id,
                industry=details.get("industry"),
                employee_count=details.get("employee_count"),
                business_description=details.get("business_description"),
                service_description=details.get("service_description"),
                website_url=details.get("website_url"),
                updated_at=details.get("updated_at"),
            )

        return OrgDetailsResponse(org_id=org_id, updated_at=org.get("updated_at"))

    async def update_org_details(
        self,
        org_id: str,
        user_id: str,
        user_org_id: str,
        user_role: str,
        body: OrgDetailsUpdateRequest,
    ) -> OrgDetailsResponse:
        """
        Update organization details (owner/admin only).

        Args:
            org_id: Target organization UUID.
            user_id: User UUID (for audit).
            user_org_id: User's organization UUID (for permission check).
            user_role: User's role (owner/admin/member).
            body: Update request.

        Returns:
            Updated OrgDetailsResponse.

        Raises:
            HTTPException: 403 if not owner/admin or org mismatch, 404 if not found.
        """
        self.check_permission(user_role, user_org_id, org_id)
        org = await self.crud.get_by_id(org_id)
        if not org:
            raise HTTPException(
                status_code=404,
                detail="Organization not found / 組織が見つかりません",
            )

        org_type = org.get("type") or ""
        payload = {
            k: v for k, v in body.model_dump(exclude_unset=True).items() if v is not None
        }

        if payload and org_type in ("buyer", "vendor"):
            await self.crud.update_details(org_id, org_type, payload, user_id)

        return await self.get_org_details(org_id, user_org_id)
