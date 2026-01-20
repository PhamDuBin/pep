"use client";

// =============================================================================
// PROJECT PLAN HOOK
// =============================================================================

import { useState, useCallback, useMemo, useEffect } from "react";
import { ChatMessage, Vendor } from "../models";
import { DownloadFormat } from "../types";
import {
  getVendors,
  generateProjectPlan,
  downloadProjectPlan,
  sendRfpToVendors,
} from "../services/project-plan.service";

export function useProjectPlan() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<DownloadFormat>("pdf");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showRfpConfirmModal, setShowRfpConfirmModal] = useState(false);
  const [showVendorSelectionModal, setShowVendorSelectionModal] = useState(false);
  const [showRfpSentModal, setShowRfpSentModal] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [sentVendors, setSentVendors] = useState<Vendor[]>([]);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [isSendingRfp, setIsSendingRfp] = useState(false);

  // Load vendors on mount
  useEffect(() => {
    const loadVendors = async () => {
      const vendorList = await getVendors();
      setVendors(vendorList);
    };
    loadVendors();
  }, []);

  const filteredVendors = vendorSearchQuery.trim()
    ? vendors.filter((v) =>
        v.name.toLowerCase().includes(vendorSearchQuery.toLowerCase())
      )
    : vendors;

  const selectedVendorCount = vendors.filter((v) => v.isSelected).length;

  const sentVendorRows = useMemo(() => {
    const rows: Vendor[][] = [];
    const itemsPerRow = 2;
    for (let i = 0; i < sentVendors.length; i += itemsPerRow) {
      rows.push(sentVendors.slice(i, i + itemsPerRow));
    }
    return rows;
  }, [sentVendors]);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      timestamp: new Date(),
      sender: "user",
      isNew: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseContent = await generateProjectPlan(message);

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: responseContent,
        timestamp: new Date(),
        sender: "ai",
        isNew: true,
      };
      setMessages((prev) => [...prev, aiMessage]);

      setTimeout(() => {
        setShowPdfPreview(true);
      }, 500);
    } catch (error) {
      console.error("Failed to generate project plan:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openDownloadModal = useCallback(() => {
    setShowDownloadModal(true);
  }, []);

  const closeDownloadModal = useCallback(() => {
    setShowDownloadModal(false);
    setSelectedFormat("pdf");
  }, []);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      await downloadProjectPlan("plan-001", selectedFormat);
      alert(`Downloading as ${selectedFormat.toUpperCase()}...`);
    } catch (error) {
      console.error("Failed to download:", error);
    } finally {
      setIsDownloading(false);
      setShowDownloadModal(false);
    }
  }, [selectedFormat]);

  const openRfpConfirmModal = useCallback(() => {
    setShowRfpConfirmModal(true);
  }, []);

  const closeRfpConfirmModal = useCallback(() => {
    setShowRfpConfirmModal(false);
  }, []);

  const openVendorSelectionModal = useCallback(() => {
    setShowRfpConfirmModal(false);
    setVendorSearchQuery("");
    setShowVendorSelectionModal(true);
  }, []);

  const closeVendorSelectionModal = useCallback(() => {
    setShowVendorSelectionModal(false);
    setVendorSearchQuery("");
  }, []);

  const toggleVendor = useCallback((vendorId: string) => {
    setVendors((prev) =>
      prev.map((v) =>
        v.id === vendorId ? { ...v, isSelected: !v.isSelected } : v
      )
    );
  }, []);

  const sendRfp = useCallback(async () => {
    setIsSendingRfp(true);
    try {
      const selectedVendorIds = vendors
        .filter((v) => v.isSelected)
        .map((v) => v.id);

      await sendRfpToVendors("plan-001", selectedVendorIds);

      const selected = vendors.filter((v) => v.isSelected);
      setSentVendors(selected);
      setShowVendorSelectionModal(false);
      setVendorSearchQuery("");
      setShowRfpSentModal(true);
    } catch (error) {
      console.error("Failed to send RFP:", error);
    } finally {
      setIsSendingRfp(false);
    }
  }, [vendors]);

  const closeRfpSentModal = useCallback(() => {
    setShowRfpSentModal(false);
  }, []);

  return {
    messages,
    isLoading,
    showPdfPreview,
    showDownloadModal,
    selectedFormat,
    setSelectedFormat,
    isDownloading,
    showRfpConfirmModal,
    showVendorSelectionModal,
    showRfpSentModal,
    filteredVendors,
    selectedVendorCount,
    sentVendorRows,
    vendorSearchQuery,
    setVendorSearchQuery,
    isSendingRfp,
    sendMessage,
    openDownloadModal,
    closeDownloadModal,
    handleDownload,
    openRfpConfirmModal,
    closeRfpConfirmModal,
    openVendorSelectionModal,
    closeVendorSelectionModal,
    toggleVendor,
    sendRfp,
    closeRfpSentModal,
  };
}
