"use client";

import { Modal } from "../Modal";
import styles from "./DeleteConfirmModal.module.scss";

export type DeleteConfirmModalState = "confirm" | "complete";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount?: number;
  message?: string;
  isDeleting?: boolean;
  modalState?: DeleteConfirmModalState;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  selectedCount = 0,
  message,
  isDeleting = false,
  modalState = "confirm",
}: DeleteConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="メンバー削除"
      size={modalState === "complete" ? "sm" : "md"}
      customClass={`${styles.deleteConfirmModal} ${
        modalState === "complete" ? styles.completeState : ""
      }`}
      isLoading={isDeleting}
      actions={
        modalState === "confirm" ? (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              キャンセル
            </button>
            <button
              type="button"
              className={styles.btnPrimary}
              disabled={isDeleting}
              onClick={onConfirm}
            >
              {isDeleting ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "削除"
              )}
            </button>
          </div>
        ) : (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.btnSecondary} onClick={onClose}>
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "confirm" ? (
        <div className={styles.modalTextContainer}>
          <p className={styles.modalText}>選択したメンバーを削除します。</p>
          <p className={styles.modalText}>よろしいですか？</p>
        </div>
      ) : (
        <p className={styles.modalText}>選択したメンバーを削除しました。</p>
      )}
    </Modal>
  );
}
