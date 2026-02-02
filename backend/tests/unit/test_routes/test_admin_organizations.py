"""Unit tests for admin organization routes (suspend/reactivate, mock Service)."""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.core.security import get_current_platform_admin
from app.api.routes.admin.organizations import get_organization_service
from app.schemas.organization import OrganizationStatusResponse

# Valid UUID for path param (FastAPI validates UUID format; invalid UUID -> 422)
_ORG_ID = "11111111-1111-1111-1111-111111111111"


@pytest_asyncio.fixture
async def admin_client():
    """Async client with get_current_platform_admin overridden to return admin user."""
    async def override_platform_admin():
        return {"id": "admin-user-id", "email": "admin@example.com"}

    app.dependency_overrides[get_current_platform_admin] = override_platform_admin
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_current_platform_admin, None)


@pytest.fixture
def mock_organization_service():
    """Mock OrganizationService with suspend/reactivate returning success."""
    mock = MagicMock()
    mock.suspend_organization = AsyncMock(
        return_value=OrganizationStatusResponse(id=_ORG_ID, status="suspended")
    )
    mock.reactivate_organization = AsyncMock(
        return_value=OrganizationStatusResponse(id=_ORG_ID, status="active")
    )
    return mock


@pytest.mark.asyncio
async def test_suspend_organization_invalid_uuid_returns_422(admin_client):
    """Invalid org_id (not UUID format) returns 422."""
    response = await admin_client.put("/api/admin/organizations/not-a-uuid/suspend")
    assert response.status_code == 422


# --- Test Case 6: Platform Admin 以外からの停止 → 403 Forbidden ---
@pytest.mark.asyncio
async def test_suspend_organization_non_admin_returns_403():
    """Platform Admin 以外からの停止 → 403 Forbidden."""
    async def override_platform_admin_403():
        raise HTTPException(status_code=403, detail="Forbidden / Platform Admin only")

    app.dependency_overrides[get_current_platform_admin] = override_platform_admin_403
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.put(f"/api/admin/organizations/{_ORG_ID}/suspend")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_platform_admin, None)


@pytest.mark.asyncio
async def test_suspend_organization_returns_200_and_shape(admin_client, mock_organization_service):
    """Suspend returns 200 and OrganizationStatusResponse (id, status)."""
    def return_mock_service():
        return mock_organization_service

    app.dependency_overrides[get_organization_service] = return_mock_service
    try:
        response = await admin_client.put(f"/api/admin/organizations/{_ORG_ID}/suspend")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == _ORG_ID
        assert data["status"] == "suspended"
        mock_organization_service.suspend_organization.assert_called_once()
        call_kwargs = mock_organization_service.suspend_organization.call_args[1]
        assert call_kwargs["org_id"] == _ORG_ID
        assert call_kwargs["admin_id"] == "admin-user-id"
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_reactivate_organization_returns_200_and_shape(admin_client, mock_organization_service):
    """Reactivate returns 200 and OrganizationStatusResponse (id, status)."""
    def return_mock_service():
        return mock_organization_service

    app.dependency_overrides[get_organization_service] = return_mock_service
    try:
        response = await admin_client.put(f"/api/admin/organizations/{_ORG_ID}/reactivate")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == _ORG_ID
        assert data["status"] == "active"
        mock_organization_service.reactivate_organization.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)
