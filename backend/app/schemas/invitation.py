"""Invitation schemas for create / list / accept / cancel."""

from datetime import datetime
from typing import Literal, Optional, List

from pydantic import BaseModel, EmailStr, Field


# =============================================================================
# Create / 招待作成
# =============================================================================

class InvitationCreateRequest(BaseModel):
    """Request body for creating an invitation."""

    email: EmailStr = Field(..., description="Invitee email / 招待先メール")
    role: Literal["admin", "member"] = Field(
        ..., description="Role to assign / 付与するロール"
    )


class InvitationCreateResponse(BaseModel):
    """Response after creating an invitation."""

    invitation_id: str = Field(..., description="Created invitation ID")
    token: str = Field(..., description="Token for accept link / 承諾リンク用トークン")


# =============================================================================
# List / 一覧
# =============================================================================

class InvitationListItem(BaseModel):
    """Single invitation in list."""

    id: str
    organization_id: str
    email: str
    role: Literal["admin", "member"]
    status: Literal["pending", "accepted", "expired"]
    expires_at: datetime
    invited_by: str
    created_at: datetime

    class Config:
        from_attributes = True


class InvitationListResponse(BaseModel):
    """List of invitations with total count."""

    invitations: List[InvitationListItem]
    total_count: int


# =============================================================================
# Accept / 承諾
# =============================================================================

class AcceptInvitationRequest(BaseModel):
    """Request body for accepting an invitation."""

    user_id: str = Field(..., description="Auth user ID (from signUp) / 承諾するユーザーID")


class AcceptInvitationResponse(BaseModel):
    """Response after accepting an invitation."""

    profile_id: str
    organization_id: str
