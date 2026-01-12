"use client";

import { useState, useCallback, useMemo } from "react";
import { Modal } from "@/components";
import { MOCK_VENDOR_USERS } from "@/mocks/vendor";
import { VendorUser } from "@/types/vendor";
import styles from "./page.module.scss";

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
  const [editedUserName, setEditedUserName] = useState("");
  const [editedUserRole, setEditedUserRole] = useState("");

  // Invite state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("メンバー");

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
    setInviteEmail("");
    setInviteRole("メンバー");
    setShowInviteModal(true);
  }, []);

  const handleInviteConfirm = useCallback(() => {
    if (!inviteEmail.trim()) return;

    const newUser: VendorUser = {
      id: `u-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      initials: inviteEmail.slice(0, 2).toUpperCase(),
      email: inviteEmail,
      avatarColor: "#8EC5D0",
      role: inviteRole,
      selected: false,
    };

    setUsers((prev) => [...prev, newUser]);
    setShowInviteModal(false);
    setShowInviteSuccessModal(true);
  }, [inviteEmail, inviteRole]);

  // Edit handlers
  const handleEditUser = useCallback((user: VendorUser) => {
    setSelectedUserForEdit(user);
    setEditedUserName(user.name);
    setEditedUserRole(user.role || "メンバー");
    setShowEditModal(true);
  }, []);

  const handleEditSave = useCallback(() => {
    if (!selectedUserForEdit) return;

    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUserForEdit.id
          ? { ...u, name: editedUserName, role: editedUserRole }
          : u
      )
    );
    setShowEditModal(false);
    setShowEditSuccessModal(true);
  }, [selectedUserForEdit, editedUserName, editedUserRole]);

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
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="メンバーを招待"
        size="sm"
      >
        <div className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>メールアドレス</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label>権限</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <option value="管理者">管理者</option>
              <option value="メンバー">メンバー</option>
            </select>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowInviteModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleInviteConfirm}
            disabled={!inviteEmail.trim()}
          >
            招待
          </button>
        </div>
      </Modal>

      {/* Invite Success Modal */}
      <Modal
        isOpen={showInviteSuccessModal}
        onClose={() => setShowInviteSuccessModal(false)}
        title="招待を送信しました"
        size="sm"
      >
        <div className={styles.modalMessage}>
          <p>メンバーへの招待メールを送信しました。</p>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={() => setShowInviteSuccessModal(false)}
          >
            閉じる
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="ユーザー情報の変更"
        size="sm"
      >
        <div className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>氏名</label>
            <input
              type="text"
              value={editedUserName}
              onChange={(e) => setEditedUserName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>権限</label>
            <select
              value={editedUserRole}
              onChange={(e) => setEditedUserRole(e.target.value)}
            >
              <option value="管理者">管理者</option>
              <option value="メンバー">メンバー</option>
            </select>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowEditModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleEditSave}
          >
            保存
          </button>
        </div>
      </Modal>

      {/* Edit Success Modal */}
      <Modal
        isOpen={showEditSuccessModal}
        onClose={() => setShowEditSuccessModal(false)}
        title="変更を保存しました"
        size="sm"
      >
        <div className={styles.modalMessage}>
          <p>
            {editedUserName}さんの権限を「{editedUserRole}」に変更しました。
          </p>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={() => setShowEditSuccessModal(false)}
          >
            閉じる
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="メンバーを削除"
        size="sm"
      >
        <div className={styles.modalMessage}>
          <p>以下のメンバーを削除しますか？</p>
          <ul className={styles.deleteList}>
            {selectedUsers.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowDeleteConfirmModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className={styles.deleteConfirmButton}
            onClick={handleDeleteConfirm}
          >
            削除
          </button>
        </div>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
        title="削除しました"
        size="sm"
      >
        <div className={styles.modalMessage}>
          <p>選択したメンバーを削除しました。</p>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={() => setShowDeleteSuccessModal(false)}
          >
            閉じる
          </button>
        </div>
      </Modal>
    </div>
  );
}
