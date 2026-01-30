"""Unit tests for OrganizationService (mock CRUD) - suspend/reactivate."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException

from app.services.organization_service import OrganizationService
from app.schemas.organization import OrganizationStatusResponse


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
