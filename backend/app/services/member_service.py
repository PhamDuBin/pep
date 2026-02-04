"""Member service (list, role change, owner transfer, remove, leave)."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.member_crud import MemberCRUD
from app.crud.user import UserCRUD
from app.schemas.member import (
    ChangeRoleResponse,
    MemberListItem,
    MemberListResponse,
    TransferOwnershipResponse,
)


class MemberService:
    """
    Member service for organization member management.

    メンバー一覧、ロール変更、オーナー移譲、メンバー削除のビジネスロジック。
    """

    def __init__(self, supabase: Client):
        self.crud = UserCRUD(supabase)
        self.member_crud = MemberCRUD(supabase)
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

    # ---- List members ----

    async def list_members(
        self,
        org_id: str,
        actor_id: str,
        status: Optional[str] = None,
        role: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> MemberListResponse:
        """
        List organization members with optional filters.

        組織メンバー一覧取得。同じ組織のメンバーのみアクセス可能。
        """
        actor_profile = await self.crud.get_profile_by_id_and_org(
            actor_id, org_id
        )
        if not actor_profile:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / You are not in this organization / この組織に所属していません",
            )

        rows, total = await self.member_crud.list_members(
            org_id=org_id,
            status=status,
            role=role,
            limit=limit,
            offset=offset,
        )

        members = [MemberListItem(**row) for row in rows]
        return MemberListResponse(members=members, total_count=total)

    # ---- Change role ----

    async def change_role(
        self,
        org_id: str,
        profile_id: str,
        new_role: str,
        actor_id: str,
        actor_role: str,
    ) -> ChangeRoleResponse:
        """
        Change a member's role with permission checks.

        Permission matrix:
        - owner can change admin→member, member→admin
        - admin can change member→admin only (not admin→member)
        - owner role cannot be assigned (use transfer_ownership)

        ロール変更。権限マトリックスに従い検証。
        """
        if new_role == "owner":
            raise HTTPException(
                status_code=400,
                detail="Cannot assign owner role directly. Use transfer-ownership instead. / ownerロールは直接設定できません。transfer-ownershipを使用してください。",
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

        if target_role == "owner":
            raise HTTPException(
                status_code=403,
                detail="Forbidden / Cannot change owner role / オーナーのロールは変更できません",
            )

        if target_role == new_role:
            raise HTTPException(
                status_code=400,
                detail="Role is already the same / ロールは既に同じです",
            )

        # Permission check: admin can only promote member→admin
        if actor_role == "admin":
            if not (target_role == "member" and new_role == "admin"):
                raise HTTPException(
                    status_code=403,
                    detail="Forbidden / Admin can only promote member to admin / 管理者はメンバーを管理者に昇格のみ可能です",
                )

        result = await self.member_crud.update_role(
            profile_id=profile_id,
            org_id=org_id,
            new_role=new_role,
            updated_by=actor_id,
        )
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to update role / ロール更新に失敗しました",
            )

        return ChangeRoleResponse(
            id=result["id"],
            role=result["role"],
            status=result.get("status", "active"),
        )

    # ---- Transfer ownership ----

    async def transfer_ownership(
        self,
        org_id: str,
        current_owner_id: str,
        new_owner_id: str,
    ) -> TransferOwnershipResponse:
        """
        Transfer organization ownership via RPC.

        RPC内でトランザクション制御。現オーナー→admin、対象→ownerに変更。
        """
        try:
            result = await self.member_crud.call_transfer_ownership_rpc(
                {
                    "p_org_id": org_id,
                    "p_current_owner_id": current_owner_id,
                    "p_new_owner_id": new_owner_id,
                }
            )
        except Exception as e:
            self._map_transfer_error(e)
            raise

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Transfer ownership failed / オーナー移譲に失敗しました",
            )

        return TransferOwnershipResponse(
            org_id=result["org_id"],
            previous_owner_id=result["previous_owner_id"],
            new_owner_id=result["new_owner_id"],
            status=result["status"],
        )

    # ---- Private helpers ----

    @staticmethod
    def _map_transfer_error(e: Exception) -> None:
        """Map RPC errors to HTTP exceptions."""
        msg = str(e).lower()
        if "not the owner" in msg:
            raise HTTPException(
                status_code=403,
                detail="Forbidden / You are not the owner / あなたはオーナーではありません",
            )
        if "not an active member" in msg:
            raise HTTPException(
                status_code=404,
                detail="Target is not an active member / 対象はアクティブなメンバーではありません",
            )
        if "cannot transfer ownership to yourself" in msg:
            raise HTTPException(
                status_code=400,
                detail="Cannot transfer ownership to yourself / 自分自身にはオーナー移譲できません",
            )
        raise HTTPException(
            status_code=400,
            detail=f"Transfer failed / 移譲に失敗しました: {str(e)}",
        )
