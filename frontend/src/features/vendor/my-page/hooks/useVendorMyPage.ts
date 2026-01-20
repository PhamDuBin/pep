"use client";

import { useState, useCallback, useEffect } from "react";
import {
  VendorUserProfile,
  VendorPaymentInfo,
  VendorPaymentHistory,
} from "../models";
import {
  getVendorUserProfile,
  getVendorPaymentInfo,
  getVendorPaymentHistory,
  updateVendorAvatarColor,
  changeVendorPassword,
  requestVendorEmailChange,
  downloadVendorInvoice,
} from "../services/vendor-my-page.service";

export interface UseVendorMyPageReturn {
  // Loading state
  isLoading: boolean;
  isSaving: boolean;

  // User data
  userProfile: VendorUserProfile | null;
  paymentInfo: VendorPaymentInfo | null;
  paymentHistory: VendorPaymentHistory[];

  // Pagination state
  currentPage: number;
  totalPages: number;

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

  // Password handlers
  setNewPassword: (password: string) => void;
  setConfirmPassword: (password: string) => void;
  setShowNewPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;

  // Modal handlers
  setShowEmailModal: (show: boolean) => void;
  setShowEmailSuccessModal: (show: boolean) => void;
  setShowAvatarModal: (show: boolean) => void;

  // Action handlers
  handleEmailChangeClick: () => void;
  handleEmailSendClick: (newEmail: string, confirmEmail: string) => void;
  handleAvatarClick: () => void;
  handleAvatarSaveClick: (color: string) => void;
  handleSaveChanges: () => void;
  handlePageChange: (page: number) => void;
  handleDownloadInvoice: (invoiceUrl: string) => void;
  handleAddPaymentMethod: () => void;
  formatAmount: (amount: number, taxIncluded?: boolean) => string;
  getPaymentMethodDisplay: () => string;
  getStatusLabel: (status: string) => string;
}

export function useVendorMyPage(): UseVendorMyPageReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<VendorUserProfile | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<VendorPaymentInfo | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<VendorPaymentHistory[]>([]);

  // Password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const PAYMENT_HISTORY_PAGE_SIZE = 10;
  const totalPages = Math.ceil(paymentHistory.length / PAYMENT_HISTORY_PAGE_SIZE);

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailSuccessModal, setShowEmailSuccessModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Save success states
  const [showPasswordSaveSuccess, setShowPasswordSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileData, paymentData, historyData] = await Promise.all([
          getVendorUserProfile(),
          getVendorPaymentInfo(),
          getVendorPaymentHistory(),
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
      const result = await requestVendorEmailChange(newEmail);
      if (result.success) {
        setShowEmailModal(false);
        setShowEmailSuccessModal(true);
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
      await updateVendorAvatarColor(color);
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
      const result = await changeVendorPassword(newPassword, confirmPassword);
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
      await downloadVendorInvoice(invoiceUrl);
      console.log("Downloading invoice:", invoiceUrl);
    } catch (error) {
      console.error("Failed to download invoice:", error);
    }
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleAddPaymentMethod = useCallback(() => {
    // TODO: Implement add payment method modal
    console.log("Add payment method clicked");
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

    // Pagination state
    currentPage,
    totalPages,

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

    // Password handlers
    setNewPassword,
    setConfirmPassword,
    setShowNewPassword,
    setShowConfirmPassword,

    // Modal handlers
    setShowEmailModal,
    setShowEmailSuccessModal,
    setShowAvatarModal,

    // Action handlers
    handleEmailChangeClick,
    handleEmailSendClick,
    handleAvatarClick,
    handleAvatarSaveClick,
    handleSaveChanges,
    handlePageChange,
    handleDownloadInvoice,
    handleAddPaymentMethod,
    formatAmount,
    getPaymentMethodDisplay,
    getStatusLabel,
  };
} 
