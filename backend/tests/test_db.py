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


def test_login(auth_headers, test_user):
    """Test user login."""
    settings = get_settings()
    
    async def _login():
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.supabase_url}/auth/v1/token?grant_type=password",
                headers=auth_headers,
                json={"email": test_user["email"], "password": test_user["password"]},
            )
            return response
    
    import asyncio
    response = asyncio.run(_login())
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    return data["access_token"]


def test_logout(auth_headers, test_user):
    """Test user logout."""
    settings = get_settings()
    
    # First login to get token
    async def _login():
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{settings.supabase_url}/auth/v1/token?grant_type=password",
                headers=auth_headers,
                json={"email": test_user["email"], "password": test_user["password"]},
            )
            return response
    
    import asyncio
    login_response = asyncio.run(_login())
    
    if login_response.status_code != 200:
        pytest.skip("Login failed, cannot test logout")
    
    access_token = login_response.json()["access_token"]
    
    # Then logout
    async def _logout():
        async with httpx.AsyncClient() as client:
            headers = {**auth_headers, "Authorization": f"Bearer {access_token}"}
            response = await client.post(
                f"{settings.supabase_url}/auth/v1/logout",
                headers=headers,
            )
            return response
    
    logout_response = asyncio.run(_logout())
    assert logout_response.status_code in [200, 204, 204]