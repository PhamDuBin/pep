"use client";

import {
  InviteMemberModal,
  DeleteConfirmModal,
  Loading,
  PageTransition,
} from "@/components";
import { PermissionChangeModal } from "./components";
import { useUserList } from "./hooks";
import styles from "./UserListPage.module.scss";

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
    handleConfirmPermissionChange,
    handleDeleteMembers,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleInvite,
    getPermissionLabel,
  } = useUserList();

  return (
    <PageTransition>
      <div className={styles.contentWrapper}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <Loading type="spinner" size="lg" />
          </div>
        ) : (
          <div className={styles.pageContent}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>ユーザー一覧</h1>
            </div>

            {/* Invite Button */}
            <div className={styles.actionBar}>
              <button
                type="button"
                className={styles.btnInvite}
                onClick={handleOpenInviteModal}
              >
                メンバーを招待
              </button>
            </div>

            {/* User Table */}
            <div className={styles.tableContainer}>
              <table className={styles.userTable}>
                <thead>
                  <tr className={styles.headerRow}>
                    <th
                      className={`${styles.checkboxCell} ${styles.headerCell}`}
                    >
                      <label className={styles.checkboxWrapper}>
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleToggleAllSelection}
                          className={styles.checkbox}
                        />
                        <span
                          className={`${styles.checkmark} ${isAllSelected ? styles.checked : ""}`}
                        />
                      </label>
                    </th>
                    <th className={styles.userCellHeader}>ユーザー</th>
                    <th
                      className={`${styles.permissionCell} ${styles.headerCell}`}
                    >
                      権限
                    </th>
                    <th
                      className={`${styles.actionCell} ${styles.headerCell}`}
                    />
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={styles.dataRow}>
                      <td className={styles.checkboxCell}>
                        <label className={styles.checkboxWrapper}>
                          <input
                            type="checkbox"
                            checked={user.isSelected}
                            onChange={() => handleToggleSelection(user.id)}
                            className={styles.checkbox}
                          />
                          <span
                            className={`${styles.checkmark} ${user.isSelected ? styles.checked : ""}`}
                          />
                        </label>
                      </td>
                      <td className={styles.userCell}>
                        <div className={styles.userInfo}>
                          <div
                            className={styles.avatar}
                            style={{ backgroundColor: user.avatarColor }}
                          >
                            <span className={styles.avatarText}>
                              {user.initials}
                            </span>
                          </div>
                          <span className={styles.userName}>{user.name}</span>
                        </div>
                      </td>
                      <td className={styles.permissionCell}>
                        <span className={styles.permissionText}>
                          {getPermissionLabel(user.permission)}
                        </span>
                      </td>
                      <td className={styles.actionCell}>
                        <button
                          type="button"
                          className={styles.changeBtn}
                          onClick={() => handleOpenPermissionModal(user.id)}
                        >
                          変更
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Delete Button */}
            <div className={styles.deleteAction}>
              <button
                type="button"
                className={styles.btnDelete}
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
          onInvite={handleInvite}
          isSaving={isInviting}
          modalState={inviteModalState}
        />

        {/* Permission Change Modal */}
        <PermissionChangeModal
          isOpen={showPermissionModal}
          onClose={handleClosePermissionModal}
          onConfirm={handleConfirmPermissionChange}
          currentPermission={selectedUser?.permission}
          userName={selectedUser?.name}
          isSaving={isSavingPermission}
          modalState={permissionModalState}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          selectedCount={selectedCount}
          isDeleting={isDeleting}
          modalState={deleteModalState}
        />
      </div>
    </PageTransition>
  );
}
