"""Onboarding API routes."""

from fastapi import APIRouter, Depends, HTTPException

from app.core.security import get_current_user_for_onboarding
from app.core.supabase import get_supabase
from app.schemas.onboarding import (
    BuyerOnboardingRequest,
    OnboardingResponse,
    VendorOnboardingRequest,
)
from app.services.onboarding_service import OnboardingService

router = APIRouter()


def get_onboarding_service(supabase=Depends(get_supabase)) -> OnboardingService:
    """Dependency to get OnboardingService instance."""
    return OnboardingService(supabase)


@router.post(
    "/onboarding/buyer", response_model=OnboardingResponse, status_code=200
)
async def complete_buyer_onboarding(
    request: BuyerOnboardingRequest,
    current_user: dict = Depends(get_current_user_for_onboarding),
    service: OnboardingService = Depends(get_onboarding_service),
) -> OnboardingResponse:
    """
    Complete buyer onboarding.

    Buyerのオンボーディングを完了する。

    - Creates buyer organization
    - Updates profile to active
    - Creates buyer application
    - Creates Stripe customer
    """
    try:
        result = await service.complete_buyer_onboarding(
            user_id=current_user["id"],
            email=current_user["email"],
            request=request,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Buyer onboarding failed")


@router.post(
    "/onboarding/vendor", response_model=OnboardingResponse, status_code=200
)
async def complete_vendor_onboarding(
    request: VendorOnboardingRequest,
    current_user: dict = Depends(get_current_user_for_onboarding),
    service: OnboardingService = Depends(get_onboarding_service),
) -> OnboardingResponse:
    """
    Complete vendor onboarding.

    Vendorのオンボーディングを完了する。

    - Creates vendor organization
    - Updates profile to active
    - Creates vendor application
    - Creates Stripe customer
    """
    try:
        result = await service.complete_vendor_onboarding(
            user_id=current_user["id"],
            email=current_user["email"],
            request=request,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Vendor onboarding failed")
