"use client";

import { useState, useCallback, useEffect } from "react";
import { Modal } from "@/components";
import { UserPermission } from "../../types";
import { PERMISSION_OPTIONS, PERMISSION_LABELS } from "../../mock";
import styles from "./PermissionChangeModal.module.scss";

export type PermissionChangeModalState = "select" | "complete";

interface PermissionTableRow {
  feature: string;
  adminCheck?: boolean;
  adminText?: string;
  adminNote?: string;
  memberCheck?: boolean;
  memberText?: string;
  memberNote?: string;
}

interface PermissionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (permission: UserPermission) => void;
  currentPermission?: UserPermission;
  userName?: string;
  isSaving?: boolean;
  modalState?: PermissionChangeModalState;
}

// Permission comparison table data (matches Figma design)
const PERMISSION_TABLE_DATA: PermissionTableRow[] = [
  {
    feature: "アカウント・組織",
    adminText: "組織設定の変更/メンバー招待・権限変更/退会",
    memberText: "自分のプロフィール変更",
  },
  {
    feature: "プロジェクト計画書作成（AI）",
    adminCheck: true,
    memberCheck: true,
  },
  {
    feature: "ベンダー選定",
    adminCheck: true,
    adminNote: "（選定/送信先確定）",
  },
  {
    feature: "RFP送信（メール/チャット）",
    adminCheck: true,
  },
  {
    feature: "チャット（発注者↔︎ベンダー）",
    adminCheck: true,
    adminNote: "(送受信/クローズ)",
    memberCheck: true,
    memberNote: "(招待時)",
  },
  {
    feature: "アーカイブ",
    adminCheck: true,
    memberCheck: true,
  },
  {
    feature: "決済/請求",
    adminCheck: true,
    adminNote: "(Stripe手続)",
  },
];

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M9.55008 17.3081L4.58008 12.3381L5.29408 11.6251L9.55008 15.8811L18.7061 6.7251L19.4191 7.4391L9.55008 17.3081Z"
      fill="#066A9E"
    />
  </svg>
);

export function PermissionChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentPermission = "member",
  userName = "",
  isSaving = false,
  modalState = "select",
}: PermissionChangeModalProps) {
  const [selectedPermission, setSelectedPermission] = useState<UserPermission>(currentPermission);

  useEffect(() => {
    if (isOpen && modalState === "select") {
      setSelectedPermission(currentPermission);
    }
  }, [isOpen, currentPermission, modalState]);

  const handleConfirm = useCallback(() => {
    onConfirm(selectedPermission);
  }, [selectedPermission, onConfirm]);

  const getPermissionLabel = (permission: UserPermission | null): string => {
    if (!permission) return "";
    return PERMISSION_LABELS[permission] || permission;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="権限変更"
      size="lg"
      customClass={styles.permissionChangeModal}
      isLoading={isSaving}
      actions={
        modalState === "select" ? (
          <div className={styles.actionsRow}>
            <button
              type="button"
              className={styles.btnSave}
              disabled={isSaving || !selectedPermission}
              onClick={handleConfirm}
            >
              {isSaving ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "保存"
              )}
            </button>
          </div>
        ) : (
          <div className={styles.actionsRow}>
            <button type="button" className={styles.btnClose} onClick={onClose}>
              閉じる
            </button>
          </div>
        )
      }
    >
      {modalState === "select" ? (
        <>
          {/* Permission Selection Mode */}
          <div className={styles.selectionContainer}>
            <p className={styles.modalText}>このユーザーを以下の権限へ変更します。</p>

            {/* Radio Buttons (Horizontal) */}
            <div className={styles.radioGroup}>
              {PERMISSION_OPTIONS.map((option) => (
                <label key={option.value} className={styles.radioLabel}>
                  <div
                    className={`${styles.radioCircle} ${
                      selectedPermission === option.value ? styles.selected : ""
                    }`}
                  >
                    {selectedPermission === option.value && (
                      <div className={styles.radioDot}></div>
                    )}
                  </div>
                  <input
                    type="radio"
                    name="permission"
                    value={option.value}
                    checked={selectedPermission === option.value}
                    onChange={() => setSelectedPermission(option.value as UserPermission)}
                    className={styles.hiddenRadio}
                  />
                  <span className={styles.radioText}>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Permissions Table */}
          <div className={styles.permissionTableContainer}>
            <table className={styles.permissionTable}>
              <thead>
                <tr>
                  <th>機能</th>
                  <th className={styles.adminColumn}>管理者</th>
                  <th>メンバー</th>
                </tr>
              </thead>
              <tbody>
                {PERMISSION_TABLE_DATA.map((row, index) => (
                  <tr key={index}>
                    <td>{row.feature}</td>
                    <td>
                      {row.adminCheck ? (
                        <div className={styles.checkContainer}>
                          <CheckIcon />
                          {row.adminNote && (
                            <span className={styles.noteText}>{row.adminNote}</span>
                          )}
                        </div>
                      ) : row.adminText ? (
                        <span className={styles.cellText}>{row.adminText}</span>
                      ) : null}
                    </td>
                    <td>
                      {row.memberCheck ? (
                        <div className={styles.checkContainer}>
                          <CheckIcon />
                          {row.memberNote && (
                            <span className={styles.noteText}>{row.memberNote}</span>
                          )}
                        </div>
                      ) : row.memberText ? (
                        <span className={styles.cellText}>{row.memberText}</span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
          {/* Completion Mode */}
          <div className={styles.completeContainer}>
            <p className={styles.modalText}>ユーザーを以下の権限へ変更しました。</p>
            <div className={styles.completedPermission}>
              <span>{getPermissionLabel(selectedPermission)}</span>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
}
