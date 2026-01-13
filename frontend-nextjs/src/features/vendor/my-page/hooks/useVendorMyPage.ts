"use client";

import { useState, useCallback, useEffect } from "react";
import {
  VendorUserProfile,
  VendorPaymentInfo,
  VendorPaymentHistory,
} from "../types";
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

  // User data
  userProfile: VendorUserProfile | null;
  paymentInfo: VendorPaymentInfo | null;
  paymentHistory: VendorPaymentHistory[];

  // Password state
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;

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
  handleEmailChange: () => void;
  handleEmailSent: (newEmail: string, confirmEmail: string) => void;
  handleAvatarUpload: () => void;
  handleAvatarColorChange: (color: string) => void;
  handleSaveChanges: () => void;
  handleDownloadInvoice: (invoiceUrl: string) => void;
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

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showEmailSuccessModal, setShowEmailSuccessModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

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

  const handleEmailChange = useCallback(() => {
    setShowEmailModal(true);
  }, []);

  const handleEmailSent = useCallback(async (newEmail: string, confirmEmail: string) => {
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

  const handleAvatarUpload = useCallback(() => {
    setShowAvatarModal(true);
  }, []);

  const handleAvatarColorChange = useCallback(async (color: string) => {
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

    try {
      const result = await changeVendorPassword(newPassword, confirmPassword);
      if (result.success) {
        alert("変更を保存しました");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        alert(result.message || "変更に失敗しました");
      }
    } catch (error) {
      console.error("Failed to save changes:", error);
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

  return {
    // Loading state
    isLoading,

    // User data
    userProfile,
    paymentInfo,
    paymentHistory,

    // Password state
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,

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
    handleEmailChange,
    handleEmailSent,
    handleAvatarUpload,
    handleAvatarColorChange,
    handleSaveChanges,
    handleDownloadInvoice,
  };
}
