"""Unit tests for InvitationCRUD (mock Supabase)."""

import pytest
from unittest.mock import MagicMock

from app.crud.invitation_crud import InvitationCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for InvitationCRUD."""
    return MagicMock()


@pytest.fixture
def crud(mock_supabase):
    """InvitationCRUD instance with mocked Supabase."""
    return InvitationCRUD(mock_supabase)


# ===========================================
# create_invitation Tests
# ===========================================

@pytest.mark.asyncio
async def test_create_invitation_returns_id_and_token(crud, mock_supabase):
    """Create invitation returns id and token."""
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[{"id": "inv-uuid-1", "token": "gen-token-abc"}]
    )
    result = await crud.create_invitation(
        org_id="org-uuid",
        email="invitee@example.com",
        role="member",
        invited_by="profile-uuid",
    )
    assert result["id"] == "inv-uuid-1"
    assert result["token"] == "gen-token-abc"
    mock_supabase.table.assert_called_with("invitations")
    mock_supabase.table.return_value.insert.assert_called_once()
    call_kw = mock_supabase.table.return_value.insert.call_args[0][0]
    assert call_kw["organization_id"] == "org-uuid"
    assert call_kw["email"] == "invitee@example.com"
    assert call_kw["role"] == "member"
    assert call_kw["created_by"] == "profile-uuid"
    assert "token" in call_kw
    assert "expires_at" in call_kw


@pytest.mark.asyncio
async def test_create_invitation_returns_none_when_empty_data(crud, mock_supabase):
    """Create invitation returns None when execute returns empty data."""
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(
        data=[]
    )
    result = await crud.create_invitation(
        org_id="org-uuid",
        email="a@b.com",
        role="admin",
        invited_by="p-uuid",
    )
    assert result is None


# ===========================================
# list_invitations Tests
# ===========================================

@pytest.mark.asyncio
async def test_list_invitations_returns_rows_and_count(crud, mock_supabase):
    """List invitations returns rows and total count."""
    row = {
        "id": "inv-1",
        "organization_id": "org-1",
        "email": "a@b.com",
        "role": "member",
        "status": "pending",
        "expires_at": "2025-02-01T00:00:00Z",
        "created_by": "p-1",
        "created_at": "2025-01-01T00:00:00Z",
    }
    chain = (
        mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value.range.return_value
    )
    chain.execute.return_value = MagicMock(data=[row], count=1)
    rows, total = await crud.list_invitations(org_id="org-1", limit=10, offset=0)
    assert len(rows) == 1
    assert rows[0]["email"] == "a@b.com"
    assert total == 1
    mock_supabase.table.assert_called_with("invitations")


# ===========================================
# call_accept_invitation_rpc Tests
# ===========================================

@pytest.mark.asyncio
async def test_call_accept_invitation_rpc_invokes_supabase(crud, mock_supabase):
    """RPC invoke: accept_invitation is called with correct args."""
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={"profile_id": "user-uuid", "organization_id": "org-uuid"}
    )
    result = await crud.call_accept_invitation_rpc("token-xyz", "user-uuid")
    mock_supabase.rpc.assert_called_once_with(
        "accept_invitation",
        {"p_token": "token-xyz", "p_user_id": "user-uuid"},
    )
    assert result["profile_id"] == "user-uuid"
    assert result["organization_id"] == "org-uuid"


# ===========================================
# delete_invitation Tests
# ===========================================

@pytest.mark.asyncio
async def test_delete_invitation_returns_true_when_deleted(crud, mock_supabase):
    """Delete invitation returns True when row deleted."""
    mock_supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[{"id": "inv-1"}]
    )
    result = await crud.delete_invitation("inv-1", "org-1")
    assert result is True
    mock_supabase.table.assert_called_with("invitations")


@pytest.mark.asyncio
async def test_delete_invitation_returns_false_when_empty(crud, mock_supabase):
    """Delete invitation returns False when no row deleted."""
    mock_supabase.table.return_value.delete.return_value.eq.return_value.eq.return_value.execute.return_value = MagicMock(
        data=[]
    )
    result = await crud.delete_invitation("inv-1", "org-1")
    assert result is False


# ===========================================
# get_pending_by_org_and_email Tests
# ===========================================

@pytest.mark.asyncio
async def test_get_pending_by_org_and_email_found(crud, mock_supabase):
    """Get pending invitation returns row when found."""
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{"id": "inv-1"}]
    )
    result = await crud.get_pending_by_org_and_email("org-1", "a@b.com")
    assert result is not None
    assert result["id"] == "inv-1"


@pytest.mark.asyncio
async def test_get_pending_by_org_and_email_not_found(crud, mock_supabase):
    """Get pending invitation returns None when not found."""
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.eq.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[]
    )
    result = await crud.get_pending_by_org_and_email("org-1", "a@b.com")
    assert result is None
