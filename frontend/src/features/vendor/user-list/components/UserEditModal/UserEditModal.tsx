"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/shared/components";
import { PermissionOption } from "../../types";
import styles from "./UserEditModal.module.scss";

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, permission: string) => void;
  currentName?: string;
  currentPermission?: string;
  permissionOptions?: PermissionOption[];
  isSaving?: boolean;
}

const DEFAULT_PERMISSION_OPTIONS: PermissionOption[] = [
  { value: "管理者", label: "管理者" },
  { value: "メンバー", label: "メンバー" },
];

export function UserEditModal({
  isOpen,
  onClose,
  onSave,
  currentName = "",
  currentPermission = "",
  permissionOptions = DEFAULT_PERMISSION_OPTIONS,
  isSaving = false,
}: UserEditModalProps) {
  const [name, setName] = useState(currentName);
  const [permission, setPermission] = useState(
    currentPermission || permissionOptions[0]?.value || ""
  );

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setPermission(currentPermission || permissionOptions[0]?.value || "");
    }
  }, [isOpen, currentName, currentPermission, permissionOptions]);

  const handleSave = useCallback(() => {
    onSave(name, permission);
  }, [name, permission, onSave]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ユーザー情報の変更"
      size="sm"
    >
      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label>氏名</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="氏名を入力"
          />
        </div>
        <div className={styles.formGroup}>
          <label>権限</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            {permissionOptions.map((option) => (
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
          className="modal-btn-primary-color"
          onClick={handleSave}
          disabled={isSaving || !name.trim()}
        >
          {isSaving ? "保存中..." : "保存"}
        </button>
      </div>
    </Modal>
  );
}
