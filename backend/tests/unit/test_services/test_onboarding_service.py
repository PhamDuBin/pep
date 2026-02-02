"""Unit tests for onboarding service."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.onboarding_service import OnboardingService
from app.schemas.onboarding import BuyerOnboardingRequest, VendorOnboardingRequest


@pytest.fixture
def mock_supabase():
    """Mock Supabase client / Supabaseクライアントのモック"""
    return MagicMock()


@pytest.fixture
def mock_onboarding_crud():
    """Mock OnboardingCRUD / OnboardingCRUDのモック"""
    return AsyncMock()


@pytest.fixture
def onboarding_service(mock_supabase, mock_onboarding_crud):
    """OnboardingService with mocked CRUD."""
    with patch(
        "app.services.onboarding_service.OnboardingCRUD",
        return_value=mock_onboarding_crud,
    ):
        service = OnboardingService(mock_supabase)
    service.crud = mock_onboarding_crud
    return service


@pytest.mark.asyncio
async def test_complete_buyer_onboarding_success(
    mock_onboarding_crud, onboarding_service
):
    """Test successful buyer onboarding completion."""
    # Arrange - Mock CRUD responses
    mock_onboarding_crud.get_profile.return_value = {
        "org_id": None,
        "status": "pending",
    }
    mock_onboarding_crud.call_complete_buyer_onboarding_rpc.return_value = {
        "organization_id": "org-uuid",
        "profile_id": "user-uuid",
        "application_id": "app-uuid",
        "status": "active",
    }

    request = BuyerOnboardingRequest(
        company_name="Test Corp",
        display_name="Test User",
        contact_email="test@example.com",
        industry="IT",
        employee_count="50-100",
        purpose="RFI management",
    )

    with patch("stripe.Customer.create") as mock_stripe:
        mock_stripe.return_value = MagicMock(id="cus_123")

        # Act
        result = await onboarding_service.complete_buyer_onboarding(
            user_id="user-uuid",
            email="test@example.com",
            request=request,
        )

        # Assert
        assert result.organization_id == "org-uuid"
        assert result.status == "active"
        mock_stripe.assert_called_once()
        mock_onboarding_crud.get_profile.assert_called_once_with("user-uuid")
        mock_onboarding_crud.call_complete_buyer_onboarding_rpc.assert_called_once_with(
            {
                "p_user_id": "user-uuid",
                "p_company_name": "Test Corp",
                "p_contact_email": "test@example.com",
                "p_display_name": "Test User",
                "p_billing_customer_id": "cus_123",
                "p_industry": "IT",
                "p_employee_count": "50-100",
                "p_purpose": "RFI management",
            }
        )


@pytest.mark.asyncio
async def test_complete_vendor_onboarding_success(
    mock_onboarding_crud, onboarding_service
):
    """Test successful vendor onboarding completion."""
    # Arrange - Mock CRUD responses
    mock_onboarding_crud.get_profile.return_value = {
        "org_id": None,
        "status": "pending",
    }
    mock_onboarding_crud.call_complete_vendor_onboarding_rpc.return_value = {
        "organization_id": "org-uuid",
        "profile_id": "user-uuid",
        "application_id": "app-uuid",
        "status": "active",
    }

    request = VendorOnboardingRequest(
        company_name="Vendor Corp",
        display_name="Vendor User",
        contact_email="vendor@example.com",
        industry="IT",
        employee_count="10-50",
        business_description="Software development company",
        service_description="Web application development",
        website_url="https://vendor.example.com",
    )

    with patch("stripe.Customer.create") as mock_stripe:
        mock_stripe.return_value = MagicMock(id="cus_456")

        # Act
        result = await onboarding_service.complete_vendor_onboarding(
            user_id="user-uuid",
            email="vendor@example.com",
            request=request,
        )

        # Assert
        assert result.organization_id == "org-uuid"
        assert result.status == "active"
        mock_stripe.assert_called_once()
        mock_onboarding_crud.call_complete_vendor_onboarding_rpc.assert_called_once()


@pytest.mark.asyncio
async def test_complete_onboarding_already_has_org(
    mock_onboarding_crud, onboarding_service
):
    """Test onboarding fails if user already has organization."""
    # Arrange
    mock_onboarding_crud.get_profile.return_value = {
        "org_id": "existing-org",
        "status": "active",
    }

    request = BuyerOnboardingRequest(
        company_name="Test Corp",
        display_name="Test User",
        contact_email="test@example.com",
        industry="IT",
        employee_count="50-100",
        purpose="RFI management",
    )

    # Act & Assert
    with pytest.raises(ValueError, match="already has an organization"):
        await onboarding_service.complete_buyer_onboarding(
            user_id="user-uuid",
            email="test@example.com",
            request=request,
        )


@pytest.mark.asyncio
async def test_complete_onboarding_profile_not_found(
    mock_onboarding_crud, onboarding_service
):
    """Test onboarding fails if profile not found."""
    # Arrange
    mock_onboarding_crud.get_profile.return_value = None

    request = BuyerOnboardingRequest(
        company_name="Test Corp",
        display_name="Test User",
        contact_email="test@example.com",
        industry="IT",
        employee_count="50-100",
        purpose="RFI management",
    )

    # Act & Assert
    with pytest.raises(ValueError, match="Profile not found"):
        await onboarding_service.complete_buyer_onboarding(
            user_id="user-uuid",
            email="test@example.com",
            request=request,
        )
