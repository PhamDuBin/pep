"use client";

import {
  EmailChangeModal,
  AvatarChangeModal,
  Loading,
  PageTransition,
  UserInfoSection,
  PaymentInfoSection,
} from "@/shared/components";
import { InfoModal } from "@/features/vendor/shared/components";
import { useVendorMyPage } from "./hooks";

export function MyPage() {
  const {
    isLoading,
    isSaving,
    userProfile,
    paymentInfo,
    paymentHistory,
    currentPage,
    totalPages,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    showPasswordSaveSuccess,
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
    handleEmailChangeClick,
    handleEmailSendClick,
    handleAvatarClick,
    handleAvatarSaveClick,
    handleSaveChanges,
    handlePageChange,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    formatAmount,
    getPaymentMethodDisplay,
    getStatusLabel,
  } = useVendorMyPage();

  return (
    <PageTransition>
      <div className="flex flex-col gap-[25px] w-full px-[50px] py-[25px]">
        {isLoading || !userProfile ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loading type="spinner" size="lg" />
          </div>
        ) : (
          <div className="flex flex-col gap-[35px]">
            {/* User Info Section */}
            <UserInfoSection
              user={{
                id: userProfile.id,
                name: userProfile.name,
                email: userProfile.email,
                initials: userProfile.initials,
                avatarColor: userProfile.avatarColor,
                role: "member",
              }}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              showSaveSuccess={showPasswordSaveSuccess}
              isSaving={isSaving}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onToggleNewPassword={setShowNewPassword}
              onToggleConfirmPassword={setShowConfirmPassword}
              onAvatarClick={handleAvatarClick}
              onEmailChangeClick={handleEmailChangeClick}
              onSaveClick={handleSaveChanges}
            />

            {/* Payment Info Section */}
            {paymentInfo && (
              <PaymentInfoSection
                paymentInfo={{
                  nextBillingDate: paymentInfo.nextPaymentDate,
                  billingAmount: paymentInfo.amount,
                  taxIncluded: true,
                  paymentMethod: paymentInfo.paymentMethod
                    ? {
                        id: `vendor-payment-${paymentInfo.paymentMethod.lastFourDigits}`,
                        type: paymentInfo.paymentMethod.type as any,
                        lastFourDigits: paymentInfo.paymentMethod.lastFourDigits,
                      }
                    : null,
                }}
                paymentHistory={paymentHistory.map((record) => ({
                  id: record.id,
                  paymentDate: record.paymentDate,
                  amount: record.amount,
                  usagePeriod: record.billingPeriod,
                  status: record.status as any,
                  invoiceUrl: record.invoiceUrl,
                }))}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                handleDownloadInvoice={(invoiceUrl) => {
                  handleDownloadInvoice(invoiceUrl);
                }}
                handleAddPaymentMethod={handleAddPaymentMethod}
                formatAmount={formatAmount}
                getPaymentMethodDisplay={getPaymentMethodDisplay}
                getStatusLabel={getStatusLabel}
              />
            )}
          </div>
        )}

        {/* Email Change Modal */}
        <EmailChangeModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onEmailSendClick={handleEmailSendClick}
        />

        {/* Email Success Modal */}
        <InfoModal
          isOpen={showEmailSuccessModal}
          onClose={() => setShowEmailSuccessModal(false)}
          title="メールアドレスを変更"
          message={"ご入力いただいたメールアドレスへ再設定用URLを送信しました。\nメール内のURLをクリックすると、\nメールアドレス変更が完了いたします。"}
        />

        {/* Avatar Change Modal */}
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onAvatarSaveClick={handleAvatarSaveClick}
          currentColor={userProfile?.avatarColor || "#8ec5d0"}
        />
      </div>
    </PageTransition>
  );
}
