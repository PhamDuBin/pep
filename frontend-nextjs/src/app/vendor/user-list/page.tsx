"use client";

import { useState, useCallback, useMemo } from "react";
import { InviteMemberModal, UserEditModal, DeleteConfirmModal, InfoModal } from "@/components";
import { MOCK_VENDOR_USERS } from "@/mocks/vendor";
import { VendorUser } from "@/types/vendor";
import styles from "./page.module.scss";

const VENDOR_PERMISSION_OPTIONS = [
  { value: "管理者", label: "管理者" },
  { value: "メンバー", label: "メンバー" },
];

export default function VendorUserListPage() {
  const [users, setUsers] = useState<VendorUser[]>(MOCK_VENDOR_USERS);

  // Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);

  // Edit state
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<VendorUser | null>(null);
  const [lastEditedUserName, setLastEditedUserName] = useState("");
  const [lastEditedUserRole, setLastEditedUserRole] = useState("");

  const selectedUsers = useMemo(() => users.filter((u) => u.selected), [users]);
  const allSelected = useMemo(
    () => users.length > 0 && users.every((u) => u.selected),
    [users]
  );

  const toggleUserSelection = useCallback((user: VendorUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, selected: !u.selected } : u))
    );
  }, []);

  const toggleAllSelection = useCallback(() => {
    const newValue = !allSelected;
    setUsers((prev) => prev.map((u) => ({ ...u, selected: newValue })));
  }, [allSelected]);

  // Invite handlers
  const handleInviteMember = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleInviteConfirm = useCallback((email: string, role: string) => {
    const newUser: VendorUser = {
      id: `u-${Date.now()}`,
      name: email.split("@")[0],
      initials: email.slice(0, 2).toUpperCase(),
      email: email,
      avatarColor: "#8EC5D0",
      role: role,
      selected: false,
    };

    setUsers((prev) => [...prev, newUser]);
    setShowInviteModal(false);
    setShowInviteSuccessModal(true);
  }, []);

  // Edit handlers
  const handleEditUser = useCallback((user: VendorUser) => {
    setSelectedUserForEdit(user);
    setShowEditModal(true);
  }, []);

  const handleEditSave = useCallback((name: string, role: string) => {
    if (!selectedUserForEdit) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserForEdit.id
          ? { ...u, name: name, role: role }
          : u
      )
    );
    setLastEditedUserName(name);
    setLastEditedUserRole(role);
    setShowEditModal(false);
    setShowEditSuccessModal(true);
    setSelectedUserForEdit(null);
  }, [selectedUserForEdit]);

  // Delete handlers
  const handleDeleteMembers = useCallback(() => {
    if (selectedUsers.length === 0) return;
    setShowDeleteConfirmModal(true);
  }, [selectedUsers]);

  const handleDeleteConfirm = useCallback(() => {
    setUsers((prev) => prev.filter((u) => !u.selected));
    setShowDeleteConfirmModal(false);
    setShowDeleteSuccessModal(true);
  }, []);

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
        onClose={() => setShowInviteModal(false)}
        onInvite={handleInviteConfirm}
        permissionOptions={VENDOR_PERMISSION_OPTIONS}
        defaultPermission="メンバー"
      />

      {/* Invite Success Modal */}
      <InfoModal
        isOpen={showInviteSuccessModal}
        onClose={() => setShowInviteSuccessModal(false)}
        title="招待を送信しました"
        message="メンバーへの招待メールを送信しました。"
      />

      {/* Edit Modal */}
      <UserEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedUserForEdit(null);
        }}
        onSave={handleEditSave}
        currentName={selectedUserForEdit?.name}
        currentPermission={selectedUserForEdit?.role}
        permissionOptions={VENDOR_PERMISSION_OPTIONS}
      />

      {/* Edit Success Modal */}
      <InfoModal
        isOpen={showEditSuccessModal}
        onClose={() => setShowEditSuccessModal(false)}
        title="変更を保存しました"
        message={`${lastEditedUserName}さんの権限を「${lastEditedUserRole}」に変更しました。`}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        onConfirm={handleDeleteConfirm}
        message={`以下のメンバーを削除しますか？\n${selectedUsers.map(u => u.name).join("、")}`}
      />

      {/* Delete Success Modal */}
      <InfoModal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        title="削除しました"
        message="選択したメンバーを削除しました。"
      />
    </div>
  );
}
