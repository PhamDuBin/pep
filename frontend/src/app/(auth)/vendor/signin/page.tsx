"use client";

import { useRouter } from "next/navigation";
import { SignInForm } from "@/shared/components";

/**
 * Vendor Sign-In Page
 *
 * Authentication page for vendor users.
 * Route: /vendor/sign-in
 */
export default function VendorSignInPage() {
  const router = useRouter();

  /**
   * Handle sign-in form submission
   */
  const handleSubmit = async (email: string, password: string) => {
    try {
      // TODO: Implement actual authentication logic with backend API
      console.log("Vendor sign-in:", { email, password });

      // For now, just redirect to vendor home page
      // In production, this should:
      // 1. Call the authentication API
      // 2. Store the auth token
      // 3. Redirect on success
      router.push("/vendor");
    } catch (error) {
      console.error("Sign-in error:", error);
      // TODO: Show error message to user
    }
  };

  /**
   * Handle forgot password click
   */
  const handleForgotPassword = () => {
    router.push("/vendor/signin/forgot-password");
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
      <SignInForm
        title="ベンダーサインイン"
        onSubmit={handleSubmit}
        onForgotPassword={handleForgotPassword}
      />
    </div>
  );
}
