"""Pytest configuration and fixtures."""
import pytest
from app.core.supabase import get_supabase_client


@pytest.fixture
def supabase():
    """Supabase client fixture for database tests."""
    return get_supabase_client()