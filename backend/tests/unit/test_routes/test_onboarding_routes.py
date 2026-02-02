"""Unit tests for onboarding routes."""

import pytest
from unittest.mock import AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.api.routes.onboarding import get_onboarding_service
from app.core.security import get_current_user_for_onboarding
from app.schemas.onboarding import OnboardingResponse


@pytest.fixture
def mock_current_user():
    """Mock authenticated user / 認証済みユーザーのモック"""
    return {"id": "user-uuid", "email": "test@example.com"}


@pytest.fixture
def mock_onboarding_service():
    """Mock OnboardingService."""
    return AsyncMock()


@pytest.mark.asyncio
async def test_complete_buyer_onboarding_success(
    mock_current_user, mock_onboarding_service
):
    """Test successful buyer onboarding API call."""
    # Arrange
    mock_onboarding_service.complete_buyer_onboarding.return_value = (
        OnboardingResponse(
            organization_id="org-uuid",
            profile_id="user-uuid",
            application_id="app-uuid",
            status="active",
        )
    )

    app.dependency_overrides[get_current_user_for_onboarding] = (
        lambda: mock_current_user
    )
    app.dependency_overrides[get_onboarding_service] = (
        lambda: mock_onboarding_service
    )

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(
            transport=transport, base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/v1/auth/onboarding/buyer",
                json={
                    "company_name": "Test Corp",
                    "display_name": "Test User",
                    "contact_email": "test@example.com",
                    "industry": "IT",
                    "employee_count": "50-100",
                    "purpose": "RFI management",
                },
                headers={"Authorization": "Bearer test-token"},
            )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["organization_id"] == "org-uuid"
        assert data["status"] == "active"

    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_complete_vendor_onboarding_success(
    mock_current_user, mock_onboarding_service
):
    """Test successful vendor onboarding API call."""
    # Arrange
    mock_onboarding_service.complete_vendor_onboarding.return_value = (
        OnboardingResponse(
            organization_id="org-uuid",
            profile_id="user-uuid",
            application_id="app-uuid",
            status="active",
        )
    )

    app.dependency_overrides[get_current_user_for_onboarding] = (
        lambda: mock_current_user
    )
    app.dependency_overrides[get_onboarding_service] = (
        lambda: mock_onboarding_service
    )

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(
            transport=transport, base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/v1/auth/onboarding/vendor",
                json={
                    "company_name": "Vendor Corp",
                    "display_name": "Vendor User",
                    "contact_email": "vendor@example.com",
                    "industry": "IT",
                    "employee_count": "10-50",
                    "business_description": "Software development company",
                    "service_description": "Web application development",
                    "website_url": "https://vendor.example.com",
                },
                headers={"Authorization": "Bearer test-token"},
            )

        # Assert
        assert response.status_code == 200
        data = response.json()
        assert data["organization_id"] == "org-uuid"
        assert data["status"] == "active"

    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_buyer_onboarding_missing_required_field():
    """Test buyer onboarding fails with missing required field."""
    mock_current_user = {"id": "user-uuid", "email": "test@example.com"}
    app.dependency_overrides[get_current_user_for_onboarding] = (
        lambda: mock_current_user
    )

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(
            transport=transport, base_url="http://test"
        ) as client:
            response = await client.post(
                "/api/v1/auth/onboarding/buyer",
                json={
                    "company_name": "Test Corp",
                    "display_name": "Test User",
                    "contact_email": "test@example.com",
                    "industry": "IT",
                    "employee_count": "50-100",
                    # purpose is missing (required)
                },
                headers={"Authorization": "Bearer test-token"},
            )

        # Assert
        assert response.status_code == 422  # Validation error

    finally:
        app.dependency_overrides.clear()
