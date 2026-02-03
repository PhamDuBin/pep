"""Auth schemas (minimal: UserInfo for GET /api/v1/auth/me)."""

from typing import Optional
from pydantic import BaseModel, Field


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
