"""Onboarding schema validation tests."""

import pytest
from pydantic import ValidationError

from app.schemas.onboarding import (
    BuyerOnboardingRequest,
    VendorOnboardingRequest,
)


class TestBuyerOnboardingValidation:
    """Tests for BuyerOnboardingRequest schema validation."""

    @pytest.fixture
    def valid_buyer_data(self):
        """Valid buyer onboarding data."""
        return {
            "company_name": "Test Company",
            "display_name": "Test User",
            "contact_email": "test@example.com",
            "industry": "IT",
            "employee_count": "50-100",
            "purpose": "To use the platform for RFI management",
        }

    def test_valid_request(self, valid_buyer_data):
        """Valid data passes."""
        data = BuyerOnboardingRequest(**valid_buyer_data)
        assert data.company_name == "Test Company"

    def test_company_name_required(self, valid_buyer_data):
        """company_name is required."""
        del valid_buyer_data["company_name"]
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "company_name" in str(exc_info.value)

    def test_company_name_empty(self, valid_buyer_data):
        """Empty company_name fails (min_length=1)."""
        valid_buyer_data["company_name"] = ""
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at least 1 character" in str(exc_info.value)

    def test_company_name_too_long(self, valid_buyer_data):
        """company_name over 255 chars fails."""
        valid_buyer_data["company_name"] = "x" * 256
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at most 255 characters" in str(exc_info.value)

    def test_display_name_too_long(self, valid_buyer_data):
        """display_name over 100 chars fails."""
        valid_buyer_data["display_name"] = "x" * 101
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at most 100 characters" in str(exc_info.value)

    def test_invalid_email(self, valid_buyer_data):
        """Invalid email fails."""
        valid_buyer_data["contact_email"] = "not-an-email"
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "value is not a valid email address" in str(exc_info.value)

    def test_industry_too_long(self, valid_buyer_data):
        """industry over 100 chars fails."""
        valid_buyer_data["industry"] = "x" * 101
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at most 100 characters" in str(exc_info.value)

    def test_employee_count_too_long(self, valid_buyer_data):
        """employee_count over 50 chars fails."""
        valid_buyer_data["employee_count"] = "x" * 51
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at most 50 characters" in str(exc_info.value)

    def test_purpose_too_long(self, valid_buyer_data):
        """purpose over 1000 chars fails."""
        valid_buyer_data["purpose"] = "x" * 1001
        with pytest.raises(ValidationError) as exc_info:
            BuyerOnboardingRequest(**valid_buyer_data)
        assert "String should have at most 1000 characters" in str(exc_info.value)

    def test_purpose_exactly_1000_chars(self, valid_buyer_data):
        """purpose exactly 1000 chars passes."""
        valid_buyer_data["purpose"] = "x" * 1000
        data = BuyerOnboardingRequest(**valid_buyer_data)
        assert len(data.purpose) == 1000


class TestVendorOnboardingValidation:
    """Tests for VendorOnboardingRequest schema validation."""

    @pytest.fixture
    def valid_vendor_data(self):
        """Valid vendor onboarding data."""
        return {
            "company_name": "Vendor Corp",
            "display_name": "Vendor User",
            "contact_email": "vendor@example.com",
            "industry": "Software",
            "employee_count": "100-500",
            "business_description": "We provide software solutions",
            "service_description": "Cloud-based SaaS platform",
            "website_url": "https://example.com",
        }

    def test_valid_request(self, valid_vendor_data):
        """Valid data passes."""
        data = VendorOnboardingRequest(**valid_vendor_data)
        assert data.company_name == "Vendor Corp"

    def test_business_description_too_long(self, valid_vendor_data):
        """business_description over 2000 chars fails."""
        valid_vendor_data["business_description"] = "x" * 2001
        with pytest.raises(ValidationError) as exc_info:
            VendorOnboardingRequest(**valid_vendor_data)
        assert "String should have at most 2000 characters" in str(exc_info.value)

    def test_service_description_too_long(self, valid_vendor_data):
        """service_description over 2000 chars fails."""
        valid_vendor_data["service_description"] = "x" * 2001
        with pytest.raises(ValidationError) as exc_info:
            VendorOnboardingRequest(**valid_vendor_data)
        assert "String should have at most 2000 characters" in str(exc_info.value)

    def test_invalid_website_url(self, valid_vendor_data):
        """Invalid URL fails."""
        valid_vendor_data["website_url"] = "not-a-url"
        with pytest.raises(ValidationError) as exc_info:
            VendorOnboardingRequest(**valid_vendor_data)
        assert "URL" in str(exc_info.value) or "url" in str(exc_info.value).lower()

    def test_website_url_http(self, valid_vendor_data):
        """HTTP URL passes."""
        valid_vendor_data["website_url"] = "http://example.com"
        data = VendorOnboardingRequest(**valid_vendor_data)
        assert str(data.website_url) == "http://example.com/"

    def test_website_url_required(self, valid_vendor_data):
        """website_url is required."""
        del valid_vendor_data["website_url"]
        with pytest.raises(ValidationError) as exc_info:
            VendorOnboardingRequest(**valid_vendor_data)
        assert "website_url" in str(exc_info.value)

    def test_all_fields_required(self):
        """All fields are required."""
        with pytest.raises(ValidationError) as exc_info:
            VendorOnboardingRequest()
        errors = str(exc_info.value)
        assert "company_name" in errors
        assert "display_name" in errors
        assert "contact_email" in errors
