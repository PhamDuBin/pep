"""Onboarding service (business logic)."""

import stripe
from supabase import Client

from app.core.config import get_settings
from app.crud.onboarding import OnboardingCRUD
from app.schemas.onboarding import (
    BuyerOnboardingRequest,
    OnboardingResponse,
    VendorOnboardingRequest,
)


class OnboardingService:
    """Service for user onboarding.

    ビジネスロジックを担当。外部API(Stripe)呼び出しとCRUD層への委譲。
    """

    def __init__(self, supabase: Client):
        self.crud = OnboardingCRUD(supabase)
        settings = get_settings()
        stripe.api_key = settings.stripe_secret_key

    async def complete_buyer_onboarding(
        self,
        user_id: str,
        email: str,
        request: BuyerOnboardingRequest,
    ) -> OnboardingResponse:
        """
        Complete buyer onboarding in a transaction.

        Steps:
        1. Verify user has no organization yet (via CRUD)
        2. Create Stripe Customer (external API)
        3. Call complete_buyer_onboarding RPC (via CRUD)
        """
        await self._verify_no_organization(user_id)

        # Create Stripe Customer (external API = Service layer responsibility)
        stripe_customer = stripe.Customer.create(
            email=email,
            name=request.company_name,
            metadata={"user_id": user_id, "org_type": "buyer"},
        )

        # Call RPC via CRUD layer
        result = await self.crud.call_complete_buyer_onboarding_rpc(
            {
                "p_user_id": user_id,
                "p_company_name": request.company_name,
                "p_contact_email": request.contact_email,
                "p_display_name": request.display_name,
                "p_billing_customer_id": stripe_customer.id,
                "p_industry": request.industry,
                "p_employee_count": request.employee_count,
                "p_purpose": request.purpose,
            }
        )

        if result is None:
            raise ValueError("Buyer onboarding RPC failed")

        return OnboardingResponse(
            organization_id=result["organization_id"],
            profile_id=result["profile_id"],
            application_id=result["application_id"],
            status=result["status"],
        )

    async def complete_vendor_onboarding(
        self,
        user_id: str,
        email: str,
        request: VendorOnboardingRequest,
    ) -> OnboardingResponse:
        """
        Complete vendor onboarding in a transaction.

        Steps:
        1. Verify user has no organization yet (via CRUD)
        2. Create Stripe Customer (external API)
        3. Call complete_vendor_onboarding RPC (via CRUD)
        """
        await self._verify_no_organization(user_id)

        # Create Stripe Customer (external API = Service layer responsibility)
        stripe_customer = stripe.Customer.create(
            email=email,
            name=request.company_name,
            metadata={"user_id": user_id, "org_type": "vendor"},
        )

        # Call RPC via CRUD layer
        result = await self.crud.call_complete_vendor_onboarding_rpc(
            {
                "p_user_id": user_id,
                "p_company_name": request.company_name,
                "p_contact_email": request.contact_email,
                "p_display_name": request.display_name,
                "p_billing_customer_id": stripe_customer.id,
                "p_industry": request.industry,
                "p_employee_count": request.employee_count,
                "p_business_description": request.business_description,
                "p_service_description": request.service_description,
                "p_website_url": str(request.website_url),
            }
        )

        if result is None:
            raise ValueError("Vendor onboarding RPC failed")

        return OnboardingResponse(
            organization_id=result["organization_id"],
            profile_id=result["profile_id"],
            application_id=result["application_id"],
            status=result["status"],
        )

    async def _verify_no_organization(self, user_id: str) -> None:
        """
        Verify user has no organization yet (via CRUD).

        組織未所属を確認。既に組織に所属している場合はエラー。
        """
        profile = await self.crud.get_profile(user_id)

        if not profile:
            raise ValueError("Profile not found. Please contact support.")

        if profile["org_id"] is not None:
            raise ValueError("User already has an organization.")
