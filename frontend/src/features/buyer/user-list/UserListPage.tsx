"use client";

import {
  InviteMemberModal,
  DeleteConfirmModal,
  Loading,
  PageTransition,
  UserListTable,
} from "@/shared/components";
import { PermissionChangeModal } from "./components";
import { useUserList } from "./hooks";

export function UserListPage() {
  const {
    isLoading,
    users,
    showInviteModal,
    showPermissionModal,
    showDeleteModal,
    isAllSelected,
    selectedCount,
    selectedUser,
    // Modal states
    inviteModalState,
    permissionModalState,
    deleteModalState,
    // Saving states
    isInviting,
    isSavingPermission,
    isDeleting,
    // Handlers
    handleToggleSelection,
    handleToggleAllSelection,
    handleOpenPermissionModal,
    handleClosePermissionModal,
    handlePermissionSaveClick,
    handleDeleteMembers,
    handleDeleteConfirmClick,
    handleCloseDeleteModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleInviteMemberClick,
    getPermissionLabel,
  } = useUserList();

  return (
    <PageTransition>
      <div className="flex flex-col gap-[25px] w-full px-[50px] py-[25px]">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loading type="spinner" size="lg" />
          </div>
        ) : (
          <div className="flex flex-col gap-[25px]">
            {/* Page Header */}
            <div className="flex items-center pb-[10px] border-b border-[#cfcfcf]">
              <h1 className="font-bold text-[20px] leading-normal text-[#333333] m-0">
                ユーザー一覧
              </h1>
            </div>

            {/* Invite Button */}
            <div className="flex items-center">
              <button
                type="button"
                className="px-[15px] py-[10px] bg-[#066a9e] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 hover:bg-[#055a84] active:bg-[#044a6a]"
                onClick={handleOpenInviteModal}
              >
                メンバーを招待
              </button>
            </div>

            {/* User Table */}
            <UserListTable
              users={users.map((user) => ({
                id: user.id,
                name: user.name,
                initials: user.initials,
                avatarColor: user.avatarColor,
                permission: user.permission,
                isSelected: user.isSelected ?? false,
              }))}
              isAllSelected={isAllSelected}
              onToggleAllSelection={handleToggleAllSelection}
              onToggleSelection={handleToggleSelection}
              onChangeClick={handleOpenPermissionModal}
              getPermissionLabel={(permission) =>
                getPermissionLabel(permission as "admin" | "member")
              }
            />

            {/* Delete Button */}
            <div className="flex flex-col items-center justify-end w-full">
              <button
                type="button"
                className="px-[15px] py-[10px] bg-[#333333] border-none rounded-[8px] font-normal text-[14px] text-white cursor-pointer transition-colors duration-200 hover:enabled:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={selectedCount === 0}
                onClick={handleDeleteMembers}
              >
                メンバーを削除
              </button>
            </div>
          </div>
        )}

        {/* Invite Modal */}
        <InviteMemberModal
          isOpen={showInviteModal}
          onClose={handleCloseInviteModal}
          onInviteMemberClick={handleInviteMemberClick}
          isSaving={isInviting}
          modalState={inviteModalState}
        />

        {/* Permission Change Modal */}
        <PermissionChangeModal
          isOpen={showPermissionModal}
          onClose={handleClosePermissionModal}
          onPermissionSaveClick={handlePermissionSaveClick}
          currentPermission={selectedUser?.permission}
          userName={selectedUser?.name}
          isSaving={isSavingPermission}
          modalState={permissionModalState}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onDeleteConfirmClick={handleDeleteConfirmClick}
          selectedCount={selectedCount}
          isDeleting={isDeleting}
          modalState={deleteModalState}
        />
      </div>
    </PageTransition>
  );
}
