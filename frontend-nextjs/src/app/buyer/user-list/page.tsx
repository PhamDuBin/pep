"use client";

import { useState, useCallback, useMemo } from "react";
import { Modal } from "@/components";
import { MOCK_USERS, PERMISSION_OPTIONS } from "@/mocks";
import { User, UserPermission } from "@/types";
import styles from "./page.module.scss";

export default function UserListPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitePermission, setInvitePermission] =
    useState<UserPermission>("member");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newPermission, setNewPermission] = useState<UserPermission>("member");

  const isAllSelected = useMemo(
    () => users.length > 0 && users.every((u) => u.isSelected),
    [users]
  );

  const selectedCount = useMemo(
    () => users.filter((u) => u.isSelected).length,
    [users]
  );

  const handleToggleSelection = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSelected: !u.isSelected } : u
      )
    );
  }, []);

  const handleToggleAllSelection = useCallback(() => {
    const allSelected = users.every((u) => u.isSelected);
    setUsers((prev) => prev.map((u) => ({ ...u, isSelected: !allSelected })));
  }, [users]);

  const handleOpenPermissionModal = useCallback(
    (userId: string) => {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setSelectedUserId(userId);
        setNewPermission(user.permission);
        setShowPermissionModal(true);
      }
    },
    [users]
  );

  const handleConfirmPermissionChange = useCallback(() => {
    if (selectedUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserId ? { ...u, permission: newPermission } : u
        )
      );
      setShowPermissionModal(false);
      setSelectedUserId(null);
    }
  }, [selectedUserId, newPermission]);

  const handleDeleteMembers = useCallback(() => {
    if (selectedCount > 0) {
      setShowDeleteModal(true);
    }
  }, [selectedCount]);

  const handleConfirmDelete = useCallback(() => {
    setUsers((prev) => prev.filter((u) => !u.isSelected));
    setShowDeleteModal(false);
  }, []);

  const handleInvite = useCallback(() => {
    if (!inviteEmail.trim()) return;

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      initials: inviteEmail.slice(0, 2).toUpperCase(),
      avatarColor: "#8ec5d0",
      permission: invitePermission,
      email: inviteEmail,
      isSelected: false,
    };
    setUsers((prev) => [...prev, newUser]);
    setInviteEmail("");
    setInvitePermission("member");
    setShowInviteModal(false);
  }, [inviteEmail, invitePermission]);

  const getPermissionLabel = (permission: UserPermission) => {
    const option = PERMISSION_OPTIONS.find((o) => o.value === permission);
    return option ? option.label : permission;
  };

  return (
    <div className={styles.contentWrapper}>
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
            onClick={() => setShowInviteModal(true)}
          >
            メンバーを招待
          </button>
        </div>

        {/* User Table */}
        <div className={styles.tableContainer}>
          <table className={styles.userTable}>
            <thead>
              <tr className={styles.headerRow}>
                <th className={`${styles.checkboxCell} ${styles.headerCell}`}>
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
                <th className={`${styles.permissionCell} ${styles.headerCell}`}>
                  権限
                </th>
                <th className={`${styles.actionCell} ${styles.headerCell}`} />
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

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="メンバーを招待"
        size="sm"
      >
        <div className={styles.inviteForm}>
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
              value={invitePermission}
              onChange={(e) =>
                setInvitePermission(e.target.value as UserPermission)
              }
            >
              {PERMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
            onClick={handleInvite}
            disabled={!inviteEmail.trim()}
          >
            招待
          </button>
        </div>
      </Modal>

      {/* Permission Change Modal */}
      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="権限の変更"
        size="sm"
      >
        <div className={styles.permissionForm}>
          <div className={styles.formGroup}>
            <label>権限を選択</label>
            <select
              value={newPermission}
              onChange={(e) =>
                setNewPermission(e.target.value as UserPermission)
              }
            >
              {PERMISSION_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowPermissionModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary"
            onClick={handleConfirmPermissionChange}
          >
            変更
          </button>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="メンバーの削除"
        size="sm"
      >
        <div className={styles.deleteConfirm}>
          <p>
            選択した{selectedCount}名のメンバーを削除しますか？
            この操作は取り消せません。
          </p>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary"
            onClick={handleConfirmDelete}
          >
            削除
          </button>
        </div>
      </Modal>
    </div>
  );
}
