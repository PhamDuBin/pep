"use client";

import { useRouter } from "next/navigation";
import { PaymentRegistrationForm } from "@/features/vendor/registration/components";
import { PaymentsFormData } from "@/shared/models/auth.model";

export default function PaymentPage() {
  const router = useRouter();

  const handleSubmit = async (data: PaymentsFormData) => {
    console.log("Payment form submitted:", data);

    // TODO: Implement payment processing
    // await registrationService.registerPayment(data);

    // Navigate to success or next step
    // router.push("/vendor/dashboard");
  };

  const handleSkip = () => {
    console.log("Payment skipped");

    // Navigate to dashboard or next step
    // router.push("/vendor/dashboard");
  };

  return (
    <PaymentRegistrationForm onSubmit={handleSubmit} onSkip={handleSkip} />
  );
}
