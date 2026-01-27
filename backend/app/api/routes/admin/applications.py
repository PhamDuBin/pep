"""Admin application list / approve / reject endpoints."""

from typing import Literal, Optional

from fastapi import APIRouter, Body, Depends, Query

from app.core.supabase import get_supabase
from app.core.security import get_current_platform_admin
from app.services.application_service import ApplicationService
from app.schemas.application import (
    ApplicationListResponse,
    ApplicationQueryParams,
    ApproveResponse,
    RejectRequest,
    RejectResponse,
)

router = APIRouter()


def get_application_service(supabase=Depends(get_supabase)) -> ApplicationService:
    """Dependency to get ApplicationService instance."""
    return ApplicationService(supabase)


def get_application_query_params(
    status: Optional[Literal["pending", "approved", "rejected"]] = Query(
        None, description="Filter by status / ステータスでフィルタ"
    ),
    org_type: Optional[Literal["buyer", "vendor"]] = Query(
        None, description="Filter by organization type / 組織タイプでフィルタ"
    ),
    limit: int = Query(50, ge=1, le=100, description="Limit / 取得件数"),
    offset: int = Query(0, ge=0, description="Offset / オフセット"),
) -> ApplicationQueryParams:
    """Build ApplicationQueryParams from query string."""
    return ApplicationQueryParams(
        status=status,
        org_type=org_type,
        limit=limit,
        offset=offset,
    )


@router.get("", response_model=ApplicationListResponse)
async def list_applications(
    params: ApplicationQueryParams = Depends(get_application_query_params),
    admin_user: dict = Depends(get_current_platform_admin),
    service: ApplicationService = Depends(get_application_service),
) -> ApplicationListResponse:
    """
    List applications (pending / approved / rejected).

    Platform Admin only. Filter by status and/or org_type.
    申請一覧を取得。プラットフォーム管理者のみ。ステータス・組織タイプでフィルタ可能。
    """
    return await service.list_applications(params)


@router.put("/{application_id}/approve", response_model=ApproveResponse)
async def approve_application(
    application_id: str,
    admin_user: dict = Depends(get_current_platform_admin),
    service: ApplicationService = Depends(get_application_service),
) -> ApproveResponse:
    """
    Approve an application.

    Platform Admin only. Updates application/organization/profiles and copies to org_details.
    申請を承認。プラットフォーム管理者のみ。
    """
    return await service.approve_application(application_id, str(admin_user["id"]))


@router.put("/{application_id}/reject", response_model=RejectResponse)
async def reject_application(
    application_id: str,
    body: Optional[RejectRequest] = Body(None),
    admin_user: dict = Depends(get_current_platform_admin),
    service: ApplicationService = Depends(get_application_service),
) -> RejectResponse:
    """
    Reject an application.

    Platform Admin only. Updates application status only; organizations/profiles remain pending.
    申請を却下。プラットフォーム管理者のみ。organizations/profiles は変更しない。
    """
    review_note = body.review_note if body else None
    return await service.reject_application(
        application_id,
        str(admin_user["id"]),
        review_note=review_note,
    )
