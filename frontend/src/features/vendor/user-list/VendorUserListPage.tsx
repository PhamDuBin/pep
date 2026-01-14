"use client";

import { InviteMemberModal, DeleteConfirmModal, PageTransition } from "@/shared/components";
import { ChangePermissionModal } from "./components";
import { InfoModal } from "@/features/vendor/shared/components";
import { UserEditModal } from "./components";
import { useVendorUserList } from "./hooks";
import styles from "./VendorUserListPage.module.scss";

export function VendorUserListPage() {
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
      <div className={styles.container}>
        <div className={styles.content}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>ユーザー一覧</h2>
        </div>

        {/* Invite Button */}
        <button
          type="button"
          className={styles.inviteButton}
          onClick={handleInviteMember}
        >
          メンバーを招待
        </button>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th className={styles.checkboxCell}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleAllSelection}
                  />
                </th>
                <th>ユーザー</th>
                <th className={styles.permissionCell}>権限</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => toggleUserSelection(user)}
                  className={styles.userRow}
                >
                  <td className={styles.checkboxCell}>
                    <input
                      type="checkbox"
                      checked={user.selected}
                      onChange={() => toggleUserSelection(user)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td>
                    <div className={styles.userCell}>
                      <div
                        className={styles.userAvatar}
                        style={{ backgroundColor: user.avatarColor }}
                      />
                      <div className={styles.userInfo}>
                        <span className={styles.userName}>{user.name}</span>
                        <span className={styles.userRoleMobile}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={styles.permissionCell}>
                    <span className={styles.userRole}>{user.role}</span>
                  </td>
                  <td>
                    <div className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.editButton}
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
        <div className={styles.deleteContainer}>
          <button
            type="button"
            className={styles.deleteButton}
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
        onConfirm={handleChangePermissionSave}
        currentPermission={selectedUserForPermission?.role as any}
        userName={selectedUserForPermission?.name}
        modalState={changePermissionModalState}
      />
      </div>
    </PageTransition>
  );
}
