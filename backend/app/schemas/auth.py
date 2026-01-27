"""Authentication schemas for signup."""

from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class SignupRequest(BaseModel):
    """
    Signup request schema.

    Buyer/Vendor両方のサインアップリクエストを処理。
    org_typeによって必須フィールドが変わる。
    """

    # Required fields (共通)
    user_id: str = Field(..., description="auth.users.id from Supabase Auth")
    org_type: Literal["buyer", "vendor"] = Field(..., description="Organization type")
    company_name: str = Field(..., min_length=1, max_length=200)
    contact_email: EmailStr
    display_name: str = Field(..., min_length=1, max_length=100)

    # Optional fields (共通)
    industry: Optional[str] = Field(None, max_length=100)
    employee_count: Optional[str] = Field(None, max_length=50)

    # Buyer only fields
    purpose: Optional[str] = Field(None, max_length=2000)

    # Vendor only fields
    business_description: Optional[str] = Field(None, max_length=2000)
    service_description: Optional[str] = Field(None, max_length=2000)
    website_url: Optional[str] = Field(None, max_length=500)

    @model_validator(mode="after")
    def validate_org_type_fields(self) -> "SignupRequest":
        """Validate fields based on org_type."""
        if self.org_type == "vendor":
            # Vendor should not have purpose field
            if self.purpose:
                raise ValueError("purpose field is only for buyer")
        elif self.org_type == "buyer":
            # Buyer should not have vendor-specific fields
            if self.business_description or self.service_description or self.website_url:
                raise ValueError(
                    "business_description, service_description, website_url are only for vendor"
                )
        return self

    class Config:
        json_schema_extra = {
            "examples": [
                {
                    "user_id": "550e8400-e29b-41d4-a716-446655440000",
                    "org_type": "buyer",
                    "company_name": "株式会社サンプル",
                    "contact_email": "contact@example.com",
                    "display_name": "山田太郎",
                    "industry": "製造業",
                    "employee_count": "100-500",
                    "purpose": "サービス選定のため",
                },
                {
                    "user_id": "550e8400-e29b-41d4-a716-446655440001",
                    "org_type": "vendor",
                    "company_name": "株式会社ベンダー",
                    "contact_email": "contact@vendor.com",
                    "display_name": "鈴木花子",
                    "industry": "IT・ソフトウェア",
                    "employee_count": "50-100",
                    "business_description": "クラウドサービスの開発・提供",
                    "service_description": "SaaS型業務管理システム",
                    "website_url": "https://vendor.example.com",
                },
            ]
        }


class SignupResponse(BaseModel):
    """
    Signup response schema.

    作成されたレコードのIDを返す。
    """

    organization_id: str
    profile_id: str
    application_id: str

    class Config:
        from_attributes = True
