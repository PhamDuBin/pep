"""Unit tests for member routes (list, role change, transfer, remove, leave)."""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.api.routes.members import get_member_service
from app.schemas.member import (
    ChangeRoleResponse,
    MemberListItem,
    MemberListResponse,
    TransferOwnershipResponse,
)

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


@pytest_asyncio.fixture
async def admin_client():
    """Async client with get_current_org_owner_or_admin overridden as admin role."""
    async def override_org_owner_or_admin():
        return {"id": "admin-1", "org_id": _ORG_ID, "role": "admin"}

    app.dependency_overrides[get_current_org_owner_or_admin] = override_org_owner_or_admin
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


@pytest.fixture
def mock_member_service():
    """Mock MemberService with all methods returning success."""
    mock = MagicMock()
    mock.remove_member = AsyncMock(return_value=None)
    mock.leave_organization = AsyncMock(return_value=None)
    mock.list_members = AsyncMock(
        return_value=MemberListResponse(
            members=[
                MemberListItem(
                    id="p-1",
                    email="user@example.com",
                    display_name="User",
                    role="member",
                    status="active",
                    avatar_url=None,
                    avatar_color=None,
                )
            ],
            total_count=1,
        )
    )
    mock.change_role = AsyncMock(
        return_value=ChangeRoleResponse(id=_PROFILE_ID, role="admin", status="active")
    )
    mock.transfer_ownership = AsyncMock(
        return_value=TransferOwnershipResponse(
            org_id=_ORG_ID,
            previous_owner_id="owner-1",
            new_owner_id=_PROFILE_ID,
            status="transferred",
        )
    )
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


# ===========================================================
# GET /{org_id}/members - List members
# ===========================================================


@pytest.mark.asyncio
async def test_list_members_returns_200(current_user_client, mock_member_service):
    """GET .../members returns 200 with member list."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await current_user_client.get(
            f"/api/organizations/{_ORG_ID}/members"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["total_count"] == 1
        assert len(data["members"]) == 1
        assert data["members"][0]["email"] == "user@example.com"
        mock_member_service.list_members.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_list_members_with_filters(current_user_client, mock_member_service):
    """GET .../members?status=active&role=admin passes filters to service."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await current_user_client.get(
            f"/api/organizations/{_ORG_ID}/members?status=active&role=admin&limit=10&offset=5"
        )
        assert response.status_code == 200
        call_kwargs = mock_member_service.list_members.call_args[1]
        assert call_kwargs["status"] == "active"
        assert call_kwargs["role"] == "admin"
        assert call_kwargs["limit"] == 10
        assert call_kwargs["offset"] == 5
    finally:
        app.dependency_overrides.pop(get_member_service, None)


# ===========================================================
# PUT /{org_id}/members/{profile_id}/role - Change role
# ===========================================================


@pytest.mark.asyncio
async def test_change_role_returns_200(owner_admin_client, mock_member_service):
    """PUT .../role returns 200 with updated role."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await owner_admin_client.put(
            f"/api/organizations/{_ORG_ID}/members/{_PROFILE_ID}/role",
            json={"role": "admin"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "admin"
        assert data["id"] == _PROFILE_ID
        mock_member_service.change_role.assert_called_once_with(
            org_id=_ORG_ID,
            profile_id=_PROFILE_ID,
            new_role="admin",
            actor_id="owner-1",
            actor_role="owner",
        )
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_change_role_org_mismatch_returns_403(owner_admin_client, mock_member_service):
    """PUT .../role with org mismatch returns 403."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await owner_admin_client.put(
            f"/api/organizations/{_ORG_OTHER}/members/{_PROFILE_ID}/role",
            json={"role": "admin"},
        )
        assert response.status_code == 403
        mock_member_service.change_role.assert_not_called()
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_change_role_invalid_role_returns_422(owner_admin_client):
    """PUT .../role with invalid role value returns 422."""
    response = await owner_admin_client.put(
        f"/api/organizations/{_ORG_ID}/members/{_PROFILE_ID}/role",
        json={"role": "superadmin"},
    )
    assert response.status_code == 422


# ===========================================================
# POST /{org_id}/transfer-ownership - Transfer ownership
# ===========================================================


@pytest.mark.asyncio
async def test_transfer_ownership_returns_200(owner_admin_client, mock_member_service):
    """POST .../transfer-ownership returns 200 with transfer result."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await owner_admin_client.post(
            f"/api/organizations/{_ORG_ID}/transfer-ownership",
            json={"new_owner_profile_id": _PROFILE_ID},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "transferred"
        assert data["new_owner_id"] == _PROFILE_ID
        mock_member_service.transfer_ownership.assert_called_once_with(
            org_id=_ORG_ID,
            current_owner_id="owner-1",
            new_owner_id=_PROFILE_ID,
        )
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_transfer_ownership_org_mismatch_returns_403(owner_admin_client, mock_member_service):
    """POST .../transfer-ownership with org mismatch returns 403."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await owner_admin_client.post(
            f"/api/organizations/{_ORG_OTHER}/transfer-ownership",
            json={"new_owner_profile_id": _PROFILE_ID},
        )
        assert response.status_code == 403
        mock_member_service.transfer_ownership.assert_not_called()
    finally:
        app.dependency_overrides.pop(get_member_service, None)


@pytest.mark.asyncio
async def test_transfer_ownership_by_admin_returns_403(admin_client, mock_member_service):
    """POST .../transfer-ownership by admin (not owner) returns 403."""
    def return_mock_service():
        return mock_member_service

    app.dependency_overrides[get_member_service] = return_mock_service
    try:
        response = await admin_client.post(
            f"/api/organizations/{_ORG_ID}/transfer-ownership",
            json={"new_owner_profile_id": _PROFILE_ID},
        )
        assert response.status_code == 403
        mock_member_service.transfer_ownership.assert_not_called()
    finally:
        app.dependency_overrides.pop(get_member_service, None)
