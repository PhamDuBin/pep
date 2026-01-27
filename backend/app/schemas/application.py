"""Application schemas for admin approval/rejection."""

from datetime import datetime
from typing import Literal, Optional, List

from pydantic import BaseModel, Field


# =============================================================================
# Base schemas / 基本スキーマ
# =============================================================================

class ApplicationBase(BaseModel):
    """Base fields common to both buyer and vendor applications."""

    id: str = Field(..., description="Application ID")
    org_id: str = Field(..., description="Organization ID")
    company_name: str = Field(..., description="Company name / 会社名")
    contact_email: str = Field(..., description="Contact email / 連絡先メール")
    industry: Optional[str] = Field(None, description="Industry / 業種")
    employee_count: Optional[str] = Field(None, description="Employee count / 従業員数")
    status: Literal["pending", "approved", "rejected"] = Field(
        ..., description="Application status / 申請ステータス"
    )
    review_note: Optional[str] = Field(None, description="Review note / レビューコメント")
    reviewed_by: Optional[str] = Field(None, description="Reviewer ID / レビュアーID")
    reviewed_at: Optional[datetime] = Field(None, description="Review timestamp / レビュー日時")
    created_at: datetime = Field(..., description="Created timestamp / 作成日時")
    updated_at: datetime = Field(..., description="Updated timestamp / 更新日時")


class BuyerApplicationResponse(ApplicationBase):
    """Buyer application response schema."""

    org_type: Literal["buyer"] = "buyer"
    purpose: Optional[str] = Field(None, description="Purpose / 利用目的")

    class Config:
        from_attributes = True


class VendorApplicationResponse(ApplicationBase):
    """Vendor application response schema."""

    org_type: Literal["vendor"] = "vendor"
    business_description: Optional[str] = Field(
        None, description="Business description / 事業内容"
    )
    service_description: Optional[str] = Field(
        None, description="Service description / サービス内容"
    )
    website_url: Optional[str] = Field(None, description="Website URL / ウェブサイト")

    class Config:
        from_attributes = True


# =============================================================================
# List response / 一覧レスポンス
# =============================================================================

class ApplicationListItem(BaseModel):
    """Application list item (unified for both buyer and vendor)."""

    id: str
    org_id: str
    org_type: Literal["buyer", "vendor"]
    company_name: str
    contact_email: str
    industry: Optional[str] = None
    employee_count: Optional[str] = None
    status: Literal["pending", "approved", "rejected"]
    reviewed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ApplicationListResponse(BaseModel):
    """Response for application list endpoint."""

    applications: List[ApplicationListItem] = Field(
        ..., description="List of applications / 申請一覧"
    )
    total_count: int = Field(..., description="Total count / 総数")


# =============================================================================
# Approve / Reject schemas / 承認・却下スキーマ
# =============================================================================

class ApproveResponse(BaseModel):
    """Response after approving an application."""

    status: Literal["approved"] = "approved"
    application_id: str = Field(..., description="Application ID")
    org_id: str = Field(..., description="Organization ID")
    org_type: Literal["buyer", "vendor"] = Field(..., description="Organization type")
    message: str = Field(
        default="Application approved successfully / 申請が承認されました",
        description="Success message",
    )


class RejectRequest(BaseModel):
    """Request body for rejecting an application."""

    review_note: Optional[str] = Field(
        None,
        max_length=2000,
        description="Rejection reason / 却下理由",
    )


class RejectResponse(BaseModel):
    """Response after rejecting an application."""

    status: Literal["rejected"] = "rejected"
    application_id: str = Field(..., description="Application ID")
    org_id: str = Field(..., description="Organization ID")
    org_type: Literal["buyer", "vendor"] = Field(..., description="Organization type")
    review_note: Optional[str] = Field(None, description="Review note / レビューコメント")
    message: str = Field(
        default="Application rejected / 申請が却下されました",
        description="Message",
    )


# =============================================================================
# Query parameters / クエリパラメータ
# =============================================================================

class ApplicationQueryParams(BaseModel):
    """Query parameters for listing applications."""

    status: Optional[Literal["pending", "approved", "rejected"]] = Field(
        None, description="Filter by status / ステータスでフィルタ"
    )
    org_type: Optional[Literal["buyer", "vendor"]] = Field(
        None, description="Filter by organization type / 組織タイプでフィルタ"
    )
    limit: int = Field(default=50, ge=1, le=100, description="Limit / 取得件数")
    offset: int = Field(default=0, ge=0, description="Offset / オフセット")
