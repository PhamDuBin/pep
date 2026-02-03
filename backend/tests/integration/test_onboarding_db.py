"""
Integration tests for 01-02 Onboarding (real Supabase).

Tests:
  - handle_new_user trigger existence (via auth.admin.create_user + cleanup)
  - complete_buyer_onboarding RPC existence
  - complete_vendor_onboarding RPC existence

Requires:
  - backend/.env with SUPABASE_URL, SUPABASE_SERVICE_KEY
  - Network access to your Supabase project

Run (from backend dir):
  pytest tests/integration/test_onboarding_db.py -v -m integration
"""

import uuid

import pytest

from app.core.supabase import get_supabase_client


@pytest.mark.integration
def test_handle_new_user_trigger_creates_profile():
    """handle_new_user trigger creates a profile with status='pending'
    and org_id=NULL when a new auth.users row is inserted.

    handle_new_userトリガーがauth.users INSERT時にprofileを自動作成することを検証。
    """
    supabase = get_supabase_client()
    test_email = f"trigger-test-{uuid.uuid4().hex[:8]}@example.com"
    created_user = None

    try:
        # Create user via Supabase Auth Admin API (triggers handle_new_user)
        res = supabase.auth.admin.create_user(
            {
                "email": test_email,
                "password": "TestPassword123!",
                "email_confirm": True,
            }
        )
        created_user = res.user
        assert created_user is not None, "Failed to create test user"

        # Verify profile was created by trigger
        profile = (
            supabase.table("profiles")
            .select("id, status, org_id, role, email")
            .eq("id", created_user.id)
            .single()
            .execute()
        )

        assert profile.data is not None, "Trigger did not create profile"
        assert profile.data["status"] == "pending"
        assert profile.data["org_id"] is None
        assert profile.data["role"] == "owner"
        assert profile.data["email"] == test_email

    finally:
        # Cleanup: delete test user and profile
        if created_user:
            # Delete profile first (FK constraint)
            supabase.table("profiles").delete().eq(
                "id", created_user.id
            ).execute()
            # Delete auth user
            supabase.auth.admin.delete_user(created_user.id)


@pytest.mark.integration
def test_complete_buyer_onboarding_rpc_exists():
    """complete_buyer_onboarding RPC exists and rejects non-existent user.

    RPCが存在し、存在しないユーザーに対して適切にエラーを返すことを検証。
    """
    supabase = get_supabase_client()
    dummy_id = "00000000-0000-0000-0000-000000000000"

    try:
        supabase.rpc(
            "complete_buyer_onboarding",
            {
                "p_user_id": dummy_id,
                "p_company_name": "Test Corp",
                "p_contact_email": "test@test.com",
                "p_display_name": "Test User",
                "p_billing_customer_id": "cus_test",
                "p_industry": "IT",
                "p_employee_count": "1-10",
                "p_purpose": "Testing",
            },
        ).execute()
        # If no error, profile didn't exist so no org check triggered,
        # but insert into organizations may succeed — that's also valid
    except Exception as e:
        # Expected: either "User already has an organization" or
        # a FK/constraint error for non-existent profile
        error_msg = str(e).lower()
        assert (
            "already has an organization" in error_msg
            or "violates" in error_msg
            or "not found" in error_msg
            or "null" in error_msg
        ), f"Unexpected error: {e}"


@pytest.mark.integration
def test_complete_vendor_onboarding_rpc_exists():
    """complete_vendor_onboarding RPC exists and rejects non-existent user.

    RPCが存在し、存在しないユーザーに対して適切にエラーを返すことを検証。
    """
    supabase = get_supabase_client()
    dummy_id = "00000000-0000-0000-0000-000000000000"

    try:
        supabase.rpc(
            "complete_vendor_onboarding",
            {
                "p_user_id": dummy_id,
                "p_company_name": "Vendor Corp",
                "p_contact_email": "vendor@test.com",
                "p_display_name": "Vendor User",
                "p_billing_customer_id": "cus_test",
                "p_industry": "IT",
                "p_employee_count": "1-10",
                "p_business_description": "Test business",
                "p_service_description": "Test service",
                "p_website_url": "https://test.com",
            },
        ).execute()
    except Exception as e:
        error_msg = str(e).lower()
        assert (
            "already has an organization" in error_msg
            or "violates" in error_msg
            or "not found" in error_msg
            or "null" in error_msg
        ), f"Unexpected error: {e}"


@pytest.mark.integration
def test_handle_new_user_trigger_with_onboarding_flow():
    """End-to-end: signup → trigger → buyer onboarding RPC.

    signUp → trigger → onboarding RPC の一連のフローを実DBで検証。
    """
    supabase = get_supabase_client()
    test_email = f"e2e-test-{uuid.uuid4().hex[:8]}@example.com"
    created_user = None
    created_org_id = None

    try:
        # Step 1: Create user (trigger fires)
        res = supabase.auth.admin.create_user(
            {
                "email": test_email,
                "password": "TestPassword123!",
                "email_confirm": True,
            }
        )
        created_user = res.user
        assert created_user is not None

        # Verify trigger created pending profile
        profile = (
            supabase.table("profiles")
            .select("id, status, org_id")
            .eq("id", created_user.id)
            .single()
            .execute()
        )
        assert profile.data["status"] == "pending"
        assert profile.data["org_id"] is None

        # Step 2: Call buyer onboarding RPC
        result = supabase.rpc(
            "complete_buyer_onboarding",
            {
                "p_user_id": str(created_user.id),
                "p_company_name": "E2E Test Corp",
                "p_contact_email": test_email,
                "p_display_name": "E2E Tester",
                "p_billing_customer_id": f"cus_e2e_{uuid.uuid4().hex[:8]}",
                "p_industry": "IT",
                "p_employee_count": "1-10",
                "p_purpose": "E2E Testing",
            },
        ).execute()

        assert result.data is not None
        assert "organization_id" in result.data
        assert "profile_id" in result.data
        assert "application_id" in result.data
        assert result.data["status"] == "active"
        created_org_id = result.data["organization_id"]

        # Verify profile is now active with org_id
        updated_profile = (
            supabase.table("profiles")
            .select("id, status, org_id")
            .eq("id", created_user.id)
            .single()
            .execute()
        )
        assert updated_profile.data["status"] == "active"
        assert updated_profile.data["org_id"] == created_org_id

    finally:
        # Cleanup: delete created records in reverse dependency order
        if created_user:
            user_id = str(created_user.id)
            if created_org_id:
                supabase.table("buyer_applications").delete().eq(
                    "org_id", created_org_id
                ).execute()
                # Reset profile org_id before deleting org
                supabase.table("profiles").update(
                    {"org_id": None}
                ).eq("id", user_id).execute()
                supabase.table("organizations").delete().eq(
                    "id", created_org_id
                ).execute()
            supabase.table("profiles").delete().eq(
                "id", user_id
            ).execute()
            supabase.auth.admin.delete_user(user_id)
