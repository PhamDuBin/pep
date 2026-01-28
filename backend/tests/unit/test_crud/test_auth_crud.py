# tests/unit/test_crud/test_auth_crud.py
"""CRUD layer tests for Auth / Auth CRUD層テスト"""

import pytest
from unittest.mock import MagicMock
from app.crud.auth import AuthCRUD
from app.schemas.auth import SignupRequest


@pytest.fixture
def mock_supabase():
    """Mock Supabase client / Supabaseクライアントのモック"""
    mock = MagicMock()
    return mock


@pytest.fixture
def auth_crud(mock_supabase):
    """AuthCRUD instance with mock / モック付きAuthCRUDインスタンス"""
    return AuthCRUD(mock_supabase)


@pytest.fixture
def buyer_signup_data():
    """Buyer signup request data / Buyerサインアップリクエストデータ"""
    return SignupRequest(
        user_id="550e8400-e29b-41d4-a716-446655440000",
        org_type="buyer",
        company_name="テスト株式会社",
        contact_email="test@example.com",
        display_name="テストユーザー",
        industry="製造業",
        employee_count="100-500",
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
        industry="IT",
        employee_count="50-100",
        business_description="クラウドサービス開発",
        service_description="SaaS提供",
        website_url="https://vendor.example.com",
    )


# ===========================================
# call_create_signup_rpc Tests / RPCコールテスト
# ===========================================

@pytest.mark.asyncio
async def test_call_create_signup_rpc_buyer(mock_supabase, auth_crud, buyer_signup_data):
    """Test Buyer signup RPC call / Buyer RPC呼び出しテスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={
            "organization_id": "org-uuid",
            "profile_id": "550e8400-e29b-41d4-a716-446655440000",
            "application_id": "app-uuid",
        }
    )

    # Act
    result = await auth_crud.call_create_signup_rpc(buyer_signup_data)

    # Assert
    assert result["organization_id"] == "org-uuid"
    assert result["profile_id"] == "550e8400-e29b-41d4-a716-446655440000"
    assert result["application_id"] == "app-uuid"
    mock_supabase.rpc.assert_called_once_with(
        "create_signup",
        {
            "p_user_id": "550e8400-e29b-41d4-a716-446655440000",
            "p_org_type": "buyer",
            "p_company_name": "テスト株式会社",
            "p_contact_email": "test@example.com",
            "p_display_name": "テストユーザー",
            "p_industry": "製造業",
            "p_employee_count": "100-500",
            "p_purpose": "サービス選定のため",
            "p_business_description": None,
            "p_service_description": None,
            "p_website_url": None,
        },
    )


@pytest.mark.asyncio
async def test_call_create_signup_rpc_vendor(mock_supabase, auth_crud, vendor_signup_data):
    """Test Vendor signup RPC call / Vendor RPC呼び出しテスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.return_value = MagicMock(
        data={
            "organization_id": "org-uuid",
            "profile_id": "550e8400-e29b-41d4-a716-446655440001",
            "application_id": "app-uuid",
        }
    )

    # Act
    result = await auth_crud.call_create_signup_rpc(vendor_signup_data)

    # Assert
    assert result["organization_id"] == "org-uuid"
    mock_supabase.rpc.assert_called_once()
    call_args = mock_supabase.rpc.call_args[0]
    assert call_args[1]["p_org_type"] == "vendor"
    assert call_args[1]["p_business_description"] == "クラウドサービス開発"
    assert call_args[1]["p_service_description"] == "SaaS提供"
    assert call_args[1]["p_website_url"] == "https://vendor.example.com"


@pytest.mark.asyncio
async def test_call_create_signup_rpc_failure(mock_supabase, auth_crud, buyer_signup_data):
    """Test RPC failure raises exception / RPC失敗時の例外テスト"""
    # Arrange
    mock_supabase.rpc.return_value.execute.side_effect = Exception("RPC failed")

    # Act & Assert
    with pytest.raises(Exception, match="RPC failed"):
        await auth_crud.call_create_signup_rpc(buyer_signup_data)


# ===========================================
# check_email_exists Tests / メール存在確認テスト
# ===========================================

@pytest.mark.asyncio
async def test_check_email_exists_true(mock_supabase, auth_crud):
    """Test email exists returns True / メール存在時Trueを返すテスト"""
    # Arrange
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.not_.is_.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[{"id": "user-uuid"}]
    )

    # Act
    result = await auth_crud.check_email_exists("existing@example.com")

    # Assert
    assert result is True
    mock_supabase.table.assert_called_with("profiles")


@pytest.mark.asyncio
async def test_check_email_exists_false(mock_supabase, auth_crud):
    """Test email not exists returns False / メール非存在時Falseを返すテスト"""
    # Arrange
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.not_.is_.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[]
    )

    # Act
    result = await auth_crud.check_email_exists("new@example.com")

    # Assert
    assert result is False


@pytest.mark.asyncio
async def test_check_email_exists_ignores_pending_signup(mock_supabase, auth_crud):
    """Test ignores profiles with org_id=null / org_id=nullのprofileは無視するテスト"""
    # Arrange: Profile exists but org_id is null (signup incomplete)
    # not_.is_("org_id", "null") filters out profiles without org_id
    mock_supabase.table.return_value.select.return_value.eq.return_value.eq.return_value.not_.is_.return_value.limit.return_value.execute.return_value = MagicMock(
        data=[]
    )

    # Act
    result = await auth_crud.check_email_exists("pending@example.com")

    # Assert
    assert result is False


# ===========================================
# delete_auth_user Tests / auth.users削除テスト
# ===========================================

@pytest.mark.asyncio
async def test_delete_auth_user_success(mock_supabase, auth_crud):
    """Test successful auth user deletion / auth.users削除成功テスト"""
    # Arrange
    mock_supabase.auth.admin.delete_user.return_value = None

    # Act
    result = await auth_crud.delete_auth_user("user-to-delete")

    # Assert
    assert result is True
    mock_supabase.auth.admin.delete_user.assert_called_once_with("user-to-delete")


@pytest.mark.asyncio
async def test_delete_auth_user_failure(mock_supabase, auth_crud):
    """Test auth user deletion failure returns False / auth.users削除失敗時Falseを返すテスト"""
    # Arrange
    mock_supabase.auth.admin.delete_user.side_effect = Exception("Delete failed")

    # Act
    result = await auth_crud.delete_auth_user("user-to-delete")

    # Assert
    assert result is False
