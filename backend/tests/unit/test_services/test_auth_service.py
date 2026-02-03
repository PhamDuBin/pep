"""Unit tests for AuthService (mock AuthCRUD, mock httpx for refresh/password-reset)."""

import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from fastapi import HTTPException

from app.services.auth_service import AuthService
from app.schemas.auth import UserInfo, LoginResponse, PasswordResetMessage


@pytest.fixture
def mock_supabase():
    """Mock Supabase client (not used directly in get_current_user_info)."""
    return MagicMock()


@pytest.fixture
def mock_crud():
    """Mock AuthCRUD."""
    return MagicMock()


@pytest.fixture
def auth_service(mock_supabase, mock_crud):
    """AuthService with mocked CRUD."""
    svc = AuthService(mock_supabase)
    svc.crud = mock_crud
    return svc


@pytest.mark.asyncio
async def test_get_current_user_info_returns_user_info_when_active(auth_service, mock_crud):
    """get_current_user_info returns UserInfo when profile is active and org not suspended."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "owner",
        "status": "active",
        "org_id": "org-uuid",
        "org_name": "Org Name",
        "org_type": "buyer",
        "org_status": "active",
    }
    result = await auth_service.get_current_user_info("user-uuid", "u@example.com")
    assert isinstance(result, UserInfo)
    assert result.id == "user-uuid"
    assert result.email == "u@example.com"
    assert result.display_name == "User"
    assert result.role == "owner"
    assert result.status == "active"
    assert result.org_id == "org-uuid"
    assert result.org_name == "Org Name"
    assert result.org_type == "buyer"


@pytest.mark.asyncio
async def test_get_current_user_info_raises_when_profile_not_found(auth_service, mock_crud):
    """get_current_user_info raises 403 when profile is None."""
    mock_crud.get_user_profile_with_org.return_value = None
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_get_current_user_info_raises_on_inactive(auth_service, mock_crud):
    """get_current_user_info raises 403 ACCOUNT_INACTIVE when profile.status is inactive."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "member",
        "status": "inactive",
        "org_id": None,
        "org_name": None,
        "org_type": None,
        "org_status": None,
    }
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "ACCOUNT_INACTIVE"


@pytest.mark.asyncio
async def test_get_current_user_info_raises_on_profile_suspended(auth_service, mock_crud):
    """get_current_user_info raises 403 ACCOUNT_SUSPENDED when profile.status is suspended."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "member",
        "status": "suspended",
        "org_id": "org-uuid",
        "org_name": "Org",
        "org_type": "buyer",
        "org_status": "active",
    }
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "ACCOUNT_SUSPENDED"


@pytest.mark.asyncio
async def test_get_current_user_info_raises_on_org_suspended(auth_service, mock_crud):
    """get_current_user_info raises 403 ACCOUNT_SUSPENDED when org_status is suspended."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "member",
        "status": "active",
        "org_id": "org-uuid",
        "org_name": "Org",
        "org_type": "buyer",
        "org_status": "suspended",
    }
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "ACCOUNT_SUSPENDED"


@pytest.mark.asyncio
async def test_get_current_user_info_raises_on_pending(auth_service, mock_crud):
    """get_current_user_info raises 403 ONBOARDING_INCOMPLETE when profile.status is pending."""
    mock_crud.get_user_profile_with_org.return_value = {
        "id": "user-uuid",
        "email": "u@example.com",
        "display_name": "User",
        "role": "member",
        "status": "pending",
        "org_id": None,
        "org_name": None,
        "org_type": None,
        "org_status": None,
    }
    with pytest.raises(HTTPException) as exc_info:
        await auth_service.get_current_user_info("user-uuid")
    assert exc_info.value.status_code == 403
    assert exc_info.value.detail == "ONBOARDING_INCOMPLETE"


@pytest.mark.asyncio
async def test_refresh_tokens_returns_login_response(auth_service):
    """refresh_tokens returns LoginResponse when Supabase returns 200."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_resp.json.return_value = {
        "access_token": "new-access",
        "refresh_token": "new-refresh",
        "expires_in": 3600,
    }
    mock_client = MagicMock()
    mock_client.post = AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    with patch("app.services.auth_service.httpx.AsyncClient", return_value=mock_client):
        result = await auth_service.refresh_tokens("dummy-refresh-token")
    assert isinstance(result, LoginResponse)
    assert result.access_token == "new-access"
    assert result.refresh_token == "new-refresh"
    assert result.expires_in == 3600


@pytest.mark.asyncio
async def test_refresh_tokens_raises_401_on_reject(auth_service):
    """refresh_tokens raises 401 when Supabase rejects refresh."""
    mock_resp = MagicMock()
    mock_resp.status_code = 400
    mock_client = MagicMock()
    mock_client.post = AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    with patch("app.services.auth_service.httpx.AsyncClient", return_value=mock_client):
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.refresh_tokens("invalid-token")
    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_password_reset_request_returns_message(auth_service):
    """password_reset_request always returns success message (security)."""
    mock_client = MagicMock()
    mock_client.post = AsyncMock(return_value=MagicMock(status_code=200))
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    with patch("app.services.auth_service.httpx.AsyncClient", return_value=mock_client):
        result = await auth_service.password_reset_request("user@example.com")
    assert isinstance(result, PasswordResetMessage)
    assert "パスワード" in result.message


@pytest.mark.asyncio
async def test_password_reset_confirm_returns_message(auth_service):
    """password_reset_confirm returns message when Supabase returns 200."""
    mock_resp = MagicMock()
    mock_resp.status_code = 200
    mock_client = MagicMock()
    mock_client.put = AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    with patch("app.services.auth_service.httpx.AsyncClient", return_value=mock_client):
        result = await auth_service.password_reset_confirm("recovery-token", "newPass123")
    assert isinstance(result, PasswordResetMessage)
    assert "リセット" in result.message


@pytest.mark.asyncio
async def test_password_reset_confirm_raises_400_on_invalid_token(auth_service):
    """password_reset_confirm raises 400 when token invalid."""
    mock_resp = MagicMock()
    mock_resp.status_code = 400
    mock_client = MagicMock()
    mock_client.put = AsyncMock(return_value=mock_resp)
    mock_client.__aenter__ = AsyncMock(return_value=mock_client)
    mock_client.__aexit__ = AsyncMock(return_value=None)
    with patch("app.services.auth_service.httpx.AsyncClient", return_value=mock_client):
        with pytest.raises(HTTPException) as exc_info:
            await auth_service.password_reset_confirm("bad-token", "newPass123")
    assert exc_info.value.status_code == 400
