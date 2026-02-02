"""Unit tests for UserCRUD (mock Supabase) - profile by org, soft delete."""

import pytest
from unittest.mock import MagicMock

from app.crud.user import UserCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for UserCRUD."""
    return MagicMock()


@pytest.fixture
def crud(mock_supabase):
    """UserCRUD instance with mocked Supabase."""
    return UserCRUD(mock_supabase)


@pytest.mark.asyncio
async def test_get_profile_by_id_and_org_returns_profile(crud, mock_supabase):
    """get_profile_by_id_and_org: returns profile when found in org."""
    profile_row = {
        "id": "user-1",
        "org_id": "org-1",
        "email": "u1@x.com",
        "role": "member",
        "is_deleted": False,
    }
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        profile_row
    ]
    result = await crud.get_profile_by_id_and_org("user-1", "org-1")
    mock_supabase.table.assert_called_once_with("profiles")
    assert result == profile_row
    assert result["role"] == "member"


@pytest.mark.asyncio
async def test_get_profile_by_id_and_org_returns_none_when_not_found(crud, mock_supabase):
    """get_profile_by_id_and_org: returns None when not in org or deleted."""
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    result = await crud.get_profile_by_id_and_org("user-1", "org-1")
    assert result is None


@pytest.mark.asyncio
async def test_soft_delete_profile_returns_updated(crud, mock_supabase):
    """soft_delete_profile: sets is_deleted=true, deleted_at, returns updated row."""
    updated_row = {
        "id": "user-1",
        "org_id": "org-1",
        "is_deleted": True,
        "deleted_at": "2024-01-01T00:00:00Z",
    }
    mock_supabase.table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value.data = [
        updated_row
    ]
    result = await crud.soft_delete_profile("user-1", "actor-id")
    mock_supabase.table.assert_called_once_with("profiles")
    call_args = mock_supabase.table.return_value.update.call_args[0][0]
    assert call_args["is_deleted"] is True
    assert isinstance(call_args["deleted_at"], str) and "T" in call_args["deleted_at"]
    assert isinstance(call_args["updated_at"], str) and "T" in call_args["updated_at"]
    assert call_args["updated_by"] == "actor-id"
    assert result == updated_row


@pytest.mark.asyncio
async def test_soft_delete_profile_returns_none_when_already_deleted(crud, mock_supabase):
    """soft_delete_profile: returns None when profile already deleted (eq is_deleted False)."""
    mock_supabase.table.return_value.update.return_value.eq.return_value.eq.return_value.execute.return_value.data = []
    result = await crud.soft_delete_profile("user-1", "actor-id")
    assert result is None
