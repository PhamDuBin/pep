"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "../Modal";
import { AVATAR_COLOR_OPTIONS } from "@/mocks";
import styles from "./AvatarChangeModal.module.scss";

interface AvatarChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (color: string) => void;
  currentColor?: string;
  isSaving?: boolean;
}

export function AvatarChangeModal({
  isOpen,
  onClose,
  onSave,
  currentColor = "#8ec5d0",
  isSaving = false,
}: AvatarChangeModalProps) {
  const [selectedColor, setSelectedColor] = useState(currentColor);

  useEffect(() => {
    if (isOpen) {
      setSelectedColor(currentColor);
    }
  }, [isOpen, currentColor]);

  const handleSave = useCallback(() => {
    onSave(selectedColor);
  }, [selectedColor, onSave]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="アイコンの変更"
      size="md"
      customClass={styles.avatarChangeModal}
      isLoading={isSaving}
      actions={
        <div className={styles.actionsRow}>
          <button
            type="button"
            className={styles.btnPrimary}
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "保存"
            )}
          </button>
          <button type="button" className={styles.btnSecondary} onClick={onClose}>
            閉じる
          </button>
        </div>
      }
    >
      {/* Color Options */}
      <div className={styles.colorOptions}>
        {AVATAR_COLOR_OPTIONS.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`${styles.colorOption} ${
              selectedColor === option.color ? styles.selected : ""
            }`}
            style={{
              backgroundColor: option.color,
              borderColor: selectedColor === option.color ? "#066a9e" : "transparent",
            }}
            onClick={() => setSelectedColor(option.color)}
          />
        ))}
      </div>
    </Modal>
  );
}
