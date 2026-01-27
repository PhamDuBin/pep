"""Application CRUD operations (admin approval/rejection)."""

from typing import Any, List, Optional

from supabase import Client

from app.schemas.application import ApplicationQueryParams


class ApplicationCRUD:
    """
    CRUD operations for application list / approve / reject.

    申請一覧・承認・却下のDB操作のみ担当。ビジネスロジックはService層で行う。
    """

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def call_approve_application_rpc(
        self,
        application_id: str,
        admin_id: str,
    ) -> Optional[dict]:
        """
        Call approve_application RPC to approve an application.

        approve_application RPCを呼び出して申請を承認する。
        RPC内で application/organization/profiles の更新と org_details へのコピーを実行。

        Args:
            application_id: Application ID
            admin_id: Admin user ID (reviewer)

        Returns:
            Dict with status, application_id, org_id, org_type

        Raises:
            Exception: If RPC fails (e.g. not found, not pending)
        """
        result = self.supabase.rpc(
            "approve_application",
            {
                "p_application_id": application_id,
                "p_admin_id": admin_id,
            },
        ).execute()
        return result.data

    async def call_reject_application_rpc(
        self,
        application_id: str,
        admin_id: str,
        review_note: Optional[str] = None,
    ) -> Optional[dict]:
        """
        Call reject_application RPC to reject an application.

        reject_application RPCを呼び出して申請を却下する。
        application のステータスのみ更新。organizations/profiles は変更しない。

        Args:
            application_id: Application ID
            admin_id: Admin user ID (reviewer)
            review_note: Optional rejection reason

        Returns:
            Dict with status, application_id, org_id, org_type, review_note

        Raises:
            Exception: If RPC fails
        """
        result = self.supabase.rpc(
            "reject_application",
            {
                "p_application_id": application_id,
                "p_admin_id": admin_id,
                "p_review_note": review_note,
            },
        ).execute()
        return result.data

    async def list_applications(
        self,
        params: ApplicationQueryParams,
    ) -> tuple[List[dict[str, Any]], int]:
        """
        List applications from buyer_applications and/or vendor_applications.

        申請一覧を取得。org_type に応じて buyer / vendor のいずれかまたは両方を検索。

        Args:
            params: status, org_type, limit, offset

        Returns:
            (list of row dicts for ApplicationListItem, total_count)
        """
        status = params.status
        org_type = params.org_type
        limit = params.limit
        offset = params.offset

        select_cols = (
            "id",
            "org_id",
            "company_name",
            "contact_email",
            "industry",
            "employee_count",
            "status",
            "reviewed_at",
            "created_at",
        )

        def query_buyer() -> tuple[List[dict], int]:
            q = (
                self.supabase.table("buyer_applications")
                .select(",".join(select_cols), count="exact")
                .eq("is_deleted", False)
                .order("created_at", desc=True)
            )
            if status is not None:
                q = q.eq("status", status)
            r = q.range(offset, offset + limit - 1).execute()
            rows = r.data or []
            for row in rows:
                row["org_type"] = "buyer"
            count = r.count if r.count is not None else len(rows)
            return rows, count

        def query_vendor() -> tuple[List[dict], int]:
            q = (
                self.supabase.table("vendor_applications")
                .select(",".join(select_cols), count="exact")
                .eq("is_deleted", False)
                .order("created_at", desc=True)
            )
            if status is not None:
                q = q.eq("status", status)
            r = q.range(offset, offset + limit - 1).execute()
            rows = r.data or []
            for row in rows:
                row["org_type"] = "vendor"
            count = r.count if r.count is not None else len(rows)
            return rows, count

        if org_type == "buyer":
            rows, total = query_buyer()
            return rows, total
        if org_type == "vendor":
            rows, total = query_vendor()
            return rows, total

        # org_type is None: merge both, sort by created_at desc, then paginate
        q_b = (
            self.supabase.table("buyer_applications")
            .select(",".join(select_cols))
            .eq("is_deleted", False)
            .order("created_at", desc=True)
        )
        if status is not None:
            q_b = q_b.eq("status", status)
        r_b = q_b.execute()
        buyer_rows = r_b.data or []
        for row in buyer_rows:
            row["org_type"] = "buyer"

        q_v = (
            self.supabase.table("vendor_applications")
            .select(",".join(select_cols))
            .eq("is_deleted", False)
            .order("created_at", desc=True)
        )
        if status is not None:
            q_v = q_v.eq("status", status)
        r_v = q_v.execute()
        vendor_rows = r_v.data or []
        for row in vendor_rows:
            row["org_type"] = "vendor"

        merged = sorted(
            buyer_rows + vendor_rows,
            key=lambda x: x.get("created_at") or "",
            reverse=True,
        )
        total = len(merged)
        page = merged[offset : offset + limit]
        return page, total
