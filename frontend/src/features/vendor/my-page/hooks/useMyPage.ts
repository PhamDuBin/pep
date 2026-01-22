"use client";

import { useState, useCallback, useEffect } from "react";
import { UserProfile, PaymentInfo, PaymentHistory, PaymentFormData } from "../models";
import {
  getUserProfile,
  getPaymentInfo,
  getPaymentHistory,
  updateAvatarColor,
  changePassword,
  requestEmailChange,
  downloadInvoice,
  addPaymentMethod,
} from "../services/my-page.service";
import { AddPaymentModalState } from "@/shared/types";

export interface UseMyPageReturn {
  // Loading state
  isLoading: boolean;
  isSaving: boolean;

  // User data
  userProfile: UserProfile | null;
  paymentInfo: PaymentInfo | null;
  paymentHistory: PaymentHistory[];

  // Password state
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  showPasswordSaveSuccess: boolean;

  // Modal state
  showEmailModal: boolean;
  showEmailSuccessModal: boolean;
  showAvatarModal: boolean;
  showAddPaymentModal: boolean;
  paymentModalState: AddPaymentModalState;

  // Password handlers
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setShowNewPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;

  // Modal handlers
  setShowEmailModal: (show: boolean) => void;
  setShowEmailSuccessModal: (show: boolean) => void;
  setShowAvatarModal: (show: boolean) => void;
  setShowAddPaymentModal: (show: boolean) => void;

  // Action handlers
  handleEmailChangeClick: () => void;
  handleEmailSendClick: (newEmail: string, confirmEmail: string) => void;
  handleAvatarClick: () => void;
  handleAvatarSaveClick: (color: string) => void;
  handleSaveChanges: () => void;
  handleDownloadInvoice: (invoiceUrl: string) => void;
  handleAddPaymentMethod: () => void;
  handleClosePaymentModal: () => void;
  handlePaymentAdded: (data: PaymentFormData) => Promise<void>;
  formatAmount: (amount: number, taxIncluded?: boolean) => string;
  getPaymentMethodDisplay: () => string;
  getStatusLabel: (status: string) => string;
}

export function useMyPage(): UseMyPageReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailSuccessModal, setShowEmailSuccessModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [paymentModalState, setPaymentModalState] = useState<AddPaymentModalState>("form");

  // Save success states
  const [showPasswordSaveSuccess, setShowPasswordSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileData, paymentData, historyData] = await Promise.all([
          getUserProfile(),
          getPaymentInfo(),
          getPaymentHistory(),
        ]);
        setUserProfile(profileData);
        setPaymentInfo(paymentData);
        setPaymentHistory(historyData);
      } catch (error) {
        console.error("Failed to load vendor my page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleEmailChangeClick = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const handleEmailSendClick = useCallback(async (newEmail: string, _confirmEmail: string) => {
    try {
      const result = await requestEmailChange(newEmail);
      if (result.success) {
        setShowEmailModal(false);
        setShowEmailSuccessModal(true);
        setUserProfile((prev) => (prev ? { ...prev, email: newEmail } : null));
      }
    } catch (error) {
      console.error("Failed to request email change:", error);
    }
  }, []);

  const handleAvatarClick = useCallback(() => {
    setShowAvatarModal(true);
  }, []);

  const handleAvatarSaveClick = useCallback(async (color: string) => {
    try {
      await updateAvatarColor(color);
      setUserProfile((prev) => prev ? { ...prev, avatarColor: color } : null);
      setShowAvatarModal(false);
    } catch (error) {
      console.error("Failed to update avatar color:", error);
    }
  }, []);

  const handleSaveChanges = useCallback(async () => {
    if (newPassword && newPassword !== confirmPassword) {
      alert("パスワードが一致しません");
      return;
    }

    setIsSaving(true);
    try {
      const result = await changePassword(newPassword, confirmPassword);
      if (result.success) {
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSaveSuccess(true);
        // Hide success message after 3 seconds
        setTimeout(() => setShowPasswordSaveSuccess(false), 3000);
      } else {
        alert(result.message || "変更に失敗しました");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  }, [newPassword, confirmPassword]);

  const handleDownloadInvoice = useCallback(async (invoiceUrl: string) => {
    try {
      await downloadInvoice(invoiceUrl);
      console.log("Downloading invoice:", invoiceUrl);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    setShowAddPaymentModal(true);
  }, []);

  const handleClosePaymentModal = useCallback(() => {
    setShowAddPaymentModal(false);
    setPaymentModalState("form"); // Reset to form state when closing
  }, []);

  const handlePaymentAdded = useCallback(async (data: PaymentFormData) => {
    try {
      await addPaymentMethod(data);
      console.log("Payment method added:", data);
      // Show success state after API succeeds
      setPaymentModalState("success");
      // Refresh payment info after adding payment method
      const info = await getPaymentInfo();
      setPaymentInfo(info);
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  }, []);

  const formatAmount = useCallback((amount: number, taxIncluded?: boolean) => {
    return `¥${amount.toLocaleString("ja-JP")}${taxIncluded ? " (税込)" : ""}`;
  }, []);

  const getPaymentMethodDisplay = useCallback(() => {
    if (!paymentInfo?.paymentMethod) return "";
    const { type, lastFourDigits } = paymentInfo.paymentMethod;
    return `${type.toUpperCase()} ****${lastFourDigits}`;
  }, [paymentInfo]);

  const getStatusLabel = useCallback((status: string) => {
    switch (status) {
      case "paid":
        return "支払い済み";
      case "pending":
        return "保留中";
      case "failed":
        return "失敗";
      default:
        return status;
    }
  }, []);

  return {
    // Loading state
    isLoading,
    isSaving,

    // User data
    userProfile,
    paymentInfo,
    paymentHistory,

    // Password state
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    showPasswordSaveSuccess,

    // Modal state
    showEmailModal,
    showEmailSuccessModal,
    showAvatarModal,
    showAddPaymentModal,
    paymentModalState,

    // Password handlers
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,

    // Modal handlers
    setShowEmailModal,
    setShowEmailSuccessModal,
    setShowAvatarModal,
    setShowAddPaymentModal,

    // Action handlers
    handleEmailChangeClick,
    handleEmailSendClick,
    handleAvatarClick,
    handleAvatarSaveClick,
    handleSaveChanges,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    handleClosePaymentModal,
    handlePaymentAdded,
    formatAmount,
    getPaymentMethodDisplay,
    getStatusLabel,
  };
}
