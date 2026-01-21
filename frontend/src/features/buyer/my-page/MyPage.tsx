"use client";

import {
  EmailChangeModal,
  AvatarChangeModal,
  Loading,
  PageTransition,
  UserInfoSection,
  PaymentInfoSection,
  Pagination,
} from "@/shared/components";
import { useMyPage } from "./hooks";

export function MyPage() {
  const {
    isLoading,
    isSaving,
    user,
    paymentInfo,
    paymentHistory,
    newPassword,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    showAvatarSaveSuccess,
    showPasswordSaveSuccess,
    currentPage,
    totalPages,
    showEmailModal,
    showAvatarModal,
    showPaymentMethodModal,
    emailModalState,
    isSendingEmail,
    setNewPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setShowAvatarModal,
    setShowPaymentMethodModal,
    handleAvatarClick,
    handleEmailChangeClick,
    handleAvatarSaveClick,
    handleSavePassword,
    handlePageChange,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    handleEmailSendClick,
    handleCloseEmailModal,
    formatAmount,
    getPaymentMethodDisplay,
    getStatusLabel,
  } = useMyPage();

  return (
    <PageTransition>
      <div className="flex flex-col gap-[25px] w-full px-[50px] py-[25px]">
        {isLoading || !user ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <Loading type="spinner" size="lg" />
          </div>
        ) : (
          <div className="flex flex-col gap-[35px]">
            {/* User Info Section */}
            <UserInfoSection
              user={{
                id: user.id,
                name: user.name,
                email: user.email,
                initials: user.initials,
                avatarColor: user.avatarColor,
                role: user.role,
              }}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showNewPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              showSaveSuccess={showAvatarSaveSuccess || showPasswordSaveSuccess}
              isSaving={isSaving}
              onNewPasswordChange={setNewPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onToggleNewPassword={setShowPassword}
              onToggleConfirmPassword={setShowConfirmPassword}
              onAvatarClick={handleAvatarClick}
              onEmailChangeClick={handleEmailChangeClick}
              onSaveClick={handleSavePassword}
            />

            {/* Payment Info Section (Admin Only) */}
            {user.role === "admin" && paymentInfo && (
              <PaymentInfoSection
                paymentInfo={{
                  nextBillingDate: paymentInfo.nextBillingDate,
                  billingAmount: paymentInfo.billingAmount,
                  taxIncluded: paymentInfo.taxIncluded,
                  paymentMethod: paymentInfo.paymentMethod
                    ? {
                        id: paymentInfo.paymentMethod.id || "default",
                        type: paymentInfo.paymentMethod.type,
                        lastFourDigits: paymentInfo.paymentMethod.lastFourDigits,
                      }
                    : null,
                }}
                paymentHistory={paymentHistory.map((record) => ({
                  id: record.id,
                  paymentDate: record.paymentDate,
                  amount: record.amount,
                  usagePeriod: record.usagePeriod,
                  status: record.status as any,
                }))}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                handleDownloadInvoice={handleDownloadInvoice}
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
          onClose={handleCloseEmailModal}
          onEmailSendClick={handleEmailSendClick}
          modalState={emailModalState}
          isSaving={isSendingEmail}
        />

        {/* Avatar Change Modal */}
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onAvatarSaveClick={handleAvatarSaveClick}
          currentColor={user?.avatarColor || "#8ec5d0"}
        />

        {/* Payment Method Modal */}
        {showPaymentMethodModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-[30px] max-w-[500px] w-full">
              <h2 className="font-bold text-[20px] mb-[20px]">支払い方法を追加</h2>
              <p className="text-gray-600 mb-[30px]">
                クレジットカード情報を入力してください。
              </p>
              <div className="flex gap-[10px]">
                <button
                  onClick={() => setShowPaymentMethodModal(false)}
                  className="flex-1 px-[15px] py-[10px] bg-gray-300 border-none rounded-[8px] font-normal text-[14px] cursor-pointer"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement payment method addition
                    setShowPaymentMethodModal(false);
                  }}
                  className="flex-1 px-[15px] py-[10px] bg-blue-500 text-white border-none rounded-[8px] font-normal text-[14px] cursor-pointer"
                >
                  追加
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
