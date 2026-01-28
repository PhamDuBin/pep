"""User profile schemas."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserProfile(BaseModel):
    """User profile response schema."""

    id: str
    org_id: str
    email: EmailStr
    display_name: str
    department: Optional[str] = None
    avatar_url: Optional[str] = None
    avatar_color: Optional[str] = None
    role: str  # owner | admin | member
    status: str  # active | inactive | pending
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    """User profile update request schema."""

    display_name: Optional[str] = Field(None, min_length=1, max_length=100)
    department: Optional[str] = Field(None, max_length=100)


class AvatarUpdate(BaseModel):
    """Avatar update request schema."""

    avatar_url: Optional[str] = None
    avatar_color: Optional[str] = Field(None, pattern=r"^#[0-9a-fA-F]{6}$")


class PasswordChange(BaseModel):
    """Password change request schema."""

    current_password: str = Field(..., min_length=8)
    new_password: str = Field(..., min_length=8, max_length=72)


class EmailChangeRequest(BaseModel):
    """Email change request schema."""

    new_email: EmailStr


class AvatarColor(BaseModel):
    """Avatar color option schema."""

    id: str
    color: str
    border_color: str


class PlatformAdminStatus(BaseModel):
    """Platform admin flag response schema."""

    is_platform_admin: bool
