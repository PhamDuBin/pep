"""Member service (remove member / leave organization business logic)."""

from fastapi import HTTPException
from supabase import Client

from app.crud.user import UserCRUD


class MemberService:
    """
    Member service for remove member and self leave.

    Business logic: verify actor/target roles, then soft-delete profile.
    """

    def __init__(self, supabase: Client):
        self.crud = UserCRUD(supabase)
        self.supabase = supabase

    async def remove_member(
        self, org_id: str, profile_id: str, actor_id: str
    ) -> None:
        """
        Remove a member from the organization (soft-delete profile).

        Rules:
        - member: owner or admin can remove.
        - admin: only owner can remove.
        - owner: cannot be removed.

        Args:
            org_id: Organization UUID.
            profile_id: Profile (user) UUID to remove.
            actor_id: User ID performing the removal (must be owner or admin of org).

        Returns:
            None on success.

        Raises:
            HTTPException: 404 if target not in org, 403 if not allowed or actor not in org.
        """
        actor_profile = await self.crud.get_profile_by_id_and_org(
            actor_id, org_id
        )
        if not actor_profile:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / You are not in this organization / この組織に所属していません",
            )
        target_profile = await self.crud.get_profile_by_id_and_org(
            profile_id, org_id
        )
        if not target_profile:
            raise HTTPException(
                status_code=404,
                detail="Member not found / メンバーが見つかりません",
            )
        target_role = target_profile.get("role") or ""
        actor_role = actor_profile.get("role") or ""
        if target_role == "owner":
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Owner cannot be removed / オーナーは削除できません",
            )
        if target_role == "admin" and actor_role != "owner":
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Only owner can remove admin / 管理者を削除できるのはオーナーのみです",
            )
        # Idempotent: already soft-deleted (e.g. race) -> treat as success (204)
        await self.crud.soft_delete_profile(profile_id, actor_id)

    async def leave_organization(self, org_id: str, user_id: str) -> None:
        """
        Self-removal: leave the organization (soft-delete own profile).

        Owner cannot leave.

        Args:
            org_id: Organization UUID.
            user_id: User ID leaving (must match current user).

        Returns:
            None on success.

        Raises:
            HTTPException: 404 if user not in org, 403 if user is owner.
        """
        profile = await self.crud.get_profile_by_id_and_org(user_id, org_id)
        if not profile:
            raise HTTPException(
                status_code=404,
                detail="Profile not found in organization / 組織内にプロフィールが見つかりません",
            )
        if (profile.get("role") or "") == "owner":
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Owner cannot leave / オーナーは退会できません",
            )
        # Idempotent: already soft-deleted (e.g. race) -> treat as success (204)
        await self.crud.soft_delete_profile(user_id, user_id)
