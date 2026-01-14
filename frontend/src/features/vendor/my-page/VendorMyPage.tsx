"use client";

import Image from "next/image";
import { EmailChangeModal, AvatarChangeModal } from "@/shared/components";
import { InfoModal } from "@/features/vendor/shared/components";
import { useVendorMyPage } from "./hooks";
import styles from "./VendorMyPage.module.scss";

export function VendorMyPage() {
  const {
    isLoading,
    userProfile,
    paymentInfo,
    paymentHistory,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    showEmailModal,
    showEmailSuccessModal,
    showAvatarModal,
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    setShowEmailModal,
    setShowEmailSuccessModal,
    setShowAvatarModal,
    handleEmailChange,
    handleEmailSent,
    handleAvatarUpload,
    handleAvatarColorChange,
    handleSaveChanges,
    handleDownloadInvoice,
  } = useVendorMyPage();

  if (isLoading || !userProfile || !paymentInfo) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Section 1: User Information */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>ユーザー情報</h2>
        </div>

        <div className={styles.sectionContent}>
          {/* Avatar Section */}
          <div className={styles.avatarSection}>
            <div
              className={styles.userAvatar}
              style={{ backgroundColor: userProfile.avatarColor }}
            >
              <span>{userProfile.initials}</span>
            </div>
            <button
              type="button"
              className={styles.uploadButton}
              onClick={handleAvatarUpload}
            >
              アイコンを変更
            </button>
          </div>

          {/* Form Fields */}
          <div className={styles.formFields}>
            {/* Name Field */}
            <div className={styles.formRow}>
              <span className={styles.label}>氏名</span>
              <span className={styles.value}>{userProfile.name}</span>
            </div>

            {/* Email Field */}
            <div className={styles.formRow}>
              <span className={styles.label}>メールアドレスを変更</span>
              <span className={styles.value}>{userProfile.email}</span>
              <button
                type="button"
                className={styles.linkButton}
                onClick={handleEmailChange}
              >
                メールアドレスを変更
              </button>
            </div>

            {/* Current Password */}
            <div className={styles.formRow}>
              <span className={styles.label}>現在のパスワード</span>
              <input
                type="password"
                readOnly
                placeholder="**********"
                className={styles.readonlyInput}
              />
            </div>

            {/* New Password */}
            <div className={styles.formRow}>
              <span className={styles.label}>新しいパスワード</span>
              <div className={styles.passwordInput}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="8~16文字の英数字で入力"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? "非表示" : "表示"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className={styles.formRow}>
              <span className={styles.label}>新しいパスワード（確認）</span>
              <div className={styles.passwordInput}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="8~16文字の英数字で入力"
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "非表示" : "表示"}
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="button"
            className={styles.saveButton}
            onClick={handleSaveChanges}
          >
            変更を保存
          </button>
        </div>
      </section>

      {/* Section 2: Payment Information */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>決済情報</h2>
        </div>

        <div className={styles.paymentContent}>
          <div className={styles.paymentInfo}>
            {/* Next Payment Date */}
            <div className={styles.paymentRow}>
              <span className={styles.paymentLabel}>次回の請求日</span>
              <span className={styles.paymentValue}>
                {paymentInfo.nextPaymentDate}
              </span>
            </div>

            {/* Amount */}
            <div className={styles.paymentRow}>
              <span className={styles.paymentLabel}>請求金額</span>
              <span className={styles.paymentValue}>
                {paymentInfo.amount.toLocaleString()}円（税込）
              </span>
            </div>

            {/* Payment Method */}
            <div className={styles.paymentMethodSection}>
              <span className={styles.paymentLabel}>支払い方法</span>
              <div className={styles.paymentMethodRow}>
                <Image
                  src="/assets/pictures/visa.png"
                  alt="Visa"
                  width={70}
                  height={43}
                  className={styles.cardIcon}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className={styles.cardNumber}>
                  Visa **** **** {paymentInfo.paymentMethod.lastFourDigits}
                </span>
              </div>
              <button type="button" className={styles.addPaymentButton}>
                支払い方法を追加
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Payment History */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>お支払い履歴</h2>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.paymentTable}>
            <thead>
              <tr>
                <th>支払日</th>
                <th>請求金額(税込)</th>
                <th>利用年月</th>
                <th>ステータス</th>
                <th>請求書</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.paymentDate}</td>
                  <td>{payment.amount.toLocaleString()}円</td>
                  <td>{payment.billingPeriod}</td>
                  <td>{payment.status}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.downloadLink}
                      onClick={() => handleDownloadInvoice(payment.invoiceUrl)}
                    >
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Email Change Modal */}
      <EmailChangeModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleEmailSent}
      />

      {/* Email Success Modal */}
      <InfoModal
        isOpen={showEmailSuccessModal}
        onClose={() => setShowEmailSuccessModal(false)}
        title="確認メールを送信しました"
        message="入力されたメールアドレスに確認メールを送信しました。メール内のリンクをクリックして変更を完了してください。"
      />

      {/* Avatar Change Modal */}
      <AvatarChangeModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSave={handleAvatarColorChange}
        currentColor={userProfile.avatarColor}
      />
    </div>
  );
}
