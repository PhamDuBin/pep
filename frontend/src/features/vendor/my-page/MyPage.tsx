"use client";

import { EmailChangeModal, AvatarChangeModal, Loading, PageTransition } from "@/shared/components";
import { InfoModal } from "@/features/vendor/shared/components";
import { useVendorMyPage } from "./hooks";
import { UserInfoSection, PaymentInfoSection } from "./components";

export function MyPage() {
  const {
    isLoading,
    isSaving,
    userProfile,
    paymentInfo,
    paymentHistory,
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
    handleDownloadInvoice,
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
              userProfile={userProfile}
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              showPasswordSaveSuccess={showPasswordSaveSuccess}
              isSaving={isSaving}
              setNewPassword={setNewPassword}
              setConfirmPassword={setConfirmPassword}
              setShowNewPassword={setShowNewPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              onAvatarClick={handleAvatarClick}
              onEmailChangeClick={handleEmailChangeClick}
              onSaveChanges={handleSaveChanges}
            />

            {/* Payment Info Section */}
            {paymentInfo && (
              <PaymentInfoSection
                paymentInfo={paymentInfo}
                paymentHistory={paymentHistory}
                onDownloadInvoice={handleDownloadInvoice}
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
