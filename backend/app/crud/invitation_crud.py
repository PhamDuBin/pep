"""Invitation CRUD operations (create / list / accept / cancel)."""

import uuid
from datetime import datetime, timezone, timedelta
from typing import Any, List, Optional

from supabase import Client


class InvitationCRUD:
    """
    CRUD operations for invitations.

    招待のDB操作のみ担当。ビジネスロジックはService層で行う。
    """

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def create_invitation(
        self,
        org_id: str,
        email: str,
        role: str,
        invited_by: str,
    ) -> Optional[dict]:
        """
        Insert an invitation and return id and token.

        Args:
            org_id: Organization ID
            email: Invitee email
            role: admin or member
            invited_by: Profile ID of inviter

        Returns:
            Dict with id, token
        """
        token = str(uuid.uuid4())
        expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        result = (
            self.supabase.table("invitations")
            .insert(
                {
                    "org_id": org_id,
                    "email": email,
                    "role": role,
                    "token": token,
                    "created_by": invited_by,
                    "expires_at": expires_at,
                }
            )
            .execute()
        )
        data = result.data
        if not data or len(data) == 0:
            return None
        row = data[0]
        return {"id": str(row["id"]), "token": row["token"]}

    async def list_invitations(
        self,
        org_id: str,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[List[dict[str, Any]], int]:
        """
        List invitations for an organization.

        Returns:
            (list of row dicts, total_count)
        """
        q = (
            self.supabase.table("invitations")
            .select("id,org_id,email,role,status,expires_at,created_by,created_at", count="exact")
            .eq("org_id", org_id)
            .eq("is_deleted", False)
            .order("created_at", desc=True)
        )
        if status is not None:
            q = q.eq("status", status)
        r = q.range(offset, offset + limit - 1).execute()
        rows = r.data or []
        total = r.count if r.count is not None else len(rows)
        return rows, total

    async def call_accept_invitation_rpc(
        self,
        token: str,
        user_id: str,
    ) -> Optional[dict]:
        """
        Call accept_invitation RPC.

        Returns:
            Dict with profile_id, organization_id
        """
        result = self.supabase.rpc(
            "accept_invitation",
            {"p_token": token, "p_user_id": user_id},
        ).execute()
        return result.data

    async def delete_invitation(self, invitation_id: str, org_id: str) -> bool:
        """
        Soft-delete (cancel) an invitation only if it belongs to the organization.
        Sets is_deleted = true; does not physically delete the row.

        Returns:
            True if a row was updated, False if not found or org mismatch or already deleted
        """
        result = (
            self.supabase.table("invitations")
            .update({"is_deleted": True})
            .eq("id", invitation_id)
            .eq("org_id", org_id)
            .eq("is_deleted", False)
            .execute()
        )
        data = result.data or []
        return len(data) > 0

    async def get_by_id(self, invitation_id: str) -> Optional[dict]:
        """
        Get an invitation by id (exclude soft-deleted).

        Returns:
            Row dict or None if not found.
        """
        result = (
            self.supabase.table("invitations")
            .select("id,org_id,email,role,status,token,expires_at,created_by,created_at")
            .eq("id", invitation_id)
            .eq("is_deleted", False)
            .limit(1)
            .execute()
        )
        rows = result.data or []
        return rows[0] if rows else None

    async def reset_expiration(self, invitation_id: str) -> Optional[dict]:
        """
        Reset expiration for a pending invitation (extend by 7 days).
        Only updates if status is pending and not soft-deleted.

        Returns:
            Updated row dict (id, token, expires_at, ...) or None if not found/not pending.
        """
        expires_at = (datetime.now(timezone.utc) + timedelta(days=7)).isoformat()
        updated_at = datetime.now(timezone.utc).isoformat()
        result = (
            self.supabase.table("invitations")
            .update({"expires_at": expires_at, "updated_at": updated_at})
            .eq("id", invitation_id)
            .eq("status", "pending")
            .eq("is_deleted", False)
            .execute()
        )
        data = result.data or []
        return data[0] if data else None

    async def get_pending_by_org_and_email(
        self,
        org_id: str,
        email: str,
    ) -> Optional[dict]:
        """
        Find a pending invitation for the same org and email.

        Used to detect duplicate invitation.
        """
        result = (
            self.supabase.table("invitations")
            .select("id")
            .eq("org_id", org_id)
            .eq("email", email)
            .eq("status", "pending")
            .eq("is_deleted", False)
            .limit(1)
            .execute()
        )
        rows = result.data or []
        return rows[0] if rows else None
