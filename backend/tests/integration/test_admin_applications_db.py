"""
Integration tests for 002 Application Approval (real Supabase).

Requires:
  - backend/.env with SUPABASE_URL, SUPABASE_SERVICE_KEY
  - Network access to your Supabase project

Run (from backend dir):
  pytest tests/test_db.py tests/integration/ -v
  # or only integration: pytest tests/integration/ -v -m integration
"""

import pytest

from app.core.supabase import get_supabase_client
from app.schemas.application import ApplicationQueryParams
from app.crud.application_crud import ApplicationCRUD


@pytest.mark.integration
def test_profiles_has_is_platform_admin_column():
    """profiles.is_platform_admin column exists (from migration)."""
    supabase = get_supabase_client()
    result = supabase.table("profiles").select("id, is_platform_admin").limit(1).execute()
    assert result is not None
    assert result.data is not None
    if result.data:
        assert "is_platform_admin" in result.data[0]


@pytest.mark.integration
def test_buyer_applications_table_accessible():
    """buyer_applications table exists and is queryable."""
    supabase = get_supabase_client()
    result = supabase.table("buyer_applications").select(
        "id, org_id, company_name, status, created_at"
    ).eq("is_deleted", False).limit(1).execute()
    assert result is not None
    assert result.data is not None


@pytest.mark.integration
def test_vendor_applications_table_accessible():
    """vendor_applications table exists and is queryable."""
    supabase = get_supabase_client()
    result = supabase.table("vendor_applications").select(
        "id, org_id, company_name, status, created_at"
    ).eq("is_deleted", False).limit(1).execute()
    assert result is not None
    assert result.data is not None


@pytest.mark.integration
def test_approve_application_rpc_callable():
    """approve_application RPC exists and returns 'Application not found' for invalid id."""
    supabase = get_supabase_client()
    try:
        supabase.rpc(
            "approve_application",
            {"p_application_id": "00000000-0000-0000-0000-000000000000", "p_admin_id": "00000000-0000-0000-0000-000000000001"},
        ).execute()
        pytest.fail("Expected RPC to raise for non-existent application")
    except Exception as e:
        assert "Application not found" in str(e) or "not found" in str(e).lower()


@pytest.mark.integration
def test_reject_application_rpc_callable():
    """reject_application RPC exists and returns 'Application not found' for invalid id."""
    supabase = get_supabase_client()
    try:
        supabase.rpc(
            "reject_application",
            {"p_application_id": "00000000-0000-0000-0000-000000000000", "p_admin_id": "00000000-0000-0000-0000-000000000001", "p_review_note": None},
        ).execute()
        pytest.fail("Expected RPC to raise for non-existent application")
    except Exception as e:
        assert "Application not found" in str(e) or "not found" in str(e).lower()


@pytest.mark.integration
@pytest.mark.asyncio
async def test_crud_list_applications_against_real_db():
    """ApplicationCRUD.list_applications runs against real DB without error."""
    supabase = get_supabase_client()
    crud = ApplicationCRUD(supabase)
    params = ApplicationQueryParams(org_type="buyer", limit=5, offset=0)
    rows, total = await crud.list_applications(params)
    assert isinstance(rows, list)
    assert isinstance(total, int)
    assert total >= 0
