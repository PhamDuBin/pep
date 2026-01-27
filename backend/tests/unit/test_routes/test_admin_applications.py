"""Unit tests for admin application routes (mock Service, mock Platform Admin)."""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.core.security import get_current_platform_admin
from app.api.routes.admin.applications import get_application_service
from app.schemas.application import (
    ApplicationListResponse,
    ApproveResponse,
    RejectResponse,
)


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
def mock_application_service():
    """Mock ApplicationService with list/approve/reject returning success."""
    mock = MagicMock()
    mock.list_applications = AsyncMock(
        return_value=ApplicationListResponse(applications=[], total_count=0)
    )
    mock.approve_application = AsyncMock(
        return_value=ApproveResponse(
            status="approved",
            application_id="app-1",
            org_id="org-1",
            org_type="buyer",
        )
    )
    mock.reject_application = AsyncMock(
        return_value=RejectResponse(
            status="rejected",
            application_id="app-1",
            org_id="org-1",
            org_type="buyer",
            review_note=None,
        )
    )
    return mock


# --- Test Case 4: Platform Admin 以外からの実行 → 403 Forbidden ---
@pytest.mark.asyncio
async def test_list_applications_non_admin_returns_403():
    """Platform Admin 以外からの実行 → 403 Forbidden."""
    async def override_platform_admin_403():
        raise HTTPException(status_code=403, detail="Forbidden / Platform Admin only")

    app.dependency_overrides[get_current_platform_admin] = override_platform_admin_403
    try:
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
        ) as ac:
            response = await ac.get("/api/admin/applications")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.pop(get_current_platform_admin, None)


# --- List: 200 + response shape ---
@pytest.mark.asyncio
async def test_list_applications_returns_200_and_shape(admin_client, mock_application_service):
    """Admin list returns 200 and ApplicationListResponse shape."""
    def return_mock_service():
        return mock_application_service

    app.dependency_overrides[get_application_service] = return_mock_service
    try:
        response = await admin_client.get("/api/admin/applications")
        assert response.status_code == 200
        data = response.json()
        assert "applications" in data
        assert "total_count" in data
        assert data["total_count"] == 0
        assert data["applications"] == []
    finally:
        app.dependency_overrides.pop(get_application_service, None)


# --- Approve: 200 + response shape ---
@pytest.mark.asyncio
async def test_approve_application_returns_200_and_shape(admin_client, mock_application_service):
    """Admin approve returns 200 and ApproveResponse shape."""
    def return_mock_service():
        return mock_application_service

    app.dependency_overrides[get_application_service] = return_mock_service
    try:
        response = await admin_client.put(
            "/api/admin/applications/app-uuid-123/approve"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"
        assert data["application_id"] == "app-1"
        assert data["org_id"] == "org-1"
        assert data["org_type"] == "buyer"
    finally:
        app.dependency_overrides.pop(get_application_service, None)


# --- Reject: 200 + optional body ---
@pytest.mark.asyncio
async def test_reject_application_returns_200_and_shape(admin_client, mock_application_service):
    """Admin reject returns 200 and RejectResponse shape."""
    def return_mock_service():
        return mock_application_service

    app.dependency_overrides[get_application_service] = return_mock_service
    try:
        response = await admin_client.put(
            "/api/admin/applications/app-uuid-456/reject",
            json={"review_note": "Not qualified"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "rejected"
        assert data["application_id"] == "app-1"
    finally:
        app.dependency_overrides.pop(get_application_service, None)
