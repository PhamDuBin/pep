"use client";

import {
  InviteMemberModal,
  DeleteConfirmModal,
  PageTransition,
  UserListTable,
} from "@/shared/components";
import { ChangePermissionModal } from "./components";
import { useUserList } from "./hooks";

export function UserListPage() {
  const {
    // State
    users,
    selectedUsers,
    allSelected,
    selectedUserForPermission,

    // Modal states
    showDeleteConfirmModal,
    deleteModalState,
    showInviteModal,
    inviteModalState,
    showChangePermissionModal,

    // Selection handlers
    handleUserSelect,
    handleAllSelect,

    // Invite handlers
    handleInviteMemberClick,
    handleOpenInviteModal,
    handleCloseInviteModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirmClick,
    handleCloseDeleteConfirmModal,

    // Change permission handlers
    handleChangePermission,
    handlePermissionSaveClick,
    handleCloseChangePermissionModal,
  } = useUserList();

  // Wrapper to handle selection by ID (for shared component)
  const handleToggleSelection = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      handleUserSelect(user);
    }
  };

  // Wrapper to handle permission change by ID (for shared component)
  const handleChangeClick = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      handleChangePermission(user);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col items-center py-[25px] px-[50px] gap-[50px] w-full min-h-[calc(100vh-89px)] bg-white">
        <div className="flex flex-col items-start gap-[25px] w-full">
          {/* Header */}
          <div className="flex flex-row items-center px-0 pb-[10px] gap-[10px] w-full h-[37px] border-b border-[#CFCFCF]">
            <h2 className="font-noto font-bold text-[20px] leading-[27px] text-[#333333] w-[120px]">
              ユーザー一覧
            </h2>
          </div>

          {/* Invite Button */}
          <button
            type="button"
            className="flex flex-row items-center justify-center px-[15px] py-[10px] gap-[10px] w-[128px] h-[39px] bg-[#066A9E] rounded-[8px] border-none cursor-pointer hover:bg-[#055580] transition-colors"
            onClick={handleOpenInviteModal}
          >
            <span className="font-noto font-[400] text-[14px] leading-[19px] text-[#FFFFFF]">
              メンバーを招待
            </span>
          </button>

          {/* User Table */}
          <UserListTable
            users={users.map((user) => ({
              id: user.id,
              name: user.name,
              initials: user.initials,
              avatarColor: user.avatarColor,
              avatarUrl: user.avatarUrl,
              permission: user.role || "",
              isSelected: user.selected ?? false,
            }))}
            isAllSelected={allSelected}
            onToggleAllSelection={handleAllSelect}
            onToggleSelection={handleToggleSelection}
            onChangeClick={handleChangeClick}
          />

          {/* Delete Button */}
          <div className="flex flex-col justify-end items-center w-full h-[39px]">
            <button
              type="button"
              className="flex flex-row items-center justify-center py-2.5 px-[15px] gap-2.5 w-[128px] h-[39px] bg-[#333333] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#FFFFFF] hover:bg-[#1a1a1a] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeleteMembers}
              disabled={selectedUsers.length === 0}
            >
              メンバーを削除
            </button>
          </div>
        </div>

        {/* Invite Modal */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={handleCloseInviteModal}
          onInviteMemberClick={handleInviteMemberClick}
          modalState={inviteModalState}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onDeleteConfirmClick={handleDeleteConfirmClick}
          modalState={deleteModalState}
        />

        {/* Change Permission Modal */}
        <ChangePermissionModal
          isOpen={showChangePermissionModal}
          onClose={handleCloseChangePermissionModal}
          onPermissionSaveClick={handlePermissionSaveClick}
          currentPermission={selectedUserForPermission?.role as any}
        />
      </div>
    </PageTransition>
  );
}
