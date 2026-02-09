"""Organization settings endpoints (GET/PATCH organization and details)."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.core.supabase import get_supabase
from app.schemas.organization import (
    OrgDetailsResponse,
    OrgDetailsUpdateRequest,
    OrganizationResponse,
    OrganizationUpdateRequest,
)
from app.services.organization_service import OrganizationService

router = APIRouter()


def get_organization_service(supabase=Depends(get_supabase)) -> OrganizationService:
    """Dependency to get OrganizationService instance."""
    return OrganizationService(supabase)


@router.get("/{org_id}", response_model=OrganizationResponse)
async def get_organization(
    org_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> OrganizationResponse:
    """
    Get organization info (basic + industry/employee_count from details).

    Same-org members only.
    """
    return await service.get_organization(
        org_id=str(org_id),
        user_org_id=current_user["org_id"],
    )


@router.patch("/{org_id}", response_model=OrganizationResponse)
async def update_organization(
    org_id: UUID,
    body: OrganizationUpdateRequest,
    current_user: dict = Depends(get_current_org_owner_or_admin),
    service: OrganizationService = Depends(get_organization_service),
) -> OrganizationResponse:
    """
    Update organization (owner/admin only).

    Updates name, billing_email on organizations and industry/employee_count on details.
    """
    if current_user["org_id"] != str(org_id):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    return await service.update_organization(
        org_id=str(org_id),
        user_id=current_user["id"],
        user_org_id=current_user["org_id"],
        user_role=current_user["role"],
        body=body,
    )


@router.get("/{org_id}/details", response_model=OrgDetailsResponse)
async def get_organization_details(
    org_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: OrganizationService = Depends(get_organization_service),
) -> OrgDetailsResponse:
    """
    Get organization details (Buyer: purpose / Vendor: business_description, etc.).

    Same-org members only.
    """
    if current_user["org_id"] != str(org_id):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    return await service.get_org_details(
        org_id=str(org_id),
        user_org_id=current_user["org_id"],
    )


@router.patch("/{org_id}/details", response_model=OrgDetailsResponse)
async def update_organization_details(
    org_id: UUID,
    body: OrgDetailsUpdateRequest,
    current_user: dict = Depends(get_current_org_owner_or_admin),
    service: OrganizationService = Depends(get_organization_service),
) -> OrgDetailsResponse:
    """
    Update organization details (owner/admin only).

    Buyer: purpose. Vendor: business_description, service_description, website_url.
    """
    if current_user["org_id"] != str(org_id):
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    return await service.update_org_details(
        org_id=str(org_id),
        user_id=current_user["id"],
        user_org_id=current_user["org_id"],
        user_role=current_user["role"],
        body=body,
    )
