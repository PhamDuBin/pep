"""Member CRUD operations (list, role update, transfer ownership)."""

from datetime import datetime, timezone
from typing import Optional

from supabase import Client


class MemberCRUD:
    """CRUD operations for organization members.

    メンバー一覧取得、ロール変更、オーナー移譲のDB操作を担当。
    """

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def list_members(
        self,
        org_id: str,
        status: Optional[str] = None,
        role: Optional[str] = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[dict], int]:
        """
        List organization members with optional filters.

        組織メンバー一覧取得。ステータスやロールでフィルタ可能。
        """
        query = (
            self.supabase.table("profiles")
            .select(
                "id, email, display_name, role, status, avatar_url, avatar_color",
                count="exact",
            )
            .eq("org_id", org_id)
            .eq("is_deleted", False)
        )
        if status:
            query = query.eq("status", status)
        if role:
            query = query.eq("role", role)

        query = query.order("created_at", desc=False)
        query = query.range(offset, offset + limit - 1)

        result = query.execute()
        return result.data or [], result.count or 0

    async def update_role(
        self,
        profile_id: str,
        org_id: str,
        new_role: str,
        updated_by: str,
    ) -> Optional[dict]:
        """
        Update member role.

        メンバーのロールを更新。
        """
        now_utc = datetime.now(timezone.utc).isoformat()
        result = (
            self.supabase.table("profiles")
            .update(
                {
                    "role": new_role,
                    "updated_by": updated_by,
                    "updated_at": now_utc,
                }
            )
            .eq("id", profile_id)
            .eq("org_id", org_id)
            .eq("is_deleted", False)
            .execute()
        )
        return result.data[0] if result.data else None

    async def call_transfer_ownership_rpc(
        self, params: dict
    ) -> Optional[dict]:
        """
        Call transfer_ownership RPC.

        Owner移譲RPCを呼び出し。
        """
        result = self.supabase.rpc(
            "transfer_ownership", params
        ).execute()
        return result.data
