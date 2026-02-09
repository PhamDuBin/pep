"use client";

import { useRouter } from "next/navigation";
import { ForgotPasswordForm } from "@/shared/components";

export default function VendorForgotPasswordPage() {
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    try {
      // TODO: Implement actual forgot password API call
      console.log("Vendor forgot password:", { email });

      // TODO: Show success message to user
      // For now, just redirect back to sign-in
      // router.push("/vendor-sign-in");
    } catch (error) {
      console.error("Forgot password error:", error);
      // TODO: Show error message to user
    }
  };

  const handleBack = () => {
    router.push("/vendor/signin");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#FFFFFF",
      }}
    >
      <ForgotPasswordForm
        title="パスワードを忘れた方"
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </div>
  );
}
