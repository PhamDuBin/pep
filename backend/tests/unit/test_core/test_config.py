"""Unit tests for app.core.config."""

import pytest

from app.core.config import get_settings, Settings


def test_get_settings_returns_settings():
    """get_settings returns a Settings instance."""
    settings = get_settings()
    assert isinstance(settings, Settings)
    assert hasattr(settings, "supabase_url")
    assert hasattr(settings, "supabase_service_key")
    assert hasattr(settings, "frontend_url")


def test_get_settings_cached():
    """get_settings is cached (same instance)."""
    a = get_settings()
    b = get_settings()
    assert a is b
