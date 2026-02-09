import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AccountFormData, AccountFormErrors } from "../models";

export function useAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountFormData>({
    companyName: "",
    industry: "",
    employeeCount: "",
    purposes: [],
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
  });

  const [errors, setErrors] = useState<AccountFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: AccountFormErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "会社名は必須項目です";
    }

    if (!formData.industry) {
      newErrors.industry = "業種を選択してください";
    }

    if (!formData.employeeCount) {
      newErrors.employeeCount = "従業員数を選択してください";
    }

    if (formData.purposes.length === 0) {
      newErrors.purposes = "利用目的を選択してください";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "氏名は必須項目です";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "氏名は必須項目です";
    }

    if (!formData.lastNameKana.trim()) {
      newErrors.lastNameKana = "氏名（フリガナ）は必須項目です";
    }

    if (!formData.firstNameKana.trim()) {
      newErrors.firstNameKana = "氏名（フリガナ）は必須項目です";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      router.push("/buyer/register/regist-info/payment");
    }
  };

  const togglePurpose = (purpose: string) => {
    setFormData((prev) => ({
      ...prev,
      purposes: prev.purposes.includes(purpose)
        ? prev.purposes.filter((p) => p !== purpose)
        : [...prev.purposes, purpose],
    }));
  };

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
    togglePurpose,
  };
}
