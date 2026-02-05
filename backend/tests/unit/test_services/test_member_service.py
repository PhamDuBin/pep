"""Unit tests for MemberService (mock CRUD) - remove, leave, list, role change, transfer."""

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


# ===========================================================
# list_members Tests
# ===========================================================


@pytest.mark.asyncio
async def test_list_members_success(service):
    """List members returns MemberListResponse with items."""
    rows = [
        {
            "id": "p-1",
            "email": "a@b.com",
            "display_name": "User A",
            "role": "owner",
            "status": "active",
            "avatar_url": None,
            "avatar_color": "#000",
        }
    ]
    actor_profile = {"id": "actor-1", "org_id": "org-1", "role": "member"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = actor_profile
        with patch.object(
            service.member_crud, "list_members", new_callable=AsyncMock
        ) as m_list:
            m_list.return_value = (rows, 1)
            result = await service.list_members("org-1", "actor-1")
    assert result.total_count == 1
    assert len(result.members) == 1
    assert result.members[0].email == "a@b.com"


@pytest.mark.asyncio
async def test_list_members_actor_not_in_org_raises_403(service):
    """List members raises 403 when actor is not in the org."""
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.list_members("org-1", "stranger-1")
    assert exc_info.value.status_code == 403


# ===========================================================
# change_role Tests
# ===========================================================


@pytest.mark.asyncio
async def test_change_role_owner_promotes_member_to_admin(service):
    """Owner can promote member to admin."""
    target = {"id": "p-1", "org_id": "org-1", "role": "member"}
    updated = {"id": "p-1", "role": "admin", "status": "active"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with patch.object(
            service.member_crud, "update_role", new_callable=AsyncMock
        ) as m_update:
            m_update.return_value = updated
            result = await service.change_role(
                "org-1", "p-1", "admin", "owner-1", "owner"
            )
    assert result.role == "admin"
    assert result.id == "p-1"


@pytest.mark.asyncio
async def test_change_role_owner_demotes_admin_to_member(service):
    """Owner can demote admin to member."""
    target = {"id": "p-1", "org_id": "org-1", "role": "admin"}
    updated = {"id": "p-1", "role": "member", "status": "active"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with patch.object(
            service.member_crud, "update_role", new_callable=AsyncMock
        ) as m_update:
            m_update.return_value = updated
            result = await service.change_role(
                "org-1", "p-1", "member", "owner-1", "owner"
            )
    assert result.role == "member"


@pytest.mark.asyncio
async def test_change_role_admin_promotes_member_to_admin(service):
    """Admin can promote member to admin."""
    target = {"id": "p-1", "org_id": "org-1", "role": "member"}
    updated = {"id": "p-1", "role": "admin", "status": "active"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with patch.object(
            service.member_crud, "update_role", new_callable=AsyncMock
        ) as m_update:
            m_update.return_value = updated
            result = await service.change_role(
                "org-1", "p-1", "admin", "admin-1", "admin"
            )
    assert result.role == "admin"


@pytest.mark.asyncio
async def test_change_role_admin_cannot_demote_raises_403(service):
    """Admin cannot demote admin to member: raises 403."""
    target = {"id": "p-1", "org_id": "org-1", "role": "admin"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with pytest.raises(HTTPException) as exc_info:
            await service.change_role(
                "org-1", "p-1", "member", "admin-1", "admin"
            )
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_change_role_target_owner_raises_403(service):
    """Cannot change owner's role: raises 403."""
    target = {"id": "p-1", "org_id": "org-1", "role": "owner"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with pytest.raises(HTTPException) as exc_info:
            await service.change_role(
                "org-1", "p-1", "member", "owner-1", "owner"
            )
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_change_role_same_role_raises_400(service):
    """Changing to same role raises 400."""
    target = {"id": "p-1", "org_id": "org-1", "role": "admin"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with pytest.raises(HTTPException) as exc_info:
            await service.change_role(
                "org-1", "p-1", "admin", "owner-1", "owner"
            )
    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_change_role_assign_owner_raises_400(service):
    """Cannot assign owner role directly: raises 400."""
    with pytest.raises(HTTPException) as exc_info:
        await service.change_role(
            "org-1", "p-1", "owner", "owner-1", "owner"
        )
    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_change_role_target_not_found_raises_404(service):
    """Change role on non-existent target raises 404."""
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.change_role(
                "org-1", "unknown", "admin", "owner-1", "owner"
            )
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_change_role_update_fails_raises_500(service):
    """Change role raises 500 when CRUD update returns None."""
    target = {"id": "p-1", "org_id": "org-1", "role": "member"}
    with patch.object(
        service.crud, "get_profile_by_id_and_org", new_callable=AsyncMock
    ) as m_get:
        m_get.return_value = target
        with patch.object(
            service.member_crud, "update_role", new_callable=AsyncMock
        ) as m_update:
            m_update.return_value = None
            with pytest.raises(HTTPException) as exc_info:
                await service.change_role(
                    "org-1", "p-1", "admin", "owner-1", "owner"
                )
    assert exc_info.value.status_code == 500


# ===========================================================
# transfer_ownership Tests
# ===========================================================


@pytest.mark.asyncio
async def test_transfer_ownership_success(service):
    """Transfer ownership returns response on success."""
    rpc_result = {
        "org_id": "org-1",
        "previous_owner_id": "owner-1",
        "new_owner_id": "member-1",
        "status": "transferred",
    }
    with patch.object(
        service.member_crud,
        "call_transfer_ownership_rpc",
        new_callable=AsyncMock,
    ) as m_rpc:
        m_rpc.return_value = rpc_result
        result = await service.transfer_ownership("org-1", "owner-1", "member-1")
    assert result.status == "transferred"
    assert result.new_owner_id == "member-1"


@pytest.mark.asyncio
async def test_transfer_ownership_rpc_not_owner_raises_403(service):
    """Transfer ownership raises 403 when caller is not the owner."""
    with patch.object(
        service.member_crud,
        "call_transfer_ownership_rpc",
        new_callable=AsyncMock,
    ) as m_rpc:
        m_rpc.side_effect = Exception("Current user is not the owner of this organization")
        with pytest.raises(HTTPException) as exc_info:
            await service.transfer_ownership("org-1", "not-owner", "member-1")
    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_transfer_ownership_rpc_not_active_raises_404(service):
    """Transfer ownership raises 404 when target is not an active member."""
    with patch.object(
        service.member_crud,
        "call_transfer_ownership_rpc",
        new_callable=AsyncMock,
    ) as m_rpc:
        m_rpc.side_effect = Exception("Target user is not an active member")
        with pytest.raises(HTTPException) as exc_info:
            await service.transfer_ownership("org-1", "owner-1", "inactive-1")
    assert exc_info.value.status_code == 404


@pytest.mark.asyncio
async def test_transfer_ownership_rpc_self_raises_400(service):
    """Transfer ownership to self raises 400."""
    with patch.object(
        service.member_crud,
        "call_transfer_ownership_rpc",
        new_callable=AsyncMock,
    ) as m_rpc:
        m_rpc.side_effect = Exception("Cannot transfer ownership to yourself")
        with pytest.raises(HTTPException) as exc_info:
            await service.transfer_ownership("org-1", "owner-1", "owner-1")
    assert exc_info.value.status_code == 400


@pytest.mark.asyncio
async def test_transfer_ownership_rpc_returns_none_raises_500(service):
    """Transfer ownership raises 500 when RPC returns None."""
    with patch.object(
        service.member_crud,
        "call_transfer_ownership_rpc",
        new_callable=AsyncMock,
    ) as m_rpc:
        m_rpc.return_value = None
        with pytest.raises(HTTPException) as exc_info:
            await service.transfer_ownership("org-1", "owner-1", "member-1")
    assert exc_info.value.status_code == 500
