# tests/unit/test_routes/test_auth_routes.py
"""Routes layer tests for Auth / Auth API層テスト"""

import pytest
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from fastapi import HTTPException

from app.main import app
from app.schemas.auth import SignupResponse
from app.api.routes.auth import get_auth_service


# ===========================================
# POST /api/auth/signup Tests / サインアップAPIテスト
# ===========================================

@pytest.mark.asyncio
async def test_signup_buyer_success():
    """Test successful Buyer signup returns 201 / Buyerサインアップ成功時201を返すテスト"""
    # Arrange
    mock_service = MagicMock()
    mock_service.signup = AsyncMock(return_value=SignupResponse(
        organization_id="org-uuid",
        profile_id="prof-uuid",
        application_id="app-uuid",
    ))
    app.dependency_overrides[get_auth_service] = lambda: mock_service

    try:
        # Act
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/auth/signup",
                json={
                    "user_id": "550e8400-e29b-41d4-a716-446655440000",
                    "org_type": "buyer",
                    "company_name": "テスト株式会社",
                    "contact_email": "test@example.com",
                    "display_name": "テストユーザー",
                    "purpose": "サービス選定のため",
                }
            )

        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["organization_id"] == "org-uuid"
        assert data["profile_id"] == "prof-uuid"
        assert data["application_id"] == "app-uuid"
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_signup_vendor_success():
    """Test successful Vendor signup returns 201 / Vendorサインアップ成功時201を返すテスト"""
    # Arrange
    mock_service = MagicMock()
    mock_service.signup = AsyncMock(return_value=SignupResponse(
        organization_id="org-uuid-2",
        profile_id="prof-uuid-2",
        application_id="app-uuid-2",
    ))
    app.dependency_overrides[get_auth_service] = lambda: mock_service

    try:
        # Act
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/auth/signup",
                json={
                    "user_id": "550e8400-e29b-41d4-a716-446655440001",
                    "org_type": "vendor",
                    "company_name": "ベンダー株式会社",
                    "contact_email": "vendor@example.com",
                    "display_name": "ベンダーユーザー",
                    "business_description": "クラウドサービス開発",
                }
            )

        # Assert
        assert response.status_code == 201
        data = response.json()
        assert data["organization_id"] == "org-uuid-2"
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_signup_email_exists_returns_409():
    """Test email exists returns 409 / メール重複時409を返すテスト"""
    # Arrange
    mock_service = MagicMock()
    mock_service.signup = AsyncMock(side_effect=HTTPException(
        status_code=409,
        detail="このメールアドレスは既に登録されています / Email already registered"
    ))
    app.dependency_overrides[get_auth_service] = lambda: mock_service

    try:
        # Act
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/auth/signup",
                json={
                    "user_id": "550e8400-e29b-41d4-a716-446655440000",
                    "org_type": "buyer",
                    "company_name": "テスト株式会社",
                    "contact_email": "existing@example.com",
                    "display_name": "テストユーザー",
                }
            )

        # Assert
        assert response.status_code == 409
        assert "既に登録されています" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_signup_invalid_org_type_returns_422():
    """Test invalid org_type returns 422 / 不正なorg_type時422を返すテスト"""
    # Act (no mock needed - validation happens before service call)
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/signup",
            json={
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "org_type": "invalid_type",
                "company_name": "テスト株式会社",
                "contact_email": "test@example.com",
                "display_name": "テストユーザー",
            }
        )

    # Assert
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_signup_buyer_with_vendor_fields_returns_422():
    """Test buyer with vendor fields returns 422 / Buyerがvendorフィールドを持つ時422を返すテスト"""
    # Act
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/auth/signup",
            json={
                "user_id": "550e8400-e29b-41d4-a716-446655440000",
                "org_type": "buyer",
                "company_name": "テスト株式会社",
                "contact_email": "test@example.com",
                "display_name": "テストユーザー",
                "business_description": "This should fail",  # Vendor only field
            }
        )

    # Assert
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_signup_rpc_failure_returns_400():
    """Test RPC failure returns 400 / RPC失敗時400を返すテスト"""
    # Arrange
    mock_service = MagicMock()
    mock_service.signup = AsyncMock(side_effect=HTTPException(
        status_code=400,
        detail="サインアップに失敗しました: DB error / Signup failed: DB error"
    ))
    app.dependency_overrides[get_auth_service] = lambda: mock_service

    try:
        # Act
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.post(
                "/api/auth/signup",
                json={
                    "user_id": "550e8400-e29b-41d4-a716-446655440000",
                    "org_type": "buyer",
                    "company_name": "テスト株式会社",
                    "contact_email": "test@example.com",
                    "display_name": "テストユーザー",
                }
            )

        # Assert
        assert response.status_code == 400
        assert "サインアップに失敗しました" in response.json()["detail"]
    finally:
        app.dependency_overrides.clear()
