"use client";

import { InviteMemberModal, DeleteConfirmModal, InfoModal } from "@/components";
import { UserEditModal } from "./components";
import { useVendorUserList } from "./hooks";
import styles from "./VendorUserListPage.module.scss";

export function VendorUserListPage() {
  const {
    // State
    users,
    selectedUsers,
    allSelected,
    selectedUserForEdit,
    lastEditedUserName,
    lastEditedUserRole,

    // Modal states
    showDeleteConfirmModal,
    showDeleteSuccessModal,
    showEditModal,
    showEditSuccessModal,
    showInviteModal,
    showInviteSuccessModal,

    // Selection handlers
    toggleUserSelection,
    toggleAllSelection,

    // Invite handlers
    handleInviteMember,
    handleInviteConfirm,
    handleCloseInviteModal,
    handleCloseInviteSuccessModal,

    // Edit handlers
    handleEditUser,
    handleEditSave,
    handleCloseEditModal,
    handleCloseEditSuccessModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirm,
    handleCloseDeleteConfirmModal,
    handleCloseDeleteSuccessModal,

    // Constants
    permissionOptions,
  } = useVendorUserList();

  return (
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
                        <span className={styles.userRoleMobile}>{user.role}</span>
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
                          handleEditUser(user);
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
      />

      {/* Invite Success Modal */}
      <InfoModal
        isOpen={showInviteSuccessModal}
        onClose={handleCloseInviteSuccessModal}
        title="招待を送信しました"
        message="メンバーへの招待メールを送信しました。"
      />

      {/* Edit Modal */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        onSave={handleEditSave}
        currentName={selectedUserForEdit?.name}
        currentPermission={selectedUserForEdit?.role}
        permissionOptions={permissionOptions}
      />

      {/* Edit Success Modal */}
      <InfoModal
        isOpen={showEditSuccessModal}
        onClose={handleCloseEditSuccessModal}
        title="変更を保存しました"
        message={`${lastEditedUserName}さんの権限を「${lastEditedUserRole}」に変更しました。`}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={handleCloseDeleteConfirmModal}
        onConfirm={handleDeleteConfirm}
        message={`以下のメンバーを削除しますか？\n${selectedUsers.map(u => u.name).join("、")}`}
      />

      {/* Delete Success Modal */}
      <InfoModal
        isOpen={showDeleteSuccessModal}
        onClose={handleCloseDeleteSuccessModal}
        title="削除しました"
        message="選択したメンバーを削除しました。"
      />
    </div>
  );
}
