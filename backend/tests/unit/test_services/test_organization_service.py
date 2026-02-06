"""Unit tests for OrganizationService (mock CRUD) - suspend/reactivate and settings."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException

from app.services.organization_service import OrganizationService
from app.schemas.organization import (
    OrganizationStatusResponse,
    OrganizationResponse,
    OrganizationUpdateRequest,
    OrgDetailsResponse,
    OrgDetailsUpdateRequest,
)


@pytest.fixture
def mock_supabase():
    return MagicMock()


@pytest.fixture
def service(mock_supabase):
    return OrganizationService(mock_supabase)


# --- Test Case 1: 組織停止成功 (Suspend success) ---
@pytest.mark.asyncio
async def test_suspend_organization_success_returns_suspended(service):
    """Suspend success: status = suspended."""
    org_row = {"id": "org-1", "name": "Acme", "status": "active"}
    updated_row = {"id": "org-1", "name": "Acme", "status": "suspended"}
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(
            service.crud, "update_organization_status", new_callable=AsyncMock
        ) as m_upd:
            m_upd.return_value = updated_row
            out = await service.suspend_organization("org-1", "admin-id", reason=None)
    assert isinstance(out, OrganizationStatusResponse)
    assert out.id == "org-1"
    assert out.status == "suspended"


# --- Test Case 2: 組織再開成功 (Reactivate success) ---
@pytest.mark.asyncio
async def test_reactivate_organization_success_returns_active(service):
    """Reactivate success: status = active."""
    org_row = {"id": "org-1", "name": "Acme", "status": "suspended"}
    updated_row = {"id": "org-1", "name": "Acme", "status": "active"}
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(
            service.crud, "update_organization_status", new_callable=AsyncMock
        ) as m_upd:
            m_upd.return_value = updated_row
            out = await service.reactivate_organization("org-1", "admin-id")
    assert isinstance(out, OrganizationStatusResponse)
    assert out.id == "org-1"
    assert out.status == "active"


@pytest.mark.asyncio
async def test_suspend_organization_not_found_raises_404(service):
    """Suspend when org not found raises 404."""
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.suspend_organization("org-none", "admin-id")
    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail.lower() or "見つかりません" in exc_info.value.detail


@pytest.mark.asyncio
async def test_reactivate_organization_not_found_raises_404(service):
    """Reactivate when org not found raises 404."""
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.reactivate_organization("org-none", "admin-id")
    assert exc_info.value.status_code == 404


# --- Organization settings tests (Task 01-10) ---


@pytest.mark.asyncio
async def test_get_organization_success(service):
    """get_organization: returns org with merged details."""
    org_row = {
        "id": "org-1", "name": "Acme", "type": "buyer", "status": "active",
        "billing_email": "b@example.com", "billing_customer_id": None,
        "created_at": "2026-01-01T00:00:00Z", "updated_at": "2026-01-30T10:00:00Z",
    }
    details = {"org_id": "org-1", "industry": "IT", "employee_count": "50-100"}
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "get_buyer_details", new_callable=AsyncMock) as m_det:
            m_det.return_value = details
            out = await service.get_organization("org-1", "org-1")
    assert isinstance(out, OrganizationResponse)
    assert out.id == "org-1"
    assert out.industry == "IT"
    assert out.employee_count == "50-100"


@pytest.mark.asyncio
async def test_get_organization_org_mismatch_raises_403(service):
    """get_organization: raises 403 when org_id != user_org_id."""
    with pytest.raises(HTTPException) as exc_info:
        await service.get_organization("org-1", "org-other")
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_get_organization_not_found_raises_404(service):
    """get_organization: raises 404 when org not found."""
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.get_organization("org-1", "org-1")
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_update_organization_owner_success(service):
    """update_organization: owner can update."""
    org_row = {
        "id": "org-1", "name": "Acme", "type": "buyer", "status": "active",
        "billing_email": None, "billing_customer_id": None,
        "created_at": "2026-01-01T00:00:00Z", "updated_at": "2026-01-30T10:00:00Z",
    }
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "update_by_id", new_callable=AsyncMock):
            with patch.object(service.crud, "upsert_buyer_details", new_callable=AsyncMock):
                with patch.object(service.crud, "get_buyer_details", new_callable=AsyncMock) as m_det:
                    m_det.return_value = {"industry": "IT", "employee_count": "100-500"}
                    body = OrganizationUpdateRequest(
                        name="New Name", industry="IT", employee_count="100-500"
                    )
                    out = await service.update_organization(
                        "org-1", "user-1", "org-1", "owner", body
                    )
    assert isinstance(out, OrganizationResponse)


@pytest.mark.asyncio
async def test_update_organization_admin_success(service):
    """update_organization: admin can update."""
    org_row = {
        "id": "org-1", "name": "Acme", "type": "buyer", "status": "active",
        "billing_email": None, "billing_customer_id": None,
        "created_at": "2026-01-01T00:00:00Z", "updated_at": "2026-01-30T10:00:00Z",
    }
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "update_by_id", new_callable=AsyncMock):
            with patch.object(service.crud, "get_buyer_details", new_callable=AsyncMock) as m_det:
                m_det.return_value = None
                body = OrganizationUpdateRequest(name="Acme")
                out = await service.update_organization(
                    "org-1", "user-1", "org-1", "admin", body
                )
    assert isinstance(out, OrganizationResponse)


@pytest.mark.asyncio
async def test_update_organization_member_raises_403(service):
    """update_organization: member raises 403."""
    body = OrganizationUpdateRequest(name="Acme")
    with pytest.raises(HTTPException) as exc_info:
        await service.update_organization("org-1", "user-1", "org-1", "member", body)
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_update_organization_other_org_raises_403(service):
    """update_organization: other org raises 403."""
    body = OrganizationUpdateRequest(name="Acme")
    with pytest.raises(HTTPException) as exc_info:
        await service.update_organization("org-1", "user-1", "org-other", "owner", body)
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_get_org_details_buyer_success(service):
    """get_org_details: returns buyer details."""
    org_row = {"id": "org-1", "type": "buyer", "updated_at": "2026-01-30T10:00:00Z"}
    details = {"org_id": "org-1", "purpose": "RFI management", "updated_at": "2026-01-30T10:00:00Z"}
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "get_buyer_details", new_callable=AsyncMock) as m_det:
            m_det.return_value = details
            out = await service.get_org_details("org-1", "org-1")
    assert isinstance(out, OrgDetailsResponse)
    assert out.purpose == "RFI management"


@pytest.mark.asyncio
async def test_get_org_details_vendor_success(service):
    """get_org_details: returns vendor details."""
    org_row = {"id": "org-1", "type": "vendor", "updated_at": "2026-01-30T10:00:00Z"}
    details = {
        "org_id": "org-1", "business_description": "Software dev",
        "service_description": "Web apps", "website_url": "https://example.com",
        "updated_at": "2026-01-30T10:00:00Z",
    }
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "get_vendor_details", new_callable=AsyncMock) as m_det:
            m_det.return_value = details
            out = await service.get_org_details("org-1", "org-1")
    assert out.business_description == "Software dev"
    assert out.website_url == "https://example.com"


@pytest.mark.asyncio
async def test_update_org_details_owner_success(service):
    """update_org_details: owner can update."""
    org_row = {"id": "org-1", "type": "buyer", "updated_at": "2026-01-30T10:00:00Z"}
    with patch.object(service.crud, "get_by_id", new_callable=AsyncMock) as m_get:
        m_get.return_value = org_row
        with patch.object(service.crud, "upsert_buyer_details", new_callable=AsyncMock):
            with patch.object(service.crud, "get_buyer_details", new_callable=AsyncMock) as m_det:
                m_det.return_value = {"purpose": "Updated", "updated_at": "2026-01-30T10:00:00Z"}
                body = OrgDetailsUpdateRequest(purpose="Updated")
                out = await service.update_org_details("org-1", "user-1", "org-1", "owner", body)
    assert out.purpose == "Updated"


@pytest.mark.asyncio
async def test_update_org_details_member_raises_403(service):
    """update_org_details: member raises 403."""
    body = OrgDetailsUpdateRequest(purpose="x")
    with pytest.raises(HTTPException) as exc_info:
        await service.update_org_details("org-1", "user-1", "org-1", "member", body)
    assert exc_info.value.status_code == 403
