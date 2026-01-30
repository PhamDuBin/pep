"""Unit tests for OrganizationCRUD (mock Supabase)."""

import pytest
from unittest.mock import MagicMock

from app.crud.organization_crud import OrganizationCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for OrganizationCRUD."""
    return MagicMock()


@pytest.fixture
def crud(mock_supabase):
    """OrganizationCRUD instance with mocked Supabase."""
    return OrganizationCRUD(mock_supabase)


@pytest.mark.asyncio
async def test_get_by_id_returns_org(crud, mock_supabase):
    """get_by_id: returns organization dict when found."""
    org_row = {"id": "org-1", "name": "Acme", "type": "buyer", "status": "active"}
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = [
        org_row
    ]
    result = await crud.get_by_id("org-1")
    mock_supabase.table.assert_called_once_with("organizations")
    mock_supabase.table.return_value.select.assert_called_once_with("*")
    mock_supabase.table.return_value.select.return_value.eq.assert_called_once_with(
        "id", "org-1"
    )
    assert result == org_row


@pytest.mark.asyncio
async def test_get_by_id_returns_none_when_not_found(crud, mock_supabase):
    """get_by_id: returns None when no row."""
    mock_supabase.table.return_value.select.return_value.eq.return_value.execute.return_value.data = []
    result = await crud.get_by_id("org-none")
    assert result is None


@pytest.mark.asyncio
async def test_update_organization_status_returns_updated(crud, mock_supabase):
    """update_organization_status: updates status and returns updated row."""
    updated_row = {"id": "org-1", "name": "Acme", "status": "suspended"}
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value.data = [
        updated_row
    ]
    result = await crud.update_organization_status(
        "org-1", "suspended", "admin-user-id"
    )
    mock_supabase.table.assert_called_once_with("organizations")
    call_args = mock_supabase.table.return_value.update.call_args[0][0]
    assert call_args["status"] == "suspended"
    assert call_args["updated_by"] == "admin-user-id"
    assert isinstance(call_args["updated_at"], str) and "T" in call_args["updated_at"]
    mock_supabase.table.return_value.update.return_value.eq.assert_called_once_with(
        "id", "org-1"
    )
    assert result == updated_row
    assert result["status"] == "suspended"


@pytest.mark.asyncio
async def test_update_organization_status_returns_none_when_no_row(crud, mock_supabase):
    """update_organization_status: returns None when no row updated."""
    mock_supabase.table.return_value.update.return_value.eq.return_value.execute.return_value.data = []
    result = await crud.update_organization_status("org-none", "active", "admin-id")
    assert result is None
