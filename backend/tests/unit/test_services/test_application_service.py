"""Unit tests for ApplicationService (mock CRUD)."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException

from app.services.application_service import ApplicationService
from app.schemas.application import (
    ApplicationQueryParams,
    ApplicationListResponse,
    ApproveResponse,
    RejectResponse,
)


@pytest.fixture
def mock_supabase():
    return MagicMock()


@pytest.fixture
def service(mock_supabase):
    """ApplicationService with mocked Supabase (CRUD will be patched per test)."""
    return ApplicationService(mock_supabase)


# --- Test Case 1: 承認成功 (Approve success) ---
@pytest.mark.asyncio
async def test_approve_application_success(service):
    """Approve success returns ApproveResponse with correct fields."""
    result_data = {
        "status": "approved",
        "application_id": "app-111",
        "org_id": "org-111",
        "org_type": "vendor",
    }
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.return_value = result_data
        out = await service.approve_application("app-111", "admin-111")

    assert isinstance(out, ApproveResponse)
    assert out.status == "approved"
    assert out.application_id == "app-111"
    assert out.org_id == "org-111"
    assert out.org_type == "vendor"


# --- Test Case 2: 却下成功 (Reject success) ---
@pytest.mark.asyncio
async def test_reject_application_success(service):
    """Reject success returns RejectResponse; application status = rejected (by RPC)."""
    result_data = {
        "status": "rejected",
        "application_id": "app-222",
        "org_id": "org-222",
        "org_type": "buyer",
        "review_note": "Reason",
    }
    with patch.object(service.crud, "call_reject_application_rpc", new_callable=AsyncMock) as m:
        m.return_value = result_data
        out = await service.reject_application("app-222", "admin-222", review_note="Reason")

    assert isinstance(out, RejectResponse)
    assert out.status == "rejected"
    assert out.application_id == "app-222"
    assert out.review_note == "Reason"


# --- Test Case 3: 承認済み申請の再承認 (Already approved → Error) ---
@pytest.mark.asyncio
async def test_approve_application_already_approved_raises_409(service):
    """Re-approving an already approved application raises 409."""
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.side_effect = Exception("Application is not pending. Current status: approved")
        with pytest.raises(HTTPException) as exc_info:
            await service.approve_application("app-333", "admin-333")

    assert exc_info.value.status_code == 409
    assert "not pending" in exc_info.value.detail.lower() or "既に" in exc_info.value.detail


# --- Test Case 5: 存在しない申請ID (Application not found → 404) ---
@pytest.mark.asyncio
async def test_approve_application_not_found_raises_404(service):
    """Approving non-existent application raises 404."""
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.side_effect = Exception("Application not found: app-404")
        with pytest.raises(HTTPException) as exc_info:
            await service.approve_application("app-404", "admin-111")

    assert exc_info.value.status_code == 404
    assert "not found" in exc_info.value.detail.lower() or "見つかりません" in exc_info.value.detail


@pytest.mark.asyncio
async def test_reject_application_not_found_raises_404(service):
    """Rejecting non-existent application raises 404."""
    with patch.object(service.crud, "call_reject_application_rpc", new_callable=AsyncMock) as m:
        m.side_effect = Exception("Application not found: app-404")
        with pytest.raises(HTTPException) as exc_info:
            await service.reject_application("app-404", "admin-111")

    assert exc_info.value.status_code == 404


# --- list_applications ---
@pytest.mark.asyncio
async def test_list_applications_returns_application_list_response(service):
    """list_applications returns ApplicationListResponse with items and total_count."""
    params = ApplicationQueryParams(limit=10, offset=0)
    rows = [
        {
            "id": "id1",
            "org_id": "org1",
            "org_type": "buyer",
            "company_name": "Co1",
            "contact_email": "e1@x.com",
            "industry": None,
            "employee_count": None,
            "status": "pending",
            "reviewed_at": None,
            "created_at": "2024-01-01T00:00:00Z",
        }
    ]
    with patch.object(service.crud, "list_applications", new_callable=AsyncMock) as m:
        m.return_value = (rows, 1)
        out = await service.list_applications(params)

    assert isinstance(out, ApplicationListResponse)
    assert out.total_count == 1
    assert len(out.applications) == 1
    assert out.applications[0].id == "id1"
    assert out.applications[0].org_type == "buyer"
    assert out.applications[0].status == "pending"


# --- Approve/Reject: result None → 500 ---
@pytest.mark.asyncio
async def test_approve_application_result_none_raises_500(service):
    """Approval RPC returns None → 500."""
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.approve_application("app-x", "admin-x")
    assert exc_info.value.status_code == 500
    assert "承認" in exc_info.value.detail or "failed" in exc_info.value.detail.lower()


@pytest.mark.asyncio
async def test_reject_application_result_none_raises_500(service):
    """Rejection RPC returns None → 500."""
    with patch.object(service.crud, "call_reject_application_rpc", new_callable=AsyncMock) as m:
        m.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.reject_application("app-x", "admin-x")
    assert exc_info.value.status_code == 500
    assert "却下" in exc_info.value.detail or "failed" in exc_info.value.detail.lower()


# --- _map_rpc_error: generic → 400 ---
@pytest.mark.asyncio
async def test_map_rpc_error_generic_raises_400(service):
    """Unknown RPC error message → 400."""
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.side_effect = Exception("Some other database error")
        with pytest.raises(HTTPException) as exc_info:
            await service.approve_application("app-x", "admin-x")
    assert exc_info.value.status_code == 400
    assert "failed" in exc_info.value.detail.lower() or "失敗" in exc_info.value.detail


# --- ApproveResponse fallback keys ---
@pytest.mark.asyncio
async def test_approve_application_fallback_keys(service):
    """Approve with result missing org_type/application_id uses fallbacks."""
    result_data = {"status": "approved"}
    with patch.object(service.crud, "call_approve_application_rpc", new_callable=AsyncMock) as m:
        m.return_value = result_data
        out = await service.approve_application("app-fallback", "admin-1")
    assert out.status == "approved"
    assert out.application_id == "app-fallback"
    assert out.org_id == ""
    assert out.org_type == "buyer"


# --- list_applications empty rows ---
@pytest.mark.asyncio
async def test_list_applications_empty_returns_zero_count(service):
    """list_applications with no rows returns total_count=0."""
    params = ApplicationQueryParams(limit=10, offset=0)
    with patch.object(service.crud, "list_applications", new_callable=AsyncMock) as m:
        m.return_value = ([], 0)
        out = await service.list_applications(params)
    assert out.total_count == 0
    assert out.applications == []
