"use client";

import { useState, useCallback } from "react";
import { Modal } from "@/components";
import {
  MOCK_ADMIN_USER,
  MOCK_PAYMENT_INFO,
  MOCK_PAYMENT_HISTORY,
  AVATAR_COLOR_OPTIONS,
} from "@/mocks";
import styles from "./page.module.scss";

export default function MyPage() {
  const [user, setUser] = useState(MOCK_ADMIN_USER);
  const [paymentInfo] = useState(MOCK_PAYMENT_INFO);
  const [paymentHistory] = useState(MOCK_PAYMENT_HISTORY);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAvatarSaveSuccess, setShowAvatarSaveSuccess] = useState(false);

  // Modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");

  const handleAvatarClick = useCallback(() => {
    setShowAvatarModal(true);
  }, []);

  const handleEmailChangeClick = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const handleSelectColor = useCallback((color: string) => {
    setUser(prev => ({ ...prev, avatarColor: color }));
  }, []);

  const handleSaveAvatar = useCallback(() => {
    setShowAvatarModal(false);
    setShowAvatarSaveSuccess(true);
    setTimeout(() => setShowAvatarSaveSuccess(false), 3000);
  }, []);

  const handleSavePassword = useCallback(() => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    alert("変更を保存しました");
    setNewPassword("");
    setConfirmPassword("");
  }, [newPassword, confirmPassword]);

  const handleSendEmailChange = useCallback(() => {
    setShowEmailModal(false);
    alert("確認メールを送信しました");
    setNewEmail("");
    setConfirmEmail("");
  }, []);

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.pageContent}>
        {/* User Info Section */}
        <div className={styles.userInfoSection}>
          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>ユーザー情報</h2>
          </div>

          {/* Section Content */}
          <div className={styles.sectionContent}>
            {/* Avatar Row */}
            <div className={styles.avatarRow}>
              <div
                className={styles.avatar}
                style={{ backgroundColor: user.avatarColor || "#8ec5d0" }}
                onClick={handleAvatarClick}
              >
                <span className={styles.avatarInitials}>{user.initials}</span>
              </div>
              <button
                type="button"
                className={styles.btnSelectImage}
                onClick={handleAvatarClick}
              >
                画像を選択
              </button>
            </div>

            {/* Success Message */}
            {showAvatarSaveSuccess && (
              <div className={styles.successMessage}>
                <span className={styles.successText}>変更を保存しました。</span>
              </div>
            )}

            {/* Form Fields */}
            <div className={styles.formFields}>
              {/* Name Field */}
              <div className={styles.formRow}>
                <label className={styles.formLabel}>氏名</label>
                <div className={styles.formValue}>
                  <span className={styles.valueText}>{user.name}</span>
                </div>
              </div>

              {/* Email Field */}
              <div className={styles.formRow}>
                <label className={styles.formLabel}>メールアドレス</label>
                <div className={`${styles.formValue} ${styles.emailField}`}>
                  <span className={styles.valueText}>{user.email}</span>
                  <button
                    type="button"
                    className={styles.btnLink}
                    onClick={handleEmailChangeClick}
                  >
                    メールアドレスを変更
                  </button>
                </div>
              </div>

              {/* Current Password Field */}
              <div className={styles.formRow}>
                <label className={styles.formLabel}>現在のパスワード</label>
                <div className={styles.formValue}>
                  <span className={styles.valueText}>**********</span>
                </div>
              </div>

              {/* New Password Field */}
              <div className={styles.formRow}>
                <label className={styles.formLabel}>新しいパスワード</label>
                <div className={styles.formInputWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={styles.formInput}
                    placeholder="8〜16文字の英数字で入力"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.btnToggleVisibility}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                        fill="#808080"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className={styles.formRow}>
                <label className={styles.formLabel}>新しいパスワード（確認）</label>
                <div className={styles.formInputWrapper}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className={styles.formInput}
                    placeholder="8〜16文字の英数字で入力"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className={styles.btnToggleVisibility}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z"
                        fill="#808080"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className={styles.saveButtonWrapper}>
              <button
                type="button"
                className={styles.btnSave}
                onClick={handleSavePassword}
              >
                変更を保存
              </button>
            </div>
          </div>
        </div>

        {/* Payment Info Section (Admin Only) */}
        {user.role === "admin" && paymentInfo && (
          <>
            {/* Payment Info Section */}
            <div className={styles.paymentInfoSection}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>お支払い情報</h2>
              </div>
              <div className={styles.paymentContent}>
                <div className={styles.paymentRow}>
                  <span className={styles.paymentLabel}>次回お支払い日</span>
                  <span className={styles.paymentValue}>{paymentInfo.nextBillingDate}</span>
                </div>
                <div className={styles.paymentRow}>
                  <span className={styles.paymentLabel}>お支払い金額</span>
                  <span className={styles.paymentValue}>
                    ¥{paymentInfo.billingAmount.toLocaleString()}
                    {paymentInfo.taxIncluded && " (税込)"}
                  </span>
                </div>
                {paymentInfo.paymentMethod && (
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>お支払い方法</span>
                    <span className={styles.paymentValue}>
                      {paymentInfo.paymentMethod.type.toUpperCase()} ****
                      {paymentInfo.paymentMethod.lastFourDigits}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Payment History Section */}
            {paymentHistory.length > 0 && (
              <div className={styles.paymentHistorySection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>お支払い履歴</h2>
                </div>
                <div className={styles.tableWrapper}>
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>お支払い日</th>
                        <th>金額</th>
                        <th>利用期間</th>
                        <th>ステータス</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((record) => (
                        <tr key={record.id}>
                          <td>{record.paymentDate}</td>
                          <td>¥{record.amount.toLocaleString()}</td>
                          <td>{record.usagePeriod}</td>
                          <td>
                            <span className={styles.statusBadge}>
                              {record.status === "paid" ? "支払済" : "未払い"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Email Change Modal */}
      <Modal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="メールアドレスの変更"
        size="sm"
      >
        <div className={styles.modalContent}>
          <div className={styles.modalFormGroup}>
            <label>新しいメールアドレス</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="新しいメールアドレスを入力"
            />
          </div>
          <div className={styles.modalFormGroup}>
            <label>新しいメールアドレス（確認）</label>
            <input
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              placeholder="新しいメールアドレスを再入力"
            />
          </div>
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowEmailModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleSendEmailChange}
            disabled={!newEmail || !confirmEmail}
          >
            送信
          </button>
        </div>
      </Modal>

      {/* Avatar Change Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="アイコンカラーを選択"
        size="sm"
      >
        <div className={styles.avatarColorGrid}>
          {AVATAR_COLOR_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`${styles.colorOption} ${
                user.avatarColor === option.color ? styles.selected : ""
              }`}
              style={{ backgroundColor: option.color }}
              onClick={() => handleSelectColor(option.color)}
            />
          ))}
        </div>
        <div className={styles.modalActions}>
          <button
            type="button"
            className="modal-btn-secondary"
            onClick={() => setShowAvatarModal(false)}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="modal-btn-primary-color"
            onClick={handleSaveAvatar}
          >
            保存
          </button>
        </div>
      </Modal>
    </div>
  );
}
