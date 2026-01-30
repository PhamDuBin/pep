"""Unit tests for member routes (remove member / leave org, mock Service)."""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.api.routes.members import get_member_service

# Valid UUIDs for path params (FastAPI validates UUID format; invalid UUID -> 422)
_ORG_ID = "11111111-1111-1111-1111-111111111111"
_PROFILE_ID = "22222222-2222-2222-2222-222222222222"
_ORG_OTHER = "33333333-3333-3333-3333-333333333333"


@pytest_asyncio.fixture
async def current_user_client():
    """Async client with get_current_user overridden (for leave_organization)."""
    async def override_get_current_user():
        return {"id": "user-123", "email": "user@example.com"}

    app.dependency_overrides[get_current_user] = override_get_current_user
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_current_user, None)


@pytest_asyncio.fixture
async def owner_admin_client():
    """Async client with get_current_org_owner_or_admin overridden (for remove_member)."""
    async def override_org_owner_or_admin():
        return {"id": "owner-1", "org_id": _ORG_ID, "role": "owner"}

    app.dependency_overrides[get_current_org_owner_or_admin] = override_org_owner_or_admin
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


@pytest.fixture
def mock_member_service():
    """Mock MemberService with remove_member and leave_organization returning success."""
    mock = MagicMock()
    mock.remove_member = AsyncMock(return_value=None)
    mock.leave_organization = AsyncMock(return_value=None)
    return mock


@pytest.mark.asyncio
async def test_leave_organization_returns_204(current_user_client, mock_member_service):
    """DELETE .../members/me returns 204 and calls service.leave_organization."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await current_user_client.delete(
            f"/api/organizations/{_ORG_ID}/members/me"
        )
        assert response.status_code == 204
        mock_member_service.leave_organization.assert_called_once_with(
            org_id=_ORG_ID, user_id="user-123"
        )
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_remove_member_returns_204(owner_admin_client, mock_member_service):
    """DELETE .../members/{profile_id} returns 204 and calls service.remove_member."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await owner_admin_client.delete(
            f"/api/organizations/{_ORG_ID}/members/{_PROFILE_ID}"
        )
        assert response.status_code == 204
        mock_member_service.remove_member.assert_called_once_with(
            org_id=_ORG_ID, profile_id=_PROFILE_ID, actor_id="owner-1"
        )
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_leave_organization_invalid_uuid_returns_422(current_user_client):
    """Invalid org_id (not UUID format) returns 422."""
    response = await current_user_client.delete(
        "/api/organizations/not-a-uuid/members/me"
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_remove_member_org_mismatch_returns_403(owner_admin_client, mock_member_service):
    """Remove member when path org_id != current user org_id returns 403."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        # current user has org_id=org-1 (fixture), path has org_id=other org
        response = await owner_admin_client.delete(
            f"/api/organizations/{_ORG_OTHER}/members/{_PROFILE_ID}"
        )
        assert response.status_code == 403
        mock_member_service.remove_member.assert_not_called()
    finally:
        app.dependency_overrides.pop(get_member_service, None)
