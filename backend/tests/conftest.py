"""Pytest fixtures for API testing."""

import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, patch

from app.main import app


@pytest.fixture
def mock_current_user():
    """Mock authenticated user."""
    return {
        "id": "test-user-id-123",
        "email": "test@example.com",
        "created_at": "2024-01-01T00:00:00Z",
    }


@pytest.fixture
def mock_supabase():
    """Mock Supabase client."""
    mock = AsyncMock()
    return mock


@pytest.fixture
async def client(mock_current_user):
    """Async test client with mocked authentication."""
    from app.core.security import get_current_user

    async def override_get_current_user():
        return mock_current_user

    app.dependency_overrides[get_current_user] = override_get_current_user

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
async def unauthenticated_client():
    """Async test client without authentication."""
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
