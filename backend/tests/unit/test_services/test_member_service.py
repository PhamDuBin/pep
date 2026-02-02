"""Unit tests for MemberService (mock CRUD) - remove member, leave org."""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi import HTTPException

from app.services.member_service import MemberService


@pytest.fixture
def mock_supabase():
    return MagicMock()


@pytest.fixture
def service(mock_supabase):
    return MemberService(mock_supabase)


# --- Test Case 3: メンバー削除成功 (Remove member success, soft delete) ---
@pytest.mark.asyncio
async def test_remove_member_success_is_deleted_true(service):
    """Remove member success: soft delete (is_deleted = true)."""
    actor_profile = {"id": "actor-1", "org_id": "org-1", "role": "owner"}
    target_profile = {"id": "target-1", "org_id": "org-1", "role": "member"}
    updated_row = {"id": "target-1", "is_deleted": True, "deleted_at": "2024-01-01T00:00:00Z"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.side_effect = [actor_profile, target_profile]
        with patch.object(
            service.crud, "soft_delete_profile", new_callable=AsyncMock
        ) as m_del:
            m_del.return_value = updated_row
            await service.remove_member("org-1", "target-1", "actor-1")
    m_del.assert_called_once_with("target-1", "actor-1")


# --- Test Case 4: Owner削除の試行 (Owner cannot be removed) ---
@pytest.mark.asyncio
async def test_remove_member_owner_raises_403(service):
    """Removing owner raises 403."""
    actor_profile = {"id": "actor-1", "org_id": "org-1", "role": "admin"}
    target_profile = {"id": "owner-1", "org_id": "org-1", "role": "owner"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.side_effect = [actor_profile, target_profile]
        with pytest.raises(HTTPException) as exc_info:
            await service.remove_member("org-1", "owner-1", "actor-1")
    assert exc_info.value.status_code == 403
    assert "owner" in exc_info.value.detail.lower() or "オーナー" in exc_info.value.detail


# --- Admin only removable by owner ---
@pytest.mark.asyncio
async def test_remove_member_admin_by_non_owner_raises_403(service):
    """Only owner can remove admin; admin removing admin raises 403."""
    actor_profile = {"id": "admin-1", "org_id": "org-1", "role": "admin"}
    target_profile = {"id": "admin-2", "org_id": "org-1", "role": "admin"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.side_effect = [actor_profile, target_profile]
        with pytest.raises(HTTPException) as exc_info:
            await service.remove_member("org-1", "admin-2", "admin-1")
    assert exc_info.value.status_code == 403
    assert "owner" in exc_info.value.detail.lower() or "オーナーのみ" in exc_info.value.detail


# --- Test Case 5: 自己退会 Ownerが試行 (Owner cannot leave) ---
@pytest.mark.asyncio
async def test_leave_organization_owner_raises_403(service):
    """Owner cannot leave: raises 403."""
    profile = {"id": "user-1", "org_id": "org-1", "role": "owner"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = profile
        with pytest.raises(HTTPException) as exc_info:
            await service.leave_organization("org-1", "user-1")
    assert exc_info.value.status_code == 403
    assert "owner" in exc_info.value.detail.lower() or "オーナー" in exc_info.value.detail


@pytest.mark.asyncio
async def test_leave_organization_member_success(service):
    """Member can leave: soft delete own profile."""
    profile = {"id": "user-1", "org_id": "org-1", "role": "member"}
    updated_row = {"id": "user-1", "is_deleted": True}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = profile
        with patch.object(
            service.crud, "soft_delete_profile", new_callable=AsyncMock
        ) as m_del:
            m_del.return_value = updated_row
            await service.leave_organization("org-1", "user-1")
    m_del.assert_called_once_with("user-1", "user-1")


@pytest.mark.asyncio
async def test_remove_member_target_not_in_org_raises_404(service):
    """Remove member when target not in org raises 404."""
    actor_profile = {"id": "actor-1", "org_id": "org-1", "role": "owner"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.side_effect = [actor_profile, None]
        with pytest.raises(HTTPException) as exc_info:
            await service.remove_member("org-1", "unknown-1", "actor-1")
    assert exc_info.value.status_code == 404
