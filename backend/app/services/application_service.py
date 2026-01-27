"""Application service (admin approval/rejection business logic)."""

from typing import Optional

from fastapi import HTTPException
from supabase import Client

from app.crud.application_crud import ApplicationCRUD
from app.schemas.application import (
    ApplicationListItem,
    ApplicationListResponse,
    ApplicationQueryParams,
    ApproveResponse,
    RejectResponse,
)


class ApplicationService:
    """
    Application service for admin list / approve / reject.

    申請一覧・承認・却下のビジネスロジックとエラーハンドリングを担当。
    """

    def __init__(self, supabase: Client):
        self.crud = ApplicationCRUD(supabase)
        self.supabase = supabase

    async def list_applications(self, params: ApplicationQueryParams) -> ApplicationListResponse:
        """
        List applications with optional filters.

        申請一覧を取得。status / org_type でフィルタ可能。

        Args:
            params: status, org_type, limit, offset

        Returns:
            ApplicationListResponse with applications and total_count
        """
        rows, total = await self.crud.list_applications(params)
        items = [
            ApplicationListItem(
                id=str(r["id"]),
                org_id=str(r["org_id"]),
                org_type=r["org_type"],
                company_name=r["company_name"],
                contact_email=r["contact_email"],
                industry=r.get("industry"),
                employee_count=r.get("employee_count"),
                status=r["status"],
                reviewed_at=r.get("reviewed_at"),
                created_at=r["created_at"],
            )
            for r in rows
        ]
        return ApplicationListResponse(applications=items, total_count=total)

    async def approve_application(self, application_id: str, admin_id: str) -> ApproveResponse:
        """
        Approve an application via RPC.

        申請を承認する。RPC内で application/organization/profiles 更新と
        applications → org_details のコピーを実行。

        Args:
            application_id: Application ID
            admin_id: Admin (reviewer) user ID

        Returns:
            ApproveResponse with status, application_id, org_id, org_type

        Raises:
            HTTPException: 404 if not found, 409 if already approved/rejected
        """
        try:
            result = await self.crud.call_approve_application_rpc(application_id, admin_id)
        except Exception as e:
            self._map_rpc_error(e, "approve")
            raise

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Approval failed / 承認処理に失敗しました",
            )
        return ApproveResponse(
            status="approved",
            application_id=str(result.get("application_id", application_id)),
            org_id=str(result.get("org_id", "")),
            org_type=result.get("org_type", "buyer"),
        )

    async def reject_application(
        self,
        application_id: str,
        admin_id: str,
        review_note: Optional[str] = None,
    ) -> RejectResponse:
        """
        Reject an application via RPC.

        申請を却下する。application のステータスのみ更新。
        organizations / profiles は変更しない。

        Args:
            application_id: Application ID
            admin_id: Admin (reviewer) user ID
            review_note: Optional rejection reason

        Returns:
            RejectResponse with status, application_id, org_id, org_type, review_note

        Raises:
            HTTPException: 404 if not found, 409 if already approved/rejected
        """
        try:
            result = await self.crud.call_reject_application_rpc(
                application_id, admin_id, review_note
            )
        except Exception as e:
            self._map_rpc_error(e, "reject")
            raise

        if not result:
            raise HTTPException(
                status_code=500,
                detail="Rejection failed / 却下処理に失敗しました",
            )
        return RejectResponse(
            status="rejected",
            application_id=str(result.get("application_id", application_id)),
            org_id=str(result.get("org_id", "")),
            org_type=result.get("org_type", "buyer"),
            review_note=result.get("review_note") or review_note,
        )

    def _map_rpc_error(self, e: Exception, action: str) -> None:
        """
        Map RPC exception to HTTPException and raise.

        RPC のエラーメッセージを 404/409 にマッピングして HTTPException を投げる。
        """
        msg = str(e)
        if "Application not found" in msg:
            raise HTTPException(
                status_code=404,
                detail="Application not found / 申請が見つかりません",
            )
        if "not pending" in msg.lower():
            raise HTTPException(
                status_code=409,
                detail="Application is not pending (already approved or rejected) / 申請は既に承認または却下されています",
            )
        raise HTTPException(
            status_code=400,
            detail=f"{action} failed: {msg} / 処理に失敗しました: {msg}",
        )
