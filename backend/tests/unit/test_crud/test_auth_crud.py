"""Unit tests for AuthCRUD (mock Supabase)."""

import pytest
from unittest.mock import MagicMock

from app.crud.auth_crud import AuthCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client with chainable table/select/eq/execute."""
    mock = MagicMock()
    mock.table.return_value = mock
    mock.select.return_value = mock
    mock.eq.return_value = mock
    mock.execute.return_value = MagicMock(data=[])
    return mock


def test_get_user_profile_with_org_returns_profile_and_org(mock_supabase):
    """get_user_profile_with_org returns profile with org_name and org_type."""
    profile_response = MagicMock(
        data=[
            {
                "id": "user-uuid",
                "email": "u@example.com",
                "display_name": "User",
                "role": "member",
                "status": "active",
                "org_id": "org-uuid",
            }
        ]
    )
    org_response = MagicMock(
        data=[{"name": "Org Name", "type": "buyer", "status": "active"}]
    )
    mock_supabase.execute.side_effect = [profile_response, org_response]
    crud = AuthCRUD(mock_supabase)
    result = crud.get_user_profile_with_org("user-uuid")
    assert result is not None
    assert result["id"] == "user-uuid"
    assert result["email"] == "u@example.com"
    assert result["org_name"] == "Org Name"
    assert result["org_type"] == "buyer"
    assert result["org_status"] == "active"


def test_get_user_profile_with_org_returns_none_when_no_profile(mock_supabase):
    """get_user_profile_with_org returns None when profile not found."""
    mock_supabase.execute.return_value = MagicMock(data=[])
    crud = AuthCRUD(mock_supabase)
    result = crud.get_user_profile_with_org("unknown-uuid")
    assert result is None
