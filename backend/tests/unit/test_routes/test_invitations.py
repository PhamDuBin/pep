"""Unit tests for invitation routes (mock Service, mock Owner/Admin)."""

import pytest
import pytest_asyncio
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.core.security import get_current_org_owner_or_admin, get_current_user
from app.api.routes.invitations import get_invitation_service
from app.schemas.invitation import (
    InvitationCreateResponse,
    InvitationListResponse,
    AcceptInvitationResponse,
)


@pytest_asyncio.fixture
async def owner_client():
    """Async client with get_current_org_owner_or_admin returning owner user."""
    async def override_owner():
        return {"id": "owner-user-id", "org_id": "org-uuid-1", "role": "owner"}

    app.dependency_overrides[get_current_org_owner_or_admin] = override_owner
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


@pytest.fixture
def mock_invitation_service():
    """Mock InvitationService."""
    mock = MagicMock()
    mock.create_invitation = AsyncMock(
        return_value=InvitationCreateResponse(
            invitation_id="inv-uuid-1",
            token="gen-token-abc",
        )
    )
    mock.list_invitations = AsyncMock(
        return_value=InvitationListResponse(invitations=[], total_count=0)
    )
    mock.accept_invitation = AsyncMock(
        return_value=AcceptInvitationResponse(
            profile_id="user-uuid",
            organization_id="org-uuid",
        )
    )
    mock.cancel_invitation = AsyncMock(return_value=None)
    mock.resend_invitation = AsyncMock(
        return_value=InvitationCreateResponse(
            invitation_id="inv-uuid-1",
            token="resend-token-xyz",
        )
    )
    return mock


# --- Owner/Admin 以外からの招待作成 → 403 Forbidden ---
@pytest.mark.asyncio
async def test_create_invitation_non_owner_returns_403():
    """Owner/Admin 以外からの招待作成 → 403 Forbidden."""
    async def override_owner_403():
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Owner or Admin only",
        )

    app.dependency_overrides[get_current_org_owner_or_admin] = override_owner_403
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.post(
                "/api/invitations",
                json={"email": "a@b.com", "role": "member"},
            )
        assert response.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


# --- POST /api/invitations: 201 + response shape ---
@pytest.mark.asyncio
async def test_create_invitation_returns_201_and_shape(owner_client, mock_invitation_service):
    """Create invitation returns 201 and InvitationCreateResponse shape."""
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        response = await owner_client.post(
            "/api/invitations",
            json={"email": "invitee@example.com", "role": "member"},
        )
        assert response.status_code == 201
        data = response.json()
        assert "invitation_id" in data
        assert "token" in data
        assert data["invitation_id"] == "inv-uuid-1"
        assert data["token"] == "gen-token-abc"
    finally:
        app.dependency_overrides.pop(get_invitation_service, None)


# --- GET /api/invitations: 200 + response shape ---
@pytest.mark.asyncio
async def test_list_invitations_returns_200_and_shape(owner_client, mock_invitation_service):
    """List invitations returns 200 and InvitationListResponse shape."""
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        response = await owner_client.get("/api/invitations")
        assert response.status_code == 200
        data = response.json()
        assert "invitations" in data
        assert "total_count" in data
        assert data["total_count"] == 0
        assert data["invitations"] == []
    finally:
        app.dependency_overrides.pop(get_invitation_service, None)


# --- POST /api/invitations/{token}/accept: 200 + user_id must match ---
@pytest.mark.asyncio
async def test_accept_invitation_returns_200_when_user_id_matches(mock_invitation_service):
    """Accept invitation returns 200 when body user_id matches authenticated user."""
    async def override_user():
        return {"id": "user-uuid-1", "email": "user@example.com"}

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.post(
                "/api/invitations/token-xyz/accept",
                json={"user_id": "user-uuid-1"},
            )
        assert response.status_code == 200
        data = response.json()
        assert data["profile_id"] == "user-uuid"
        assert data["organization_id"] == "org-uuid"
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(get_invitation_service, None)


@pytest.mark.asyncio
async def test_accept_invitation_returns_403_when_user_id_mismatch(mock_invitation_service):
    """Accept invitation returns 403 when body user_id does not match authenticated user."""
    async def override_user():
        return {"id": "user-uuid-1", "email": "user@example.com"}

    app.dependency_overrides[get_current_user] = override_user
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.post(
                "/api/invitations/token-xyz/accept",
                json={"user_id": "other-user-uuid"},
            )
        assert response.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_user, None)
        app.dependency_overrides.pop(get_invitation_service, None)


# --- POST /api/invitations/{invitation_id}/resend: 200 + response shape ---
@pytest.mark.asyncio
async def test_resend_invitation_returns_200_and_shape(owner_client, mock_invitation_service):
    """Resend invitation returns 200 and InvitationCreateResponse shape."""
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        response = await owner_client.post("/api/invitations/inv-uuid-1/resend")
        assert response.status_code == 200
        data = response.json()
        assert "invitation_id" in data
        assert "token" in data
        assert data["invitation_id"] == "inv-uuid-1"
        assert data["token"] == "resend-token-xyz"
    finally:
        app.dependency_overrides.pop(get_invitation_service, None)


@pytest.mark.asyncio
async def test_resend_invitation_non_owner_returns_403():
    """Resend invitation: non Owner/Admin returns 403."""
    async def override_owner_403():
        raise HTTPException(
            status_code=403,
            detail="Forbidden / Owner or Admin only",
        )

    app.dependency_overrides[get_current_org_owner_or_admin] = override_owner_403
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.post("/api/invitations/inv-uuid-1/resend")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


# --- DELETE /api/invitations/{id}: 204 ---
@pytest.mark.asyncio
async def test_cancel_invitation_returns_204(owner_client, mock_invitation_service):
    """Cancel invitation returns 204."""
    app.dependency_overrides[get_invitation_service] = lambda: mock_invitation_service
    try:
        response = await owner_client.delete("/api/invitations/inv-uuid-1")
        assert response.status_code == 204
    finally:
        app.dependency_overrides.pop(get_invitation_service, None)
