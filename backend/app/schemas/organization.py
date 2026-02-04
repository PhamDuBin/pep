"""Organization schemas for admin suspend/reactivate and organization settings."""

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


# --- Admin suspend/reactivate (existing) ---


class SuspendOrganizationRequest(BaseModel):
    """Request body for suspending an organization."""

    reason: Optional[str] = Field(None, max_length=500, description="Optional reason for suspension")


class OrganizationStatusResponse(BaseModel):
    """Response for organization status change (suspend/reactivate)."""

    id: str
    status: str  # active | suspended | pending | inactive

    class Config:
        from_attributes = True


# --- Organization settings (Task 01-10) ---

EmployeeCountLiteral = Literal["1-10", "10-50", "50-100", "100-500", "500+"]


class OrganizationResponse(BaseModel):
    """Response for GET /api/v1/organizations/{org_id}."""

    id: str
    name: str
    type: str  # buyer | vendor | platform
    status: str  # active | inactive | pending | suspended
    industry: Optional[str] = None
    employee_count: Optional[str] = None
    billing_email: Optional[str] = None
    billing_customer_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrganizationUpdateRequest(BaseModel):
    """Request body for PATCH /api/v1/organizations/{org_id}."""

    name: str = Field(..., min_length=1, max_length=255, description="Organization name")
    industry: Optional[str] = Field(None, max_length=255)
    employee_count: Optional[EmployeeCountLiteral] = None
    billing_email: Optional[EmailStr] = None


class OrgDetailsResponse(BaseModel):
    """Response for GET/PATCH /api/v1/organizations/{org_id}/details."""

    org_id: str
    industry: Optional[str] = None
    employee_count: Optional[str] = None
    # Buyer fields
    purpose: Optional[str] = None
    # Vendor fields
    business_description: Optional[str] = None
    service_description: Optional[str] = None
    website_url: Optional[str] = None
    updated_at: datetime

    class Config:
        from_attributes = True


class OrgDetailsUpdateRequest(BaseModel):
    """Request body for PATCH /api/v1/organizations/{org_id}/details."""

    # Buyer fields
    purpose: Optional[str] = Field(None, max_length=2000)
    # Vendor fields
    business_description: Optional[str] = Field(None, max_length=2000)
    service_description: Optional[str] = Field(None, max_length=2000)
    website_url: Optional[str] = Field(None, max_length=500)
