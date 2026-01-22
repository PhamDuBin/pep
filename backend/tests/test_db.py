"""Auth flow tests: Sign up → Login → Logout."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
import httpx
from app.core.config import get_settings


@pytest.fixture
def client():
    """FastAPI TestClient fixture."""
    return TestClient(app)


@pytest.fixture
def auth_headers():
    """Get auth headers for Supabase Auth API."""
    settings = get_settings()
    return {
        "apikey": settings.supabase_anon_key,
        "Content-Type": "application/json",
    }


@pytest.fixture
def test_user():
    """Test user data."""
    import uuid
    return {
        "email": f"test_{uuid.uuid4().hex[:8]}@example.com",
        "password": "Password123!",
    }


def test_signup(auth_headers, test_user):
    """Test user signup."""
    settings = get_settings()
    
    async def _signup():
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.supabase_url}/auth/v1/signup",
                headers=auth_headers,
                json={"email": test_user["email"], "password": test_user["password"]},
            )
            return response
    
    import asyncio
    response = asyncio.run(_signup())
    
    # Signup may return user or require email confirmation
    assert response.status_code in [200, 201]
    data = response.json()
    assert "user" in data or "id" in data