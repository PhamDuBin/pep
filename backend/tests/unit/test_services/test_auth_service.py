"""Unit tests for AuthService (mock AuthCRUD)."""

import pytest
from unittest.mock import MagicMock
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.schemas.auth import UserInfo


@pytest.fixture
def mock_supabase():
    """Mock Supabase client (not used directly in get_current_user_info)."""
    return MagicMock()


@pytest.fixture
def mock_crud():
    """Mock AuthCRUD."""
    return MagicMock()


@pytest.fixture
def auth_service(mock_supabase, mock_crud):
    """AuthService with mocked CRUD."""
    svc = AuthService(mock_supabase)
    svc.crud = mock_crud
    return svc


@pytest.mark.asyncio
async def test_get_current_user_info_returns_user_info_when_active(auth_service, mock_crud):
    """get_current_user_info returns UserInfo when profile is active and org not suspended."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "owner",
        "status": "active",
        "org_id": "org-uuid",
        "org_name": "Org Name",
        "org_type": "buyer",
        "org_status": "active",
    }
    result = await auth_service.get_current_user_info("user-uuid", "u@example.com")
    assert isinstance(result, UserInfo)
    assert result.id == "user-uuid"
    assert result.email == "u@example.com"
    assert result.display_name == "User"
    assert result.role == "owner"
    assert result.status == "active"
    assert result.org_id == "org-uuid"
    assert result.org_name == "Org Name"
    assert result.org_type == "buyer"


@pytest.mark.asyncio
async def test_get_current_user_info_raises_on_pending(auth_service, mock_crud):
    """get_current_user_info raises 403 ONBOARDING_INCOMPLETE when profile.status is pending."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "member",
        "status": "pending",
        "org_id": None,
        "org_name": None,
        "org_type": None,
        "org_status": None,
    }
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "ONBOARDING_INCOMPLETE"
