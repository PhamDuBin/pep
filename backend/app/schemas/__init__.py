"""Pydantic schemas for request/response validation."""

from app.schemas.user import (
    UserProfile,
    UserProfileUpdate,
    AvatarUpdate,
    PasswordChange,
    EmailChangeRequest,
    AvatarColor,
)
from app.schemas.application import (
    ApplicationBase,
    BuyerApplicationResponse,
    VendorApplicationResponse,
    ApplicationListItem,
    ApplicationListResponse,
    ApproveResponse,
    RejectRequest,
    RejectResponse,
    ApplicationQueryParams,
)

__all__ = [
    # User schemas
    "UserProfile",
    "UserProfileUpdate",
    "AvatarUpdate",
    "PasswordChange",
    "EmailChangeRequest",
    "AvatarColor",
    # Application schemas
    "ApplicationBase",
    "BuyerApplicationResponse",
    "VendorApplicationResponse",
    "ApplicationListItem",
    "ApplicationListResponse",
    "ApproveResponse",
    "RejectRequest",
    "RejectResponse",
    "ApplicationQueryParams",
]
