"""Invitation service (create / list / accept / cancel business logic)."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.invitation_crud import InvitationCRUD
from app.schemas.invitation import (
    AcceptInvitationResponse,
    InvitationCreateResponse,
    InvitationListItem,
    InvitationListResponse,
)


class InvitationService:
    """
    Invitation service for create / list / accept / cancel.

    招待作成・一覧・承諾・取消のビジネスロジックとエラーハンドリングを担当。
    """

    def __init__(self, supabase: Client):
        self.crud = InvitationCRUD(supabase)
        self.supabase = supabase

    async def create_invitation(
        self,
        org_id: str,
        invited_by: str,
        email: str,
        role: str,
    ) -> InvitationCreateResponse:
        """
        Create an invitation. Reject if duplicate pending (same org + email).

        Args:
            org_id: Organization ID
            invited_by: Inviter profile ID
            email: Invitee email
            role: admin or member

        Returns:
            InvitationCreateResponse with invitation_id and token
        """
        existing = await self.crud.get_pending_by_org_and_email(org_id, email)
        if existing:
            raise HTTPException(
                status_code=409,
                detail="Duplicate invitation / 同一組織・同一メールの招待が既に存在します",
            )
        result = await self.crud.create_invitation(org_id, email, role, invited_by)
        if not result:
            raise HTTPException(
                status_code=500,
                detail="Failed to create invitation / 招待の作成に失敗しました",
            )
        return InvitationCreateResponse(
            invitation_id=result["id"],
            token=result["token"],
        )

    async def list_invitations(
        self,
        org_id: str,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> InvitationListResponse:
        """List invitations for the organization."""
        rows, total = await self.crud.list_invitations(
            org_id, status=status, limit=limit, offset=offset
        )
        items = [
            InvitationListItem(
                id=str(r["id"]),
                organization_id=str(r["organization_id"]),
                email=r["email"],
                role=r["role"],
                status=r["status"],
                expires_at=r["expires_at"],
                invited_by=str(r.get("created_by", r.get("invited_by", ""))),
                created_at=r["created_at"],
            )
            for r in rows
        ]
        return InvitationListResponse(invitations=items, total_count=total)

    async def accept_invitation(self, token: str, user_id: str) -> AcceptInvitationResponse:
        """
        Accept an invitation via RPC.

        Args:
            token: Invitation token from URL
            user_id: Auth user ID (from signUp)

        Returns:
            AcceptInvitationResponse with profile_id and organization_id
        """
        try:
            result = await self.crud.call_accept_invitation_rpc(token, user_id)
        except Exception as e:
            self._map_accept_error(e)
            raise

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Accept invitation failed / 招待承諾に失敗しました",
            )
        return AcceptInvitationResponse(
            profile_id=str(result.get("profile_id", user_id)),
            organization_id=str(result.get("organization_id", "")),
        )

    async def cancel_invitation(self, invitation_id: str, org_id: str) -> None:
        """
        Delete (cancel) an invitation. Only if it belongs to the organization.

        Raises:
            HTTPException 404 if not found or org mismatch
        """
        deleted = await self.crud.delete_invitation(invitation_id, org_id)
        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Invitation not found / 招待が見つかりません",
            )

    def _map_accept_error(self, e: Exception) -> None:
        """Map accept_invitation RPC errors to HTTPException and raise."""
        msg = str(e)
        if "Invitation not found" in msg:
            raise HTTPException(
                status_code=404,
                detail="Invitation not found / 招待が見つかりません",
            )
        if "not pending" in msg.lower():
            raise HTTPException(
                status_code=409,
                detail="Invitation is not pending / 招待は既に承諾または無効です",
            )
        if "expired" in msg.lower():
            raise HTTPException(
                status_code=400,
                detail="Invitation expired / 招待の有効期限が切れています",
            )
        if "Profile not found" in msg:
            raise HTTPException(
                status_code=400,
                detail="Profile not found for user / ユーザーのプロフィールが見つかりません",
            )
        raise HTTPException(
            status_code=400,
            detail=f"Accept invitation failed: {msg} / 招待承諾に失敗しました: {msg}",
        )
