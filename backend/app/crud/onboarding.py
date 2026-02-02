"""CRUD layer for onboarding operations."""

from typing import Optional

from supabase import Client


class OnboardingCRUD:
    """CRUD operations for user onboarding.

    DB操作のみを担当。ビジネスロジックはService層で行う。
    """

    def __init__(self, supabase: Client):
        self.supabase = supabase

    async def get_profile(self, user_id: str) -> Optional[dict]:
        """
        Get profile by user_id for onboarding validation.

        オンボーディングバリデーション用にprofileを取得。
        """
        result = (
            self.supabase.table("profiles")
            .select("org_id, status")
            .eq("id", user_id)
            .single()
            .execute()
        )
        return result.data

    async def call_complete_buyer_onboarding_rpc(
        self, params: dict
    ) -> Optional[dict]:
        """
        Call complete_buyer_onboarding RPC.

        Buyerオンボーディング完了RPCを呼び出し。
        """
        result = self.supabase.rpc(
            "complete_buyer_onboarding", params
        ).execute()
        return result.data

    async def call_complete_vendor_onboarding_rpc(
        self, params: dict
    ) -> Optional[dict]:
        """
        Call complete_vendor_onboarding RPC.

        Vendorオンボーディング完了RPCを呼び出し。
        """
        result = self.supabase.rpc(
            "complete_vendor_onboarding", params
        ).execute()
        return result.data
