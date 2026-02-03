"""Invitation endpoints (create / list / accept / cancel)."""

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.supabase import get_supabase
from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.services.invitation_service import InvitationService
from app.schemas.invitation import (
    AcceptInvitationRequest,
    AcceptInvitationResponse,
    InvitationCreateRequest,
    InvitationCreateResponse,
    InvitationListResponse,
)

router = APIRouter()


def get_invitation_service(supabase=Depends(get_supabase)) -> InvitationService:
    """Dependency to get InvitationService instance."""
    return InvitationService(supabase)


@router.post("", response_model=InvitationCreateResponse, status_code=201)
async def create_invitation(
    body: InvitationCreateRequest,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: InvitationService = Depends(get_invitation_service),
) -> InvitationCreateResponse:
    """
    Create an invitation (Owner/Admin only).

    招待を作成。オーナーまたは管理者のみ。
    """
    return await service.create_invitation(
        org_id=current["org_id"],
        invited_by=current["id"],
        email=body.email,
        role=body.role,
    )


@router.get("", response_model=InvitationListResponse)
async def list_invitations(
    status: Optional[str] = Query(
        None,
        description="Filter by status / ステータスでフィルタ (pending, accepted, expired)",
    ),
    limit: int = Query(50, ge=1, le=100, description="Limit / 取得件数"),
    offset: int = Query(0, ge=0, description="Offset / オフセット"),
    current: dict = Depends(get_current_org_owner_or_admin),
    service: InvitationService = Depends(get_invitation_service),
) -> InvitationListResponse:
    """
    List invitations for the current user's organization (Owner/Admin only).

    自組織の招待一覧を取得。オーナーまたは管理者のみ。
    """
    return await service.list_invitations(
        org_id=current["org_id"],
        status=status,
        limit=limit,
        offset=offset,
    )


@router.post("/{invitation_id}/resend", response_model=InvitationCreateResponse)
async def resend_invitation(
    invitation_id: str,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: InvitationService = Depends(get_invitation_service),
) -> InvitationCreateResponse:
    """
    Resend an invitation: extend expiration and return token (Owner/Admin only).

    招待を再送。有効期限を延長しトークンを返す。オーナーまたは管理者のみ。
    """
    return await service.resend_invitation(
        invitation_id=invitation_id,
        org_id=current["org_id"],
    )


@router.post("/{token}/accept", response_model=AcceptInvitationResponse)
async def accept_invitation(
    token: str,
    body: AcceptInvitationRequest,
    current_user: dict = Depends(get_current_user),
    service: InvitationService = Depends(get_invitation_service),
) -> AcceptInvitationResponse:
    """
    Accept an invitation. user_id in body must match the authenticated user.

    招待を承諾。body の user_id は認証ユーザーと一致すること。
    """
    if str(current_user.get("id")) != str(body.user_id):
        raise HTTPException(
            status_code=403,
            detail="user_id must match authenticated user / user_id は認証ユーザーと一致してください",
        )
    return await service.accept_invitation(token=token, user_id=body.user_id)


@router.delete("/{invitation_id}", status_code=204)
async def cancel_invitation(
    invitation_id: str,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: InvitationService = Depends(get_invitation_service),
) -> None:
    """
    Cancel (delete) an invitation (Owner/Admin only).

    招待を取消。オーナーまたは管理者のみ。
    """
    await service.cancel_invitation(invitation_id=invitation_id, org_id=current["org_id"])
