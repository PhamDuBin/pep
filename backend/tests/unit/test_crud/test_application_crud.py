"""Unit tests for ApplicationCRUD (mock Supabase)."""

import pytest
from unittest.mock import MagicMock

from app.crud.application_crud import ApplicationCRUD
from app.schemas.application import ApplicationQueryParams


@pytest.fixture
def mock_supabase():
    """Mock Supabase client for ApplicationCRUD."""
    return MagicMock()


@pytest.fixture
def crud(mock_supabase):
    """ApplicationCRUD instance with mocked Supabase."""
    return ApplicationCRUD(mock_supabase)


@pytest.mark.asyncio
async def test_call_approve_application_rpc_invokes_supabase(crud, mock_supabase):
    """RPC invoke: approve_application is called with correct args."""
    mock_supabase.rpc.return_value.execute.return_value.data = {
        "status": "approved",
        "application_id": "app-uuid-1",
        "org_id": "org-uuid-1",
        "org_type": "buyer",
    }
    result = await crud.call_approve_application_rpc("app-uuid-1", "admin-uuid-1")

    mock_supabase.rpc.assert_called_once_with(
        "approve_application",
        {"p_application_id": "app-uuid-1", "p_admin_id": "admin-uuid-1"},
    )
    assert result["status"] == "approved"
    assert result["application_id"] == "app-uuid-1"
    assert result["org_id"] == "org-uuid-1"
    assert result["org_type"] == "buyer"


@pytest.mark.asyncio
async def test_call_reject_application_rpc_invokes_supabase(crud, mock_supabase):
    """RPC invoke: reject_application is called with correct args."""
    mock_supabase.rpc.return_value.execute.return_value.data = {
        "status": "rejected",
        "application_id": "app-uuid-2",
        "org_id": "org-uuid-2",
        "org_type": "vendor",
        "review_note": "Not qualified",
    }
    result = await crud.call_reject_application_rpc(
        "app-uuid-2", "admin-uuid-2", review_note="Not qualified"
    )

    mock_supabase.rpc.assert_called_once_with(
        "reject_application",
        {
            "p_application_id": "app-uuid-2",
            "p_admin_id": "admin-uuid-2",
            "p_review_note": "Not qualified",
        },
    )
    assert result["status"] == "rejected"
    assert result["review_note"] == "Not qualified"


@pytest.mark.asyncio
async def test_call_reject_application_rpc_without_review_note(crud, mock_supabase):
    """RPC invoke: reject_application with no review_note passes None."""
    mock_supabase.rpc.return_value.execute.return_value.data = {
        "status": "rejected",
        "application_id": "app-uuid-3",
        "org_id": "org-uuid-3",
        "org_type": "buyer",
        "review_note": None,
    }
    await crud.call_reject_application_rpc("app-uuid-3", "admin-uuid-3")

    mock_supabase.rpc.assert_called_once_with(
        "reject_application",
        {"p_application_id": "app-uuid-3", "p_admin_id": "admin-uuid-3", "p_review_note": None},
    )


@pytest.mark.asyncio
async def test_list_applications_buyer_queries_buyer_table(crud, mock_supabase):
    """list_applications with org_type=buyer queries buyer_applications."""
    params = ApplicationQueryParams(org_type="buyer", limit=10, offset=0)
    mock_chain = MagicMock()
    mock_chain.range.return_value.execute.return_value.data = [
        {"id": "a1", "org_id": "o1", "company_name": "C1", "contact_email": "e1@x.com",
         "industry": None, "employee_count": None, "status": "pending",
         "reviewed_at": None, "created_at": "2024-01-01T00:00:00Z"}
    ]
    mock_chain.range.return_value.execute.return_value.count = 1
    mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value = mock_chain

    rows, total = await crud.list_applications(params)

    mock_supabase.table.assert_called_with("buyer_applications")
    assert total == 1
    assert len(rows) == 1
    assert rows[0]["org_type"] == "buyer"


@pytest.mark.asyncio
async def test_list_applications_vendor_queries_vendor_table(crud, mock_supabase):
    """list_applications with org_type=vendor queries vendor_applications."""
    params = ApplicationQueryParams(org_type="vendor", limit=5, offset=0)
    mock_chain = MagicMock()
    mock_chain.range.return_value.execute.return_value.data = []
    mock_chain.range.return_value.execute.return_value.count = 0
    mock_supabase.table.return_value.select.return_value.eq.return_value.order.return_value = mock_chain

    rows, total = await crud.list_applications(params)

    mock_supabase.table.assert_called_with("vendor_applications")
    assert total == 0
    assert rows == []


@pytest.mark.asyncio
async def test_list_applications_org_type_none_merges_both(crud, mock_supabase):
    """list_applications with org_type=None merges buyer + vendor and paginates."""
    params = ApplicationQueryParams(org_type=None, limit=10, offset=0)
    buyer_data = [
        {"id": "b1", "org_id": "o1", "company_name": "B1", "contact_email": "b1@x.com",
         "industry": None, "employee_count": None, "status": "pending",
         "reviewed_at": None, "created_at": "2024-01-02T00:00:00Z"}
    ]
    vendor_data = [
        {"id": "v1", "org_id": "o2", "company_name": "V1", "contact_email": "v1@x.com",
         "industry": None, "employee_count": None, "status": "pending",
         "reviewed_at": None, "created_at": "2024-01-01T00:00:00Z"}
    ]
    chain_b = MagicMock()
    chain_b.execute.return_value.data = buyer_data
    chain_v = MagicMock()
    chain_v.execute.return_value.data = vendor_data

    def table_side_effect(name):
        chain = MagicMock()
        chain.select.return_value.eq.return_value.order.return_value = chain
        res = MagicMock()
        res.data = buyer_data if name == "buyer_applications" else vendor_data
        chain.execute.return_value = res
        return chain

    mock_supabase.table.side_effect = table_side_effect

    rows, total = await crud.list_applications(params)

    assert total == 2
    assert len(rows) == 2
    assert rows[0]["org_type"] == "buyer"
    assert rows[1]["org_type"] == "vendor"
