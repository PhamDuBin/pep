"use client";

import { Modal } from "@/components";
import styles from "./DeleteConfirmModal.module.scss";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  message?: string;
  isDeleting?: boolean;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = "",
  message,
  isDeleting = false,
}: DeleteConfirmModalProps) {
  const defaultMessage = userName
    ? `${userName} さんをこのプロジェクトから削除しますか？`
    : "このユーザーをプロジェクトから削除しますか？";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="ユーザーの削除"
      size="sm"
    >
      <div className={styles.content}>
        <p className={styles.message}>
          {message || defaultMessage}
        </p>
        <p className={styles.warning}>
          この操作は取り消せません。
        </p>
      </div>
      <div className={styles.actions}>
        <button
          type="button"
          className="modal-btn-secondary"
          onClick={onClose}
          disabled={isDeleting}
        >
          キャンセル
        </button>
        <button
          type="button"
          className={styles.deleteBtn}
          onClick={onConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "削除中..." : "削除"}
        </button>
      </div>
    </Modal>
  );
}
