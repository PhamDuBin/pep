"""Member endpoints (list, role change, owner transfer, remove, leave)."""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query

from app.core.supabase import get_supabase
from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.schemas.member import (
    ChangeRoleRequest,
    ChangeRoleResponse,
    MemberListResponse,
    TransferOwnershipRequest,
    TransferOwnershipResponse,
)
from app.services.member_service import MemberService

router = APIRouter()


def get_member_service(supabase=Depends(get_supabase)) -> MemberService:
    """Dependency to get MemberService instance."""
    return MemberService(supabase)


@router.delete("/{org_id}/members/me", status_code=204)
async def leave_organization(
    org_id: UUID,
    current_user: dict = Depends(get_current_user),
    service: MemberService = Depends(get_member_service),
) -> None:
    """
    Self-removal: leave the organization (soft-delete own profile).

    Owner cannot leave. 自己退会。オーナーは退会不可。
    """
    await service.leave_organization(
        org_id=str(org_id),
        user_id=current_user["id"],
    )


@router.delete("/{org_id}/members/{profile_id}", status_code=204)
async def remove_member(
    org_id: UUID,
    profile_id: UUID,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: MemberService = Depends(get_member_service),
) -> None:
    """
    Remove a member from the organization (soft-delete profile).

    Owner/Admin only. Rules: member removable by owner/admin; admin only by owner; owner cannot be removed.
    メンバーを削除（ソフトデリート）。オーナー/管理者のみ。
    """
    org_id_str = str(org_id)
    if current["org_id"] != org_id_str:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    await service.remove_member(
        org_id=org_id_str,
        profile_id=str(profile_id),
        actor_id=current["id"],
    )


# ---- List members ----


@router.get("/{org_id}/members", response_model=MemberListResponse)
async def list_members(
    org_id: UUID,
    status: Optional[str] = Query(None, description="Filter by status (active/pending)"),
    role: Optional[str] = Query(None, description="Filter by role (owner/admin/member)"),
    limit: int = Query(50, ge=1, le=100, description="Number of results per page"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    current_user: dict = Depends(get_current_user),
    service: MemberService = Depends(get_member_service),
) -> MemberListResponse:
    """
    List organization members with optional filters.

    Any org member can access. Service layer verifies org membership.
    組織メンバー一覧取得。同じ組織のメンバーのみアクセス可能（Service層で検証）。
    """
    return await service.list_members(
        org_id=str(org_id),
        actor_id=current_user["id"],
        status=status,
        role=role,
        limit=limit,
        offset=offset,
    )


# ---- Change role ----


@router.put(
    "/{org_id}/members/{profile_id}/role",
    response_model=ChangeRoleResponse,
)
async def change_role(
    org_id: UUID,
    profile_id: UUID,
    body: ChangeRoleRequest,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: MemberService = Depends(get_member_service),
) -> ChangeRoleResponse:
    """
    Change a member's role.

    Owner can change admin↔member. Admin can only promote member→admin.
    ロール変更。オーナーはadmin↔member、管理者はmember→adminのみ可能。
    """
    org_id_str = str(org_id)
    if current["org_id"] != org_id_str:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    return await service.change_role(
        org_id=org_id_str,
        profile_id=str(profile_id),
        new_role=body.role,
        actor_id=current["id"],
        actor_role=current["role"],
    )


# ---- Transfer ownership ----


@router.post(
    "/{org_id}/transfer-ownership",
    response_model=TransferOwnershipResponse,
)
async def transfer_ownership(
    org_id: UUID,
    body: TransferOwnershipRequest,
    current: dict = Depends(get_current_org_owner_or_admin),
    service: MemberService = Depends(get_member_service),
) -> TransferOwnershipResponse:
    """
    Transfer organization ownership to another member.

    Owner only. Current owner is demoted to admin.
    オーナー移譲。現オーナーはadminに降格。オーナーのみ実行可能。
    """
    org_id_str = str(org_id)
    if current["org_id"] != org_id_str:
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Organization mismatch / 組織が一致しません",
        )
    if current["role"] != "owner":
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Only owner can transfer ownership / オーナーのみ移譲可能です",
        )
    return await service.transfer_ownership(
        org_id=org_id_str,
        current_owner_id=current["id"],
        new_owner_id=body.new_owner_profile_id,
    )
