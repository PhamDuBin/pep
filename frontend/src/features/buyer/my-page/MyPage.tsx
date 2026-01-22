"use client";

import {
  EmailChangeModal,
  AvatarChangeModal,
  Loading,
  PageTransition,
  UserInfoSection,
  PaymentInfoSection,
  Pagination,
  AddPaymentMethodModal,
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
    paymentModalState,
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
    handleAddPaymentMethodSubmit,
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
        <AddPaymentMethodModal
          isOpen={showPaymentMethodModal}
          onClose={() => setShowPaymentMethodModal(false)}
          onAddPaymentMethod={handleAddPaymentMethodSubmit}
          modalState={paymentModalState}
        />
      </div>
    </PageTransition>
  );
}
