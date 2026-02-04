"""Unit tests for MemberCRUD (mock Supabase)."""

import pytest
from unittest.mock import MagicMock

from app.crud.member_crud import MemberCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for MemberCRUD."""
    return MagicMock()


@pytest.fixture
def crud(mock_supabase):
    """MemberCRUD instance with mocked Supabase."""
    return MemberCRUD(mock_supabase)


# ===========================================
# list_members Tests
# ===========================================


@pytest.mark.asyncio
async def test_list_members_returns_rows_and_count(crud, mock_supabase):
    """List members returns rows and total count."""
    row = {
        "id": "profile-1",
        "email": "user@example.com",
        "display_name": "User One",
        "role": "member",
        "status": "active",
        "avatar_url": None,
        "avatar_color": "#FF0000",
    }
    chain = (
        mock_supabase.table.return_value
        .select.return_value
        .eq.return_value
        .eq.return_value
        .order.return_value
        .range.return_value
    )
    chain.execute.return_value = MagicMock(data=[row], count=1)
    rows, total = await crud.list_members(org_id="org-1", limit=50, offset=0)
    assert len(rows) == 1
    assert rows[0]["email"] == "user@example.com"
    assert total == 1
    mock_supabase.table.assert_called_with("profiles")


@pytest.mark.asyncio
async def test_list_members_with_status_filter(crud, mock_supabase):
    """List members with status filter adds extra eq call."""
    chain = (
        mock_supabase.table.return_value
        .select.return_value
        .eq.return_value
        .eq.return_value
        .eq.return_value  # status filter
        .order.return_value
        .range.return_value
    )
    chain.execute.return_value = MagicMock(data=[], count=0)
    rows, total = await crud.list_members(
        org_id="org-1", status="active", limit=10, offset=0
    )
    assert rows == []
    assert total == 0


@pytest.mark.asyncio
async def test_list_members_with_role_filter(crud, mock_supabase):
    """List members with role filter adds extra eq call."""
    chain = (
        mock_supabase.table.return_value
        .select.return_value
        .eq.return_value
        .eq.return_value
        .eq.return_value  # role filter
        .order.return_value
        .range.return_value
    )
    chain.execute.return_value = MagicMock(data=[], count=0)
    rows, total = await crud.list_members(
        org_id="org-1", role="admin", limit=10, offset=0
    )
    assert rows == []
    assert total == 0


@pytest.mark.asyncio
async def test_list_members_empty_result(crud, mock_supabase):
    """List members returns empty list and zero count when no data."""
    chain = (
        mock_supabase.table.return_value
        .select.return_value
        .eq.return_value
        .eq.return_value
        .order.return_value
        .range.return_value
    )
    chain.execute.return_value = MagicMock(data=None, count=None)
    rows, total = await crud.list_members(org_id="org-1")
    assert rows == []
    assert total == 0


# ===========================================
# update_role Tests
# ===========================================


@pytest.mark.asyncio
async def test_update_role_success(crud, mock_supabase):
    """Update role returns updated row on success."""
    chain = (
        mock_supabase.table.return_value
        .update.return_value
        .eq.return_value
        .eq.return_value
        .eq.return_value
    )
    chain.execute.return_value = MagicMock(
        data=[{"id": "profile-1", "role": "admin", "status": "active"}]
    )
    result = await crud.update_role(
        profile_id="profile-1",
        org_id="org-1",
        new_role="admin",
        updated_by="actor-1",
    )
    assert result is not None
    assert result["role"] == "admin"
    mock_supabase.table.assert_called_with("profiles")


@pytest.mark.asyncio
async def test_update_role_returns_none_when_not_found(crud, mock_supabase):
    """Update role returns None when no matching row."""
    chain = (
        mock_supabase.table.return_value
        .update.return_value
        .eq.return_value
        .eq.return_value
        .eq.return_value
    )
    chain.execute.return_value = MagicMock(data=[])
    result = await crud.update_role(
        profile_id="unknown",
        org_id="org-1",
        new_role="admin",
        updated_by="actor-1",
    )
    assert result is None


# ===========================================
# call_transfer_ownership_rpc Tests
# ===========================================


@pytest.mark.asyncio
async def test_call_transfer_ownership_rpc_success(crud, mock_supabase):
    """RPC call returns transfer result on success."""
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={
            "org_id": "org-1",
            "previous_owner_id": "owner-1",
            "new_owner_id": "member-1",
            "status": "transferred",
        }
    )
    result = await crud.call_transfer_ownership_rpc(
        {
            "p_org_id": "org-1",
            "p_current_owner_id": "owner-1",
            "p_new_owner_id": "member-1",
        }
    )
    mock_supabase.rpc.assert_called_once_with(
        "transfer_ownership",
        {
            "p_org_id": "org-1",
            "p_current_owner_id": "owner-1",
            "p_new_owner_id": "member-1",
        },
    )
    assert result["status"] == "transferred"
