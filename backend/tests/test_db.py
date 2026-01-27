"""Auth flow tests: Sign up → Login → Logout."""
import pytest
from fastapi.testclient import TestClient
from app.main import app
import httpx
from app.core.config import get_settings
from app.core.supabase import get_supabase_client


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


# def test_signup(auth_headers, test_user):
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


# ========================================
# Remote Database Connection Tests
# ========================================

def test_remote_database_url():
    """Test that we are connecting to remote Supabase, not local."""
    settings = get_settings()
    assert "supabase.co" in settings.supabase_url
    assert "localhost" not in settings.supabase_url
    assert "127.0.0.1" not in settings.supabase_url


def test_buyer_applications_table_exists():
    """Test that buyer_applications table exists and is accessible."""
    supabase = get_supabase_client()
    result = supabase.table("buyer_applications").select("id").limit(1).execute()
    assert result is not None
    assert result.data is not None


def test_buyer_applications_table_query():
    """Test querying buyer_applications table structure."""
    supabase = get_supabase_client()
    result = supabase.table("buyer_applications").select(
        "id, org_id, company_name, status, created_at"
    ).limit(1).execute()
    assert result is not None