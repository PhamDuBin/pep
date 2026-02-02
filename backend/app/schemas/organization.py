"""Organization schemas for admin suspend/reactivate and member management."""

from pydantic import BaseModel, Field


class SuspendOrganizationRequest(BaseModel):
    """Request body for suspending an organization."""

    reason: str | None = Field(None, max_length=500, description="Optional reason for suspension")


class OrganizationStatusResponse(BaseModel):
    """Response for organization status change (suspend/reactivate)."""

    id: str
    status: str  # active | suspended | pending | inactive

    class Config:
        from_attributes = True
