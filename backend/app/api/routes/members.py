"""Member endpoints (remove member / leave organization)."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.core.supabase import get_supabase
from app.core.security import get_current_user, get_current_org_owner_or_admin
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
