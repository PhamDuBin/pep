"""Member schemas for role change, owner transfer, and member listing."""

from typing import Optional

from pydantic import BaseModel, Field


class MemberListItem(BaseModel):
    """Single member in list response."""

    id: str
    email: str
    display_name: Optional[str] = None
    role: str  # owner | admin | member
    status: str  # active | pending
    avatar_url: Optional[str] = None
    avatar_color: Optional[str] = None

    class Config:
        from_attributes = True


class MemberListResponse(BaseModel):
    """Response for member listing."""

    members: list[MemberListItem]
    total_count: int


class ChangeRoleRequest(BaseModel):
    """Request body for role change."""

    role: str = Field(..., pattern="^(admin|member)$", description="New role (admin or member)")


class ChangeRoleResponse(BaseModel):
    """Response for role change."""

    id: str
    role: str
    status: str


class TransferOwnershipRequest(BaseModel):
    """Request body for owner transfer."""

    new_owner_profile_id: str = Field(..., description="Profile ID of the new owner")


class TransferOwnershipResponse(BaseModel):
    """Response for owner transfer."""

    org_id: str
    previous_owner_id: str
    new_owner_id: str
    status: str  # transferred
