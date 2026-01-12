"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import { PERMISSION_OPTIONS } from "@/mocks";
import { UserPermission } from "@/types";
import styles from "./PermissionChangeModal.module.scss";

interface PermissionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permission: UserPermission) => void;
  currentPermission?: UserPermission;
  userName?: string;
  isSaving?: boolean;
}

export function PermissionChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentPermission = "member",
  userName = "",
  isSaving = false,
}: PermissionChangeModalProps) {
  const [selectedPermission, setSelectedPermission] = useState<UserPermission>(currentPermission);

  useEffect(() => {
    if (isOpen) {
      setSelectedPermission(currentPermission);
    }
  }, [isOpen, currentPermission]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedPermission);
  }, [selectedPermission, onConfirm]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="権限の変更"
      size="sm"
    >
      <div className={styles.content}>
        {userName && (
          <p className={styles.userName}>
            {userName} さんの権限を変更します
          </p>
        )}
        <div className={styles.formGroup}>
          <label>権限を選択</label>
          <select
            value={selectedPermission}
            onChange={(e) => setSelectedPermission(e.target.value as UserPermission)}
          >
            {PERMISSION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="modal-btn-secondary"
          onClick={onClose}
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="modal-btn-primary"
          onClick={handleConfirm}
          disabled={isSaving}
        >
          {isSaving ? "変更中..." : "変更"}
        </button>
      </div>
    </Modal>
  );
}
