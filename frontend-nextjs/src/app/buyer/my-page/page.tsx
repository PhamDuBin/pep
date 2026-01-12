"use client";

import { useState, useCallback, useEffect } from "react";
import {
  EmailChangeModal,
  AvatarChangeModal,
  Loading,
  Pagination,
  PageTransition,
} from "@/components";
import {
  MOCK_ADMIN_USER,
  MOCK_PAYMENT_INFO,
  MOCK_PAYMENT_HISTORY,
} from "@/mocks";
import styles from "./page.module.scss";

export default function MyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(MOCK_ADMIN_USER);
  const [paymentInfo] = useState(MOCK_PAYMENT_INFO);
  const [paymentHistory] = useState(MOCK_PAYMENT_HISTORY);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAvatarSaveSuccess, setShowAvatarSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(paymentHistory.length / 10);

  // Modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Simulate loading data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);
    };
    loadData();
  }, []);

  const handleAvatarClick = useCallback(() => {
    setShowAvatarModal(true);
  }, []);

  const handleEmailChangeClick = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const handleSaveAvatar = useCallback((color: string) => {
    setUser((prev) => ({ ...prev, avatarColor: color }));
    setShowAvatarModal(false);
    setShowAvatarSaveSuccess(true);
    setTimeout(() => setShowAvatarSaveSuccess(false), 3000);
  }, []);

  const handleSavePassword = useCallback(async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    alert("変更を保存しました");
    setNewPassword("");
    setConfirmPassword("");
  }, [newPassword, confirmPassword]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleDownloadInvoice = useCallback((recordId: string) => {
    console.log("Download invoice:", recordId);
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    console.log("Add payment method");
  }, []);

  const formatAmount = (amount: number, includeTax?: boolean) => {
    const formattedAmount = amount.toLocaleString("ja-JP");
    return includeTax ? `${formattedAmount}円（税込）` : `${formattedAmount}円`;
  };

  const getPaymentMethodDisplay = () => {
    if (!paymentInfo?.paymentMethod) return "";
    const method = paymentInfo.paymentMethod;
    const typeLabel =
      method.type.charAt(0).toUpperCase() + method.type.slice(1);
    return `${typeLabel}  **** **** ${method.lastFourDigits}`;
  };

  const getStatusLabel = (status: string) => {
    return status === "paid" ? "支払い済み" : "未払い";
  };

  const handleSendEmailChange = useCallback(() => {
    setShowEmailModal(false);
    alert("確認メールを送信しました");
  }, []);

  return (
    <PageTransition>
      <div className={styles.contentWrapper}>
        {isLoading ? (
        <div className={styles.loadingState}>
          <Loading type="spinner" size="lg" />
        </div>
      ) : (
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
                  <span className={styles.successText}>
                    変更を保存しました。
                  </span>
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
                  <label className={styles.formLabel}>
                    新しいパスワード（確認）
                  </label>
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                  disabled={isSaving}
                  onClick={handleSavePassword}
                >
                  {isSaving ? "保存中..." : "変更を保存"}
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
                  <h2 className={styles.sectionTitle}>決済情報</h2>
                </div>
                <div className={styles.paymentContent}>
                  <div className={styles.infoFields}>
                    {/* Next Billing Date */}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>次回の請求日</span>
                      <span className={`${styles.infoValue} ${styles.large}`}>
                        {paymentInfo.nextBillingDate}
                      </span>
                    </div>

                    {/* Billing Amount */}
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}>請求金額</span>
                      <span className={`${styles.infoValue} ${styles.large}`}>
                        {formatAmount(
                          paymentInfo.billingAmount,
                          paymentInfo.taxIncluded
                        )}
                      </span>
                    </div>

                    {/* Payment Method */}
                    <div className={styles.paymentMethodSection}>
                      <span className={styles.infoLabel}>支払い方法</span>

                      {paymentInfo.paymentMethod && (
                        <div className={styles.paymentMethodRow}>
                          <img
                            src="/pictures/visa.png"
                            alt="Visa"
                            className={styles.cardLogo}
                            width={70}
                            height={43}
                          />
                          <span className={styles.paymentMethodText}>
                            {getPaymentMethodDisplay()}
                          </span>
                        </div>
                      )}

                      <button
                        type="button"
                        className={styles.btnAddPayment}
                        onClick={handleAddPaymentMethod}
                      >
                        支払い方法を追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History Section */}
              {paymentHistory.length > 0 && (
                <div className={styles.paymentHistorySection}>
                  <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>お支払い履歴</h2>
                  </div>
                  <div className={styles.tableContainer}>
                    <table className={styles.paymentTable}>
                      <thead>
                        <tr>
                          <th className={styles.colDate}>支払日</th>
                          <th className={styles.colAmount}>請求金額(税込)</th>
                          <th className={styles.colPeriod}>利用年月</th>
                          <th className={styles.colStatus}>ステータス</th>
                          <th className={styles.colInvoice}>請求書</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paymentHistory.map((record) => (
                          <tr key={record.id}>
                            <td className={styles.colDate}>
                              {record.paymentDate}
                            </td>
                            <td className={styles.colAmount}>
                              {formatAmount(record.amount)}
                            </td>
                            <td className={styles.colPeriod}>
                              {record.usagePeriod}
                            </td>
                            <td className={styles.colStatus}>
                              {getStatusLabel(record.status)}
                            </td>
                            <td className={styles.colInvoice}>
                              <button
                                type="button"
                                className={styles.btnDownload}
                                onClick={() => handleDownloadInvoice(record.id)}
                              >
                                Download
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Email Change Modal */}
      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmailChange}
      />

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSave={handleSaveAvatar}
        currentColor={user.avatarColor}
      />
      </div>
    </PageTransition>
  );
}
