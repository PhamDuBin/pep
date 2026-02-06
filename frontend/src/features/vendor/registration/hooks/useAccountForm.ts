import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { AccountFormData, AccountFormErrors } from "../models";

export function useAccountForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<AccountFormData>({
    companyName: "",
    industry: "",
    employeeCount: "",
    businessDescription: "",
    serviceDescription: "",
    corporateUrl: "",
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

    // Business Description validation (10-100 characters)
    if (!formData.businessDescription.trim()) {
      newErrors.businessDescription = "事業内容は必須項目です";
    } else if (
      formData.businessDescription.length < 10 ||
      formData.businessDescription.length > 100
    ) {
      newErrors.businessDescription = "100文字以内で記入してください";
    }

    // Service Description validation (10-100 characters)
    if (!formData.serviceDescription.trim()) {
      newErrors.serviceDescription = "サービス説明は必須項目です";
    } else if (
      formData.serviceDescription.length < 10 ||
      formData.serviceDescription.length > 100
    ) {
      newErrors.serviceDescription = "100文字以内で記入してください";
    }

    // Corporate URL validation
    if (!formData.corporateUrl.trim()) {
      newErrors.corporateUrl = "コーポレートサイトURLは必須項目です";
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
      router.push("/vendor/register/regist-info/payment");
    }
  };

  const handleTextareaChange = (
    e: ChangeEvent<HTMLTextAreaElement>,
    field: "businessDescription" | "serviceDescription"
  ) => {
    const value = e.target.value;
    // Limit to 100 characters
    if (value.length <= 100) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  return {
    formData,
    setFormData,
    errors,
    handleSubmit,
    handleTextareaChange,
  };
}
