# tests/unit/test_services/test_auth_service.py
"""Service layer tests for Auth / Auth Service層テスト"""

import pytest
from unittest.mock import MagicMock, AsyncMock
from fastapi import HTTPException

from app.services.auth import AuthService
from app.schemas.auth import SignupRequest


@pytest.fixture
def mock_supabase():
    """Mock Supabase client / Supabaseクライアントのモック"""
    return MagicMock()


@pytest.fixture
def buyer_signup_data():
    """Buyer signup request data / Buyerサインアップリクエストデータ"""
    return SignupRequest(
        user_id="550e8400-e29b-41d4-a716-446655440000",
        org_type="buyer",
        company_name="テスト株式会社",
        contact_email="test@example.com",
        display_name="テストユーザー",
        purpose="サービス選定のため",
    )


@pytest.fixture
def vendor_signup_data():
    """Vendor signup request data / Vendorサインアップリクエストデータ"""
    return SignupRequest(
        user_id="550e8400-e29b-41d4-a716-446655440001",
        org_type="vendor",
        company_name="ベンダー株式会社",
        contact_email="vendor@example.com",
        display_name="ベンダーユーザー",
        business_description="クラウドサービス開発",
    )


# ===========================================
# signup Tests / サインアップテスト
# ===========================================

@pytest.mark.asyncio
async def test_signup_buyer_success(mock_supabase, buyer_signup_data):
    """Test successful Buyer signup / Buyerサインアップ成功テスト"""
    # Arrange
    service = AuthService(mock_supabase)
    service.crud.check_email_exists = AsyncMock(return_value=False)
    service.crud.call_create_signup_rpc = AsyncMock(return_value={
        "organization_id": "org-uuid-1",
        "profile_id": "550e8400-e29b-41d4-a716-446655440000",
        "application_id": "app-uuid-1",
    })

    # Act
    result = await service.signup(buyer_signup_data)

    # Assert
    assert result.organization_id == "org-uuid-1"
    assert result.profile_id == "550e8400-e29b-41d4-a716-446655440000"
    assert result.application_id == "app-uuid-1"
    service.crud.check_email_exists.assert_called_once_with("test@example.com")
    service.crud.call_create_signup_rpc.assert_called_once_with(buyer_signup_data)


@pytest.mark.asyncio
async def test_signup_vendor_success(mock_supabase, vendor_signup_data):
    """Test successful Vendor signup / Vendorサインアップ成功テスト"""
    # Arrange
    service = AuthService(mock_supabase)
    service.crud.check_email_exists = AsyncMock(return_value=False)
    service.crud.call_create_signup_rpc = AsyncMock(return_value={
        "organization_id": "org-uuid-2",
        "profile_id": "550e8400-e29b-41d4-a716-446655440001",
        "application_id": "app-uuid-2",
    })

    # Act
    result = await service.signup(vendor_signup_data)

    # Assert
    assert result.organization_id == "org-uuid-2"


@pytest.mark.asyncio
async def test_signup_email_exists_raises_409(mock_supabase, buyer_signup_data):
    """Test email already exists raises 409 / メール重複時409エラーテスト"""
    # Arrange
    service = AuthService(mock_supabase)
    service.crud.check_email_exists = AsyncMock(return_value=True)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await service.signup(buyer_signup_data)

    assert exc_info.value.status_code == 409
    assert "既に登録されています" in exc_info.value.detail


@pytest.mark.asyncio
async def test_signup_rpc_failure_triggers_cleanup(mock_supabase, buyer_signup_data):
    """Test RPC failure triggers cleanup / RPC失敗時クリーンアップテスト"""
    # Arrange
    service = AuthService(mock_supabase)
    service.crud.check_email_exists = AsyncMock(return_value=False)
    service.crud.call_create_signup_rpc = AsyncMock(side_effect=Exception("DB error"))
    service.crud.delete_auth_user = AsyncMock(return_value=True)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await service.signup(buyer_signup_data)

    assert exc_info.value.status_code == 400
    assert "DB error" in exc_info.value.detail
    service.crud.delete_auth_user.assert_called_once_with(buyer_signup_data.user_id)


@pytest.mark.asyncio
async def test_signup_rpc_returns_null_raises_500(mock_supabase, buyer_signup_data):
    """Test RPC returns null raises 500 / RPC結果null時500エラーテスト"""
    # Arrange
    service = AuthService(mock_supabase)
    service.crud.check_email_exists = AsyncMock(return_value=False)
    service.crud.call_create_signup_rpc = AsyncMock(return_value=None)

    # Act & Assert
    with pytest.raises(HTTPException) as exc_info:
        await service.signup(buyer_signup_data)

    assert exc_info.value.status_code == 500
    assert "サインアップに失敗しました" in exc_info.value.detail
