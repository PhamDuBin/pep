"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import { PERMISSION_OPTIONS } from "@/mocks";
import styles from "./InviteMemberModal.module.scss";

interface PermissionOption {
  value: string;
  label: string;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, permission: string) => void;
  permissionOptions?: PermissionOption[];
  defaultPermission?: string;
  isSaving?: boolean;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  onInvite,
  permissionOptions,
  defaultPermission,
  isSaving = false,
}: InviteMemberModalProps) {
  const options = permissionOptions || PERMISSION_OPTIONS;
  const initialPermission = defaultPermission || options[0]?.value || "member";

  const [email, setEmail] = useState("");
  const [permission, setPermission] = useState(initialPermission);

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPermission(initialPermission);
    }
  }, [isOpen, initialPermission]);

  const handleClose = useCallback(() => {
    setEmail("");
    setPermission(initialPermission);
    onClose();
  }, [onClose, initialPermission]);

  const handleInvite = useCallback(() => {
    if (email.trim()) {
      onInvite(email.trim(), permission);
      setEmail("");
      setPermission(initialPermission);
    }
  }, [email, permission, onInvite, initialPermission]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="メンバーを招待"
      size="sm"
    >
      <div className={styles.content}>
        <div className={styles.formGroup}>
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>
        <div className={styles.formGroup}>
          <label>権限</label>
          <select
            value={permission}
            onChange={(e) => setPermission(e.target.value)}
          >
            {options.map((option) => (
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
          onClick={handleClose}
          disabled={isSaving}
        >
          キャンセル
        </button>
        <button
          type="button"
          className="modal-btn-primary-color"
          onClick={handleInvite}
          disabled={!email.trim() || isSaving}
        >
          {isSaving ? "招待中..." : "招待"}
        </button>
      </div>
    </Modal>
  );
}
