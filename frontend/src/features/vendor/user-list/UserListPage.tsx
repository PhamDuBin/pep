"use client";

import {
  InviteMemberModal,
  DeleteConfirmModal,
  PageTransition,
} from "@/shared/components";
import { ChangePermissionModal } from "./components";
import { InfoModal } from "@/features/vendor/shared/components";
import { UserEditModal } from "./components";
import { useVendorUserList } from "./hooks";

export function UserListPage() {
  const {
    // State
    users,
    selectedUsers,
    allSelected,
    selectedUserForPermission,
    lastChangedPermissionUserName,
    lastChangedPermissionRole,

    // Modal states
    showDeleteConfirmModal,
    deleteModalState,
    showInviteModal,
    inviteModalState,
    showChangePermissionModal,
    changePermissionModalState,

    // Selection handlers
    toggleUserSelection,
    toggleAllSelection,

    // Invite handlers
    handleInviteMember,
    handleInviteConfirm,
    handleCloseInviteModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirm,
    handleCloseDeleteConfirmModal,
    handleCloseDeleteSuccessModal,

    // Change permission handlers
    handleChangePermission,
    handleChangePermissionSave,
    handleCloseChangePermissionModal,

    // Constants
    permissionOptions,
  } = useVendorUserList();

  return (
    <PageTransition>
      <div className="flex flex-col items-center py-[25px] px-[50px] gap-[50px] w-full min-h-[calc(100vh-89px)] bg-white">
        <div className="flex flex-col items-start gap-[25px]  w-full">
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
            onClick={handleInviteMember}
          >
            <span className="font-noto font-[400] text-[14px] leading-[19px] text-[#FFFFFF]">
              メンバーを招待
            </span>
          </button>

          {/* Table */}
          <div className="w-full border border-[#d4d4d4] rounded bg-white overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-[44px] py-0 px-0 border-t border-[#d4d4d4] border-l h-[50px] bg-[#f5f5f5] align-middle">
                    <div className="flex items-center justify-center w-full h-full">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAllSelection}
                        className="appearance-none w-[20px] h-[20px] bg-[#FFFFFF] border border-[#cfcfcf] rounded-[8px] cursor-pointer relative checked:!bg-[#333333] checked:!border-[#333333]
                        after:content-[''] after:absolute after:left-[7px] after:top-[3px] after:w-[6px] after:h-[10px] after:border-[#FFFFFF] after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block"
                      />
                    </div>
                  </th>
                  <th className="w-[422px] border-t border-[#d4d4d4] h-[50px] bg-[#f5f5f5] text-center px-3 font-inter font-[600] text-[14px] leading-[130%] text-[#000000]">
                    ユーザー
                  </th>
                  <th className="w-[120px] py-[15px] px-3 text-center border-t border-[#d4d4d4] h-[50px] bg-[#f5f5f5] font-inter font-[600] text-[14px] leading-[130%] text-[#000000]">
                    権限
                  </th>
                  <th className="w-[422px] border-t border-[#d4d4d4] h-[50px] bg-[#f5f5f5]"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => toggleUserSelection(user)}
                    className="h-[70px] hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <td className="w-[44px] py-0 px-0 h-[70px] bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4] border-l align-middle">
                      <div className="flex items-center justify-center w-full h-full">
                        <input
                          type="checkbox"
                          checked={user.selected}
                          onChange={() => toggleUserSelection(user)}
                          onClick={(e) => e.stopPropagation()}
                          className="appearance-none w-[20px] h-[20px] bg-[#FFFFFF] border border-[#cfcfcf] rounded-[8px] cursor-pointer relative checked:!bg-[#333333] checked:!border-[#333333]
                          after:content-[''] after:absolute after:left-[7px] after:top-[3px] after:w-[6px] after:h-[10px] after:border-[#FFFFFF] after:border-r-2 after:border-b-2 after:rotate-45 after:hidden checked:after:block"
                        />
                      </div>
                    </td>
                    <td className="w-[422px] h-[70px] bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4]">
                      <div className="flex items-center py-[15px] px-3 gap-[15px]">
                        <div
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          style={{ backgroundColor: user.avatarColor }}
                        />
                        <div className="flex flex-col gap-0.5">
                          <span className="font-noto-jp font-[500] text-[14px] leading-[130%] text-[#333333]">
                            {user.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="w-[120px] py-[15px] px-3 text-center h-[70px] bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4] max-md:hidden">
                      <span className="font-noto-jp font-[500] text-[14px] leading-[130%] text-[#333333]">
                        {user.role}
                      </span>
                    </td>
                    <td className="w-[422px] h-[70px] bg-[rgba(255,255,255,0.002)] border-t border-[#d4d4d4]">
                      <div className="flex justify-center items-center py-2.5 px-3 gap-[15px]">
                        <button
                          type="button"
                          className="flex items-center justify-center py-2.5 px-[15px] gap-2.5 w-[58px] h-[39px] bg-[#e1e1e1] rounded-[8px] border-none cursor-pointer transition-colors duration-200 font-noto font-[400] text-[14px] leading-[19px] text-[#333333] hover:bg-[#d1d1d1]"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChangePermission(user);
                          }}
                        >
                          変更
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
          onInvite={handleInviteConfirm}
          modalState={inviteModalState}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteConfirmModal}
          onClose={handleCloseDeleteConfirmModal}
          onConfirm={handleDeleteConfirm}
          modalState={deleteModalState}
        />

        {/* Change Permission Modal */}
        <ChangePermissionModal
          isOpen={showChangePermissionModal}
          onClose={handleCloseChangePermissionModal}
          onSave={handleChangePermissionSave}
          currentPermission={selectedUserForPermission?.role as any}
        />
      </div>
    </PageTransition>
  );
}
