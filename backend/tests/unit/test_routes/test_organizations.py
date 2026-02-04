"""Unit tests for organization settings routes (mock Service)."""

import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.core.security import get_current_user, get_current_org_owner_or_admin
from app.api.routes.organizations.organizations import get_organization_service
from app.schemas.organization import OrganizationResponse, OrgDetailsResponse

_ORG_ID = "11111111-1111-1111-1111-111111111111"
_ORG_OTHER = "22222222-2222-2222-2222-222222222222"


@pytest_asyncio.fixture
async def member_client():
    """Async client with get_current_user returning member role."""
    async def override_get_current_user():
        return {"id": "user-1", "email": "user@example.com", "org_id": _ORG_ID, "role": "member"}

    app.dependency_overrides[get_current_user] = override_get_current_user
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.pop(get_current_user, None)


@pytest_asyncio.fixture
async def owner_client():
    """Async client with get_current_org_owner_or_admin returning owner."""
    async def override_org_owner_or_admin():
        return {"id": "owner-1", "org_id": _ORG_ID, "role": "owner"}

    app.dependency_overrides[get_current_org_owner_or_admin] = override_org_owner_or_admin
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.pop(get_current_org_owner_or_admin, None)


@pytest.fixture
def mock_service():
    """Mock OrganizationService."""
    mock = MagicMock()
    mock.get_organization = AsyncMock(return_value=OrganizationResponse(
        id=_ORG_ID, name="Acme", type="buyer", status="active",
        industry="IT", employee_count="50-100", billing_email="b@example.com",
        stripe_customer_id=None, created_at="2026-01-01T00:00:00Z", updated_at="2026-01-30T10:00:00Z",
    ))
    mock.update_organization = AsyncMock(return_value=OrganizationResponse(
        id=_ORG_ID, name="Updated", type="buyer", status="active",
        industry="IT", employee_count="100-500", billing_email="b@example.com",
        stripe_customer_id=None, created_at="2026-01-01T00:00:00Z", updated_at="2026-01-30T10:00:00Z",
    ))
    mock.get_org_details = AsyncMock(return_value=OrgDetailsResponse(
        org_id=_ORG_ID, purpose="RFI management", updated_at="2026-01-30T10:00:00Z",
    ))
    mock.update_org_details = AsyncMock(return_value=OrgDetailsResponse(
        org_id=_ORG_ID, purpose="Updated", updated_at="2026-01-30T10:00:00Z",
    ))
    return mock


@pytest.mark.asyncio
async def test_get_organization_returns_200(member_client, mock_service):
    """GET /api/v1/organizations/{org_id} returns 200."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await member_client.get(f"/api/v1/organizations/{_ORG_ID}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == _ORG_ID
        assert data["name"] == "Acme"
        mock_service.get_organization.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_patch_organization_returns_200(owner_client, mock_service):
    """PATCH /api/v1/organizations/{org_id} returns 200."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await owner_client.patch(
            f"/api/v1/organizations/{_ORG_ID}",
            json={"name": "Updated", "industry": "IT", "employee_count": "100-500"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated"
        mock_service.update_organization.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_patch_organization_org_mismatch_returns_403(owner_client, mock_service):
    """PATCH with different org_id returns 403."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await owner_client.patch(
            f"/api/v1/organizations/{_ORG_OTHER}",
            json={"name": "Test"},
        )
        assert response.status_code == 403
        mock_service.update_organization.assert_not_called()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_get_organization_details_returns_200(member_client, mock_service):
    """GET /api/v1/organizations/{org_id}/details returns 200."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await member_client.get(f"/api/v1/organizations/{_ORG_ID}/details")
        assert response.status_code == 200
        data = response.json()
        assert data["org_id"] == _ORG_ID
        mock_service.get_org_details.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_patch_organization_details_returns_200(owner_client, mock_service):
    """PATCH /api/v1/organizations/{org_id}/details returns 200."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await owner_client.patch(
            f"/api/v1/organizations/{_ORG_ID}/details",
            json={"purpose": "Updated"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["purpose"] == "Updated"
        mock_service.update_org_details.assert_called_once()
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_patch_organization_empty_name_returns_422(owner_client, mock_service):
    """PATCH with empty name returns 422 validation error."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await owner_client.patch(
            f"/api/v1/organizations/{_ORG_ID}",
            json={"name": ""},
        )
        assert response.status_code == 422
    finally:
        app.dependency_overrides.pop(get_organization_service, None)


@pytest.mark.asyncio
async def test_patch_organization_invalid_employee_count_returns_422(owner_client, mock_service):
    """PATCH with invalid employee_count returns 422."""
    app.dependency_overrides[get_organization_service] = lambda: mock_service
    try:
        response = await owner_client.patch(
            f"/api/v1/organizations/{_ORG_ID}",
            json={"name": "Test", "employee_count": "invalid"},
        )
        assert response.status_code == 422
    finally:
        app.dependency_overrides.pop(get_organization_service, None)
