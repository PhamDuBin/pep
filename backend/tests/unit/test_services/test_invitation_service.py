"""Service layer tests for Invitation / Invitation Service層テスト."""

import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi import HTTPException

from app.services.invitation_service import InvitationService
from app.schemas.invitation import (
    AcceptInvitationResponse,
    InvitationCreateResponse,
    InvitationListResponse,
)


@pytest.fixture
def mock_supabase():
    """Mock Supabase client."""
    return MagicMock()


@pytest.fixture
def service(mock_supabase):
    """InvitationService with mocked Supabase (CRUD is real but will be mocked per test)."""
    return InvitationService(mock_supabase)


# ===========================================
# create_invitation Tests
# ===========================================

@pytest.mark.asyncio
async def test_create_invitation_success(service):
    """Test invitation creation success / 招待作成成功."""
    service.crud.get_pending_by_org_and_email = AsyncMock(return_value=None)
    service.crud.create_invitation = AsyncMock(
        return_value={"id": "inv-uuid-1", "token": "token-abc"}
    )
    result = await service.create_invitation(
        org_id="org-1",
        invited_by="profile-1",
        email="invitee@example.com",
        role="member",
    )
    assert isinstance(result, InvitationCreateResponse)
    assert result.invitation_id == "inv-uuid-1"
    assert result.token == "token-abc"
    service.crud.get_pending_by_org_and_email.assert_called_once_with(
        "org-1", "invitee@example.com"
    )
    service.crud.create_invitation.assert_called_once_with(
        "org-1", "invitee@example.com", "member", "profile-1"
    )


@pytest.mark.asyncio
async def test_create_invitation_duplicate_returns_409(service):
    """Test duplicate invitation returns 409 / 重複招待で409."""
    service.crud.get_pending_by_org_and_email = AsyncMock(
        return_value={"id": "existing-inv"}
    )
    service.crud.create_invitation = AsyncMock()
    with pytest.raises(HTTPException) as exc_info:
        await service.create_invitation(
            org_id="org-1",
            invited_by="profile-1",
            email="dup@example.com",
            role="admin",
        )
    assert exc_info.value.status_code == 409
    service.crud.create_invitation.assert_not_called()


@pytest.mark.asyncio
async def test_create_invitation_returns_500_when_crud_returns_none(service):
    """Test create returns 500 when CRUD returns None."""
    service.crud.get_pending_by_org_and_email = AsyncMock(return_value=None)
    service.crud.create_invitation = AsyncMock(return_value=None)
    with pytest.raises(HTTPException) as exc_info:
        await service.create_invitation(
            org_id="org-1",
            invited_by="profile-1",
            email="a@b.com",
            role="member",
        )
    assert exc_info.value.status_code == 500


# ===========================================
# list_invitations Tests
# ===========================================

@pytest.mark.asyncio
async def test_list_invitations_success(service):
    """Test list invitations returns response."""
    service.crud.list_invitations = AsyncMock(
        return_value=(
            [
                {
                    "id": "inv-1",
                    "organization_id": "org-1",
                    "email": "a@b.com",
                    "role": "member",
                    "status": "pending",
                    "expires_at": "2025-02-01T00:00:00Z",
                    "invited_by": "p-1",
                    "created_at": "2025-01-01T00:00:00Z",
                }
            ],
            1,
        )
    )
    result = await service.list_invitations(org_id="org-1", limit=10, offset=0)
    assert isinstance(result, InvitationListResponse)
    assert len(result.invitations) == 1
    assert result.invitations[0].email == "a@b.com"
    assert result.total_count == 1
    service.crud.list_invitations.assert_called_once_with(
        "org-1", status=None, limit=10, offset=0
    )


# ===========================================
# accept_invitation Tests
# ===========================================

@pytest.mark.asyncio
async def test_accept_invitation_success(service):
    """Test accept invitation success / 招待承諾成功."""
    service.crud.call_accept_invitation_rpc = AsyncMock(
        return_value={"profile_id": "user-uuid", "organization_id": "org-uuid"}
    )
    result = await service.accept_invitation(token="token-xyz", user_id="user-uuid")
    assert isinstance(result, AcceptInvitationResponse)
    assert result.profile_id == "user-uuid"
    assert result.organization_id == "org-uuid"
    service.crud.call_accept_invitation_rpc.assert_called_once_with(
        "token-xyz", "user-uuid"
    )


@pytest.mark.asyncio
async def test_accept_invitation_expired_returns_400(service):
    """Test expired invitation returns 400 / 有効期限切れで400."""
    service.crud.call_accept_invitation_rpc = AsyncMock(
        side_effect=Exception("Invitation expired")
    )
    with pytest.raises(HTTPException) as exc_info:
        await service.accept_invitation(token="token-xyz", user_id="user-uuid")
    assert exc_info.value.status_code == 400
    assert "expired" in exc_info.value.detail.lower() or "期限" in exc_info.value.detail


@pytest.mark.asyncio
async def test_accept_invitation_not_found_returns_404(service):
    """Test invitation not found returns 404."""
    service.crud.call_accept_invitation_rpc = AsyncMock(
        side_effect=Exception("Invitation not found")
    )
    with pytest.raises(HTTPException) as exc_info:
        await service.accept_invitation(token="bad-token", user_id="user-uuid")
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_accept_invitation_returns_500_when_rpc_returns_none(service):
    """Test accept returns 500 when RPC returns None."""
    service.crud.call_accept_invitation_rpc = AsyncMock(return_value=None)
    with pytest.raises(HTTPException) as exc_info:
        await service.accept_invitation(token="token-xyz", user_id="user-uuid")
    assert exc_info.value.status_code == 500


# ===========================================
# cancel_invitation Tests
# ===========================================

@pytest.mark.asyncio
async def test_cancel_invitation_success(service):
    """Test cancel invitation success / 招待取消成功."""
    service.crud.delete_invitation = AsyncMock(return_value=True)
    await service.cancel_invitation(invitation_id="inv-1", org_id="org-1")
    service.crud.delete_invitation.assert_called_once_with("inv-1", "org-1")


@pytest.mark.asyncio
async def test_cancel_invitation_not_found_returns_404(service):
    """Test cancel returns 404 when invitation not found."""
    service.crud.delete_invitation = AsyncMock(return_value=False)
    with pytest.raises(HTTPException) as exc_info:
        await service.cancel_invitation(invitation_id="inv-1", org_id="org-1")
    assert exc_info.value.status_code == 404
