"""Unit tests for GET /api/users/platform-admin."""

import pytest
from httpx import AsyncClient, ASGITransport

from app.main import app
from app.core.security import get_current_user
from app.core.supabase import get_supabase


class _Result:
    def __init__(self, data):
        self.data = data


class _ProfilesQuery:
    def __init__(self, data):
        self._data = data

    def select(self, *_args, **_kwargs):
        return self

    def eq(self, *_args, **_kwargs):
        return self

    def execute(self):
        return _Result(self._data)


class _SupabaseStub:
    def __init__(self, profiles_data):
        self._profiles_data = profiles_data

    def table(self, name: str):
        assert name == "profiles"
        return _ProfilesQuery(self._profiles_data)


@pytest.mark.asyncio
async def test_platform_admin_status_true():
    async def override_get_current_user():
        return {"id": "admin-user-id", "email": "admin@example.com"}

    def override_get_supabase():
        return _SupabaseStub([{"is_platform_admin": True}])

    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_supabase] = override_get_supabase
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            resp = await client.get("/api/users/platform-admin")
        assert resp.status_code == 200
        assert resp.json() == {"is_platform_admin": True}
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_platform_admin_status_false_when_missing_profile():
    async def override_get_current_user():
        return {"id": "normal-user-id", "email": "user@example.com"}

    def override_get_supabase():
        return _SupabaseStub([])

    app.dependency_overrides[get_current_user] = override_get_current_user
    app.dependency_overrides[get_supabase] = override_get_supabase
    try:
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
            resp = await client.get("/api/users/platform-admin")
        assert resp.status_code == 200
        assert resp.json() == {"is_platform_admin": False}
    finally:
        app.dependency_overrides.clear()

