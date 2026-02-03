"""Onboarding request/response schemas."""

from typing import Literal

from pydantic import BaseModel, EmailStr, Field, HttpUrl


class BuyerOnboardingRequest(BaseModel):
    """Buyer onboarding request from Frontend."""

    company_name: str = Field(..., min_length=1, max_length=255)
    display_name: str = Field(..., min_length=1, max_length=100)
    contact_email: EmailStr
    industry: str = Field(..., min_length=1, max_length=100)
    employee_count: str = Field(..., min_length=1, max_length=50)
    purpose: str = Field(..., min_length=1, max_length=1000, description="利用目的")


class VendorOnboardingRequest(BaseModel):
    """Vendor onboarding request from Frontend."""

    company_name: str = Field(..., min_length=1, max_length=255)
    display_name: str = Field(..., min_length=1, max_length=100)
    contact_email: EmailStr
    industry: str = Field(..., min_length=1, max_length=100)
    employee_count: str = Field(..., min_length=1, max_length=50)
    business_description: str = Field(
        ..., min_length=1, max_length=2000, description="事業内容"
    )
    service_description: str = Field(
        ..., min_length=1, max_length=2000, description="サービス説明"
    )
    website_url: HttpUrl = Field(..., description="WebサイトURL")


class OnboardingResponse(BaseModel):
    """Onboarding response."""

    organization_id: str
    profile_id: str
    application_id: str
    status: Literal["pending", "active"]
