"""Admin organization suspend/reactivate endpoints."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends

from app.core.supabase import get_supabase
from app.core.security import get_current_platform_admin
from app.services.organization_service import OrganizationService
from app.schemas.organization import (
    SuspendOrganizationRequest,
    OrganizationStatusResponse,
)

router = APIRouter()


def get_organization_service(supabase=Depends(get_supabase)) -> OrganizationService:
    """Dependency to get OrganizationService instance."""
    return OrganizationService(supabase)


@router.put(
    "/{org_id}/suspend",
    response_model=OrganizationStatusResponse,
)
async def suspend_organization(
    org_id: UUID,
    body: Optional[SuspendOrganizationRequest] = None,
    admin_user: dict = Depends(get_current_platform_admin),
    service: OrganizationService = Depends(get_organization_service),
) -> OrganizationStatusResponse:
    """
    Suspend an organization (set status to suspended).

    Platform Admin only. Optional reason in body (not persisted in this implementation).
    組織を停止する。プラットフォーム管理者のみ。
    """
    reason = body.reason if body else None
    return await service.suspend_organization(
        org_id=str(org_id),
        admin_id=admin_user["id"],
        reason=reason,
    )


@router.put(
    "/{org_id}/reactivate",
    response_model=OrganizationStatusResponse,
)
async def reactivate_organization(
    org_id: UUID,
    admin_user: dict = Depends(get_current_platform_admin),
    service: OrganizationService = Depends(get_organization_service),
) -> OrganizationStatusResponse:
    """
    Reactivate an organization (set status to active).

    Platform Admin only.
    組織を再開する。プラットフォーム管理者のみ。
    """
    return await service.reactivate_organization(
        org_id=str(org_id),
        admin_id=admin_user["id"],
    )
