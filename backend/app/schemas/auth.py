"""Auth schemas (UserInfo, LoginResponse, PasswordResetRequest, PasswordResetConfirm)."""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserInfo(BaseModel):
    """Current user info for GET /api/v1/auth/me."""

    id: str = Field(..., description="User UUID")
    email: str = Field(..., description="User email")
    display_name: str = Field(..., description="Display name")
    role: str = Field(..., description="owner | admin | member")
    org_id: Optional[str] = Field(None, description="Organization UUID")
    org_name: Optional[str] = Field(None, description="Organization name")
    org_type: Optional[str] = Field(None, description="buyer | vendor | platform")
    status: str = Field(..., description="active | inactive | pending | suspended")


class LoginResponse(BaseModel):
    """Token response for POST /api/v1/auth/refresh."""

    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="Refresh token")
    expires_in: int = Field(..., description="Access token TTL in seconds")


class RefreshRequest(BaseModel):
    """Request body for POST /api/v1/auth/refresh."""

    refresh_token: str = Field(..., description="Refresh token")


class PasswordResetRequest(BaseModel):
    """Request body for POST /api/v1/auth/password-reset-request."""

    email: EmailStr = Field(..., description="User email")


class PasswordResetConfirm(BaseModel):
    """Request body for POST /api/v1/auth/password-reset-confirm."""

    token: str = Field(
        ...,
        description="JWT from redirect URL after clicking email link (#access_token=eyJ...). "
        "Required: use the JWT in the redirect URL, not the short token from the link query.",
    )
    new_password: str = Field(..., min_length=8, max_length=72, description="New password")


class PasswordResetMessage(BaseModel):
    """Response for password reset request/confirm."""

    message: str = Field(..., description="Success message")
