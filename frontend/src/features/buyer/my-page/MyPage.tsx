"use client";

import {
  EmailChangeModal,
  AvatarChangeModal,
  Loading,
  PageTransition,
} from "@/shared/components";
import { useMyPage } from "./hooks";
import { UserInfoSection, PaymentInfoSection } from "./components";

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
    emailModalState,
    isSendingEmail,
    setNewPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
    setShowEmailModal,
    setShowAvatarModal,
    handleAvatarClick,
    handleEmailChangeClick,
    handleSaveAvatar,
    handleSavePassword,
    handlePageChange,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    handleSendEmailChange,
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
              user={user}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showPassword={showPassword}
              showConfirmPassword={showConfirmPassword}
              showAvatarSaveSuccess={showAvatarSaveSuccess}
              showPasswordSaveSuccess={showPasswordSaveSuccess}
              isSaving={isSaving}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              setShowPassword={setShowPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onAvatarClick={handleAvatarClick}
              onEmailChangeClick={handleEmailChangeClick}
              onSaveClick={handleSavePassword}
            />

            {/* Payment Info Section (Admin Only) */}
            {user.role === "admin" && paymentInfo && (
              <PaymentInfoSection
                paymentInfo={paymentInfo}
                paymentHistory={paymentHistory}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onDownloadClick={handleDownloadInvoice}
                onAddClick={handleAddPaymentMethod}
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
          onSend={handleSendEmailChange}
          modalState={emailModalState}
          isSaving={isSendingEmail}
        />

        {/* Avatar Change Modal */}
        <AvatarChangeModal
          isOpen={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleSaveAvatar}
          currentColor={user?.avatarColor || "#8ec5d0"}
        />
      </div>
    </PageTransition>
  );
}
