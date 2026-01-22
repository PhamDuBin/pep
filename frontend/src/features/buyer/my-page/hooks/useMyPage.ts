"use client";

import { useState, useCallback, useEffect } from "react";
import { UserProfile, PaymentInfo, PaymentHistoryRecord, PaymentFormData } from "../models";
import {
  getUserProfile,
  getPaymentInfo,
  getPaymentHistory,
  updateAvatarColor,
  changePassword as changePasswordService,
  requestEmailChange,
  downloadInvoice as downloadInvoiceService,
  addPaymentMethod,
} from "../services/my-page.service";
import { EmailChangeModalState, AddPaymentModalState } from "@/shared/types";
import { PASSWORD_ERRORS, GENERAL_ERRORS } from "@/shared/errors/error-messages";

export interface UseMyPageReturn {
  // Loading state
  isLoading: boolean;
  isSaving: boolean;

  // User data
  user: UserProfile | null;
  paymentInfo: PaymentInfo | null;
  paymentHistory: PaymentHistoryRecord[];

  // Password state
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  showAvatarSaveSuccess: boolean;
  showPasswordSaveSuccess: boolean;

  // Modal state
  showEmailModal: boolean;
  showAvatarModal: boolean;
  showPaymentMethodModal: boolean;
  paymentModalState: AddPaymentModalState;
  emailModalState: EmailChangeModalState;
  isSendingEmail: boolean;

  // Password handlers
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;

  // Modal handlers
  setShowEmailModal: (show: boolean) => void;
  setShowAvatarModal: (show: boolean) => void;
  setShowPaymentMethodModal: (show: boolean) => void;

  // Action handlers
  handleAvatarClick: () => void;
  handleEmailChangeClick: () => void;
  handleAvatarSaveClick: (color: string) => void;
  handleSavePassword: () => Promise<void>;
  handleDownloadInvoice: (recordId: string) => void;
  handleAddPaymentMethod: () => void;
  handleClosePaymentModal: () => void;
  handleAddPaymentMethodSubmit: (data: any) => void;
  handleEmailSendClick: (newEmail: string, confirmEmail: string) => void;
  handleCloseEmailModal: () => void;

  // Utility functions
  formatAmount: (amount: number, includeTax?: boolean) => string;
  getPaymentMethodDisplay: () => string;
  getStatusLabel: (status: string) => string;
}

export function useMyPage(): UseMyPageReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryRecord[]>([]);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAvatarSaveSuccess, setShowAvatarSaveSuccess] = useState(false);
  const [showPasswordSaveSuccess, setShowPasswordSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [paymentModalState, setPaymentModalState] = useState<AddPaymentModalState>("form");
  const [emailModalState, setEmailModalState] =
    useState<EmailChangeModalState>("email-change");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [userData, paymentData, historyData] = await Promise.all([
          getUserProfile(),
          getPaymentInfo(),
          getPaymentHistory(),
        ]);
        setUser(userData);
        setPaymentInfo(paymentData);
        setPaymentHistory(historyData);
      } catch (error) {
        console.error("Failed to load my page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAvatarClick = useCallback(() => {
    setShowAvatarModal(true);
  }, []);

  const handleEmailChangeClick = useCallback(() => {
    setEmailModalState("email-change");
    setShowEmailModal(true);
  }, []);

  const handleCloseEmailModal = useCallback(() => {
    setShowEmailModal(false);
    setEmailModalState("email-change");
  }, []);

  const handleAvatarSaveClick = useCallback(async (color: string) => {
    try {
      await updateAvatarColor(color);
      setUser((prev) => (prev ? { ...prev, avatarColor: color } : null));
      setShowAvatarModal(false);
      setShowAvatarSaveSuccess(true);
      setTimeout(() => setShowAvatarSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Failed to save avatar:", error);
    }
  }, []);

  const handleSavePassword = useCallback(async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert(PASSWORD_ERRORS.MISMATCH);
      return;
    }
    setIsSaving(true);
    try {
      const result = await changePasswordService(newPassword, confirmPassword);
      if (result.success) {
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSaveSuccess(true);
        setTimeout(() => setShowPasswordSaveSuccess(false), 3000);
      } else {
        alert(result.message || GENERAL_ERRORS.CHANGE_FAILED);
      }
    } catch (error) {
      console.error("Failed to change password:", error);
    } finally {
      setIsSaving(false);
    }
  }, [newPassword, confirmPassword]);

  const handleDownloadInvoice = useCallback(async (recordId: string) => {
    try {
      await downloadInvoiceService(recordId);
      console.log("Download invoice:", recordId);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    setShowPaymentMethodModal(true);
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setShowPaymentMethodModal(false);
    setPaymentModalState("form"); // Reset to form state when closing
  }, []);

  const handleAddPaymentMethodSubmit = useCallback(async (data: PaymentFormData) => {
    try {
      await addPaymentMethod(data);
      console.log("Adding payment method:", data);
      setPaymentModalState("success");
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  }, []);

  const formatAmount = useCallback((amount: number, includeTax?: boolean) => {
    const formattedAmount = amount.toLocaleString("ja-JP");
    return includeTax ? `${formattedAmount}円（税込）` : `${formattedAmount}円`;
  }, []);

  const getPaymentMethodDisplay = useCallback(() => {
    if (!paymentInfo?.paymentMethod) return "";
    const method = paymentInfo.paymentMethod;
    const typeLabel =
      method.type.charAt(0).toUpperCase() + method.type.slice(1);
    return `${typeLabel}  **** **** ${method.lastFourDigits}`;
  }, [paymentInfo]);

  const getStatusLabel = useCallback((status: string) => {
    return status === "paid" ? "支払い済み" : "未払い";
  }, []);

  const handleEmailSendClick = useCallback(
    async (newEmail: string, _confirmEmail: string) => {
      setIsSendingEmail(true);
      try {
        const result = await requestEmailChange(newEmail);
        if (result.success) {
          setEmailModalState("email-sent");
          setUser((prev) => (prev ? { ...prev, email: newEmail } : null));
        }
      } catch (error) {
        console.error("Failed to request email change:", error);
      } finally {
        setIsSendingEmail(false);
      }
    },
    []
  );

  return {
    // Loading state
    isLoading,
    isSaving,

    // User data
    user,
    paymentInfo,
    paymentHistory,

    // Password state
    newPassword,
    confirmPassword,
    showPassword,
    showConfirmPassword,
    showAvatarSaveSuccess,
    showPasswordSaveSuccess,

    // Modal state
    showEmailModal,
    showAvatarModal,
    showPaymentMethodModal,
    paymentModalState,
    emailModalState,
    isSendingEmail,

    // Password handlers
    setNewPassword,
    setConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,

    // Modal handlers
    setShowEmailModal,
    setShowAvatarModal,
    setShowPaymentMethodModal,

    // Action handlers
    handleAvatarClick,
    handleEmailChangeClick,
    handleAvatarSaveClick,
    handleSavePassword,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    handleClosePaymentModal,
    handleAddPaymentMethodSubmit,
    handleEmailSendClick,
    handleCloseEmailModal,

    // Utility functions
    formatAmount,
    getPaymentMethodDisplay,
    getStatusLabel,
  };
}
