"""Unit tests for auth routes (mock verify_token, mock AuthService)."""

import pytest
import pytest_asyncio
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.core.security import verify_token
from app.api.routes.auth.me import get_auth_service
from app.schemas.auth import UserInfo, LoginResponse, PasswordResetMessage


@pytest_asyncio.fixture
async def auth_client():
    """Async client with verify_token and AuthService mocked for GET /me."""
    async def override_verify_token():
        return {"id": "user-uuid", "email": "u@example.com"}

    mock_service = MagicMock()
    mock_service.get_current_user_info = AsyncMock(
        return_value=UserInfo(
            id="user-uuid",
            email="u@example.com",
            display_name="User",
            role="owner",
            org_id="org-uuid",
            org_name="Org Name",
            org_type="buyer",
            status="active",
        )
    )
    app.dependency_overrides[verify_token] = override_verify_token
    app.dependency_overrides[get_auth_service] = lambda: mock_service
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(verify_token, None)
    app.dependency_overrides.pop(get_auth_service, None)


@pytest.mark.asyncio
async def test_get_me_returns_user_info(auth_client):
    """GET /api/v1/auth/me returns 200 and UserInfo shape."""
    response = await auth_client.get(
        "/api/v1/auth/me",
        headers={"Authorization": "Bearer dummy-token"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "user-uuid"
    assert data["email"] == "u@example.com"
    assert data["display_name"] == "User"
    assert data["role"] == "owner"
    assert data["org_id"] == "org-uuid"
    assert data["org_name"] == "Org Name"
    assert data["org_type"] == "buyer"
    assert data["status"] == "active"


@pytest_asyncio.fixture
async def auth_client_no_verify():
    """Async client with AuthService mocked for POST /refresh and password-reset (no verify_token)."""
    mock_service = MagicMock()
    mock_service.refresh_tokens = AsyncMock(
        return_value=LoginResponse(
            access_token="new-access",
            refresh_token="new-refresh",
            expires_in=3600,
        )
    )
    mock_service.password_reset_request = AsyncMock(
        return_value=PasswordResetMessage(message="パスワードリセットメールを送信しました。")
    )
    mock_service.password_reset_confirm = AsyncMock(
        return_value=PasswordResetMessage(message="パスワードをリセットしました。")
    )
    app.dependency_overrides[get_auth_service] = lambda: mock_service
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as ac:
        yield ac
    app.dependency_overrides.pop(get_auth_service, None)


@pytest.mark.asyncio
async def test_refresh_returns_tokens(auth_client_no_verify):
    """POST /api/v1/auth/refresh returns 200 and LoginResponse shape."""
    response = await auth_client_no_verify.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "dummy-refresh-token"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["access_token"] == "new-access"
    assert data["refresh_token"] == "new-refresh"
    assert data["expires_in"] == 3600


@pytest.mark.asyncio
async def test_password_reset_request_returns_message(auth_client_no_verify):
    """POST /api/v1/auth/password-reset-request returns 200 and message."""
    response = await auth_client_no_verify.post(
        "/api/v1/auth/password-reset-request",
        json={"email": "user@example.com"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data


@pytest.mark.asyncio
async def test_password_reset_confirm_returns_message(auth_client_no_verify):
    """POST /api/v1/auth/password-reset-confirm returns 200 and message."""
    response = await auth_client_no_verify.post(
        "/api/v1/auth/password-reset-confirm",
        json={"token": "recovery-token-xxx", "new_password": "newPassword123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
