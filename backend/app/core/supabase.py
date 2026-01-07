"""Supabase client initialization."""

from supabase import create_client, Client
from functools import lru_cache

from app.core.config import get_settings


@lru_cache
def get_supabase_client() -> Client:
    """Get cached Supabase client instance."""
    settings = get_settings()
    return create_client(
        supabase_url=settings.supabase_url,
        supabase_key=settings.supabase_service_key,
    )


def get_supabase() -> Client:
    """Dependency for FastAPI routes."""
    return get_supabase_client()
