"""CRUD layer tests for Onboarding / Onboarding CRUD層テスト"""

import pytest
from unittest.mock import MagicMock
from app.crud.onboarding import OnboardingCRUD


@pytest.fixture
def mock_supabase():
    """Mock Supabase client / Supabaseクライアントのモック"""
    mock = MagicMock()
    return mock


@pytest.fixture
def onboarding_crud(mock_supabase):
    """OnboardingCRUD instance with mock."""
    return OnboardingCRUD(supabase=mock_supabase)


# ===========================================
# get_profile Tests / profile取得テスト
# ===========================================


@pytest.mark.asyncio
async def test_get_profile_pending(mock_supabase, onboarding_crud):
    """Test get pending profile / pending状態のprofile取得テスト"""
    # Arrange
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"org_id": None, "status": "pending"}
    )

    # Act
    result = await onboarding_crud.get_profile("user-uuid")

    # Assert
    assert result["org_id"] is None
    assert result["status"] == "pending"
    mock_supabase.table.assert_called_with("profiles")


@pytest.mark.asyncio
async def test_get_profile_with_org(mock_supabase, onboarding_crud):
    """Test get profile that already has org / 組織所属済みprofile取得テスト"""
    # Arrange
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data={"org_id": "org-uuid", "status": "active"}
    )

    # Act
    result = await onboarding_crud.get_profile("user-uuid")

    # Assert
    assert result["org_id"] == "org-uuid"
    assert result["status"] == "active"


@pytest.mark.asyncio
async def test_get_profile_not_found(mock_supabase, onboarding_crud):
    """Test get profile when not found / profile未存在時テスト"""
    # Arrange
    mock_supabase.table.return_value.select.return_value.eq.return_value.single.return_value.execute.return_value = MagicMock(
        data=None
    )

    # Act
    result = await onboarding_crud.get_profile("nonexistent-uuid")

    # Assert
    assert result is None


# ===========================================
# call_complete_buyer_onboarding_rpc Tests
# ===========================================


@pytest.mark.asyncio
async def test_call_complete_buyer_onboarding_rpc_success(
    mock_supabase, onboarding_crud
):
    """Test buyer onboarding RPC call / Buyer RPC呼び出しテスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={
            "organization_id": "org-uuid",
            "profile_id": "user-uuid",
            "application_id": "app-uuid",
            "status": "active",
        }
    )

    params = {
        "p_user_id": "user-uuid",
        "p_company_name": "Test Corp",
        "p_contact_email": "test@example.com",
        "p_display_name": "Test User",
        "p_billing_customer_id": "cus_123",
        "p_industry": "IT",
        "p_employee_count": "50-100",
        "p_purpose": "RFI management",
    }

    # Act
    result = await onboarding_crud.call_complete_buyer_onboarding_rpc(params)

    # Assert
    assert result["organization_id"] == "org-uuid"
    assert result["status"] == "active"
    mock_supabase.rpc.assert_called_once_with(
        "complete_buyer_onboarding", params
    )


@pytest.mark.asyncio
async def test_call_complete_buyer_onboarding_rpc_failure(
    mock_supabase, onboarding_crud
):
    """Test buyer RPC failure / Buyer RPC失敗テスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.side_effect = Exception(
        "RPC failed"
    )

    # Act & Assert
    with pytest.raises(Exception, match="RPC failed"):
        await onboarding_crud.call_complete_buyer_onboarding_rpc(
            {"p_user_id": "user-uuid"}
        )


# ===========================================
# call_complete_vendor_onboarding_rpc Tests
# ===========================================


@pytest.mark.asyncio
async def test_call_complete_vendor_onboarding_rpc_success(
    mock_supabase, onboarding_crud
):
    """Test vendor onboarding RPC call / Vendor RPC呼び出しテスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={
            "organization_id": "org-uuid",
            "profile_id": "user-uuid",
            "application_id": "app-uuid",
            "status": "active",
        }
    )

    params = {
        "p_user_id": "user-uuid",
        "p_company_name": "Vendor Corp",
        "p_contact_email": "vendor@example.com",
        "p_display_name": "Vendor User",
        "p_billing_customer_id": "cus_456",
        "p_industry": "IT",
        "p_employee_count": "10-50",
        "p_business_description": "Software development",
        "p_service_description": "Web app development",
        "p_website_url": "https://vendor.example.com",
    }

    # Act
    result = await onboarding_crud.call_complete_vendor_onboarding_rpc(params)

    # Assert
    assert result["organization_id"] == "org-uuid"
    mock_supabase.rpc.assert_called_once_with(
        "complete_vendor_onboarding", params
    )
