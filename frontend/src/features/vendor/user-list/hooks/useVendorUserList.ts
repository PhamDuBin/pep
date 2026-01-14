"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { VendorUser, PermissionOption } from "../types";
import {
  getVendorUsers,
  getVendorPermissionOptions,
  inviteVendorUser,
  updateVendorUser,
  deleteVendorUsers,
} from "../services/vendor-user-list.service";

export function useVendorUserList() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<VendorUser[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<PermissionOption[]>([]);

  // Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showInviteSuccessModal, setShowInviteSuccessModal] = useState(false);

  // Edit state
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<VendorUser | null>(null);
  const [lastEditedUserName, setLastEditedUserName] = useState("");
  const [lastEditedUserRole, setLastEditedUserRole] = useState("");

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [usersData, optionsData] = await Promise.all([
          getVendorUsers(),
          getVendorPermissionOptions(),
        ]);
        setUsers(usersData);
        setPermissionOptions(optionsData);
      } catch (error) {
        console.error("Failed to load vendor user list data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedUsers = useMemo(() => users.filter((u) => u.selected), [users]);
  const allSelected = useMemo(
    () => users.length > 0 && users.every((u) => u.selected),
    [users]
  );

  const toggleUserSelection = useCallback((user: VendorUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, selected: !u.selected } : u))
    );
  }, []);

  const toggleAllSelection = useCallback(() => {
    const newValue = !allSelected;
    setUsers((prev) => prev.map((u) => ({ ...u, selected: newValue })));
  }, [allSelected]);

  // Invite handlers
  const handleInviteMember = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleInviteConfirm = useCallback(async (emails: string[]) => {
    try {
      // Invite each email with default role
      for (const email of emails) {
        const result = await inviteVendorUser(email, "メンバー");
        if (result.success && result.user) {
          setUsers((prev) => [...prev, result.user!]);
        }
      }
      setShowInviteModal(false);
      setShowInviteSuccessModal(true);
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setShowInviteModal(false);
  }, []);

  const handleCloseInviteSuccessModal = useCallback(() => {
    setShowInviteSuccessModal(false);
  }, []);

  // Edit handlers
  const handleEditUser = useCallback((user: VendorUser) => {
    setSelectedUserForEdit(user);
    setShowEditModal(true);
  }, []);

  const handleEditSave = useCallback(async (name: string, role: string) => {
    if (!selectedUserForEdit) return;

    try {
      await updateVendorUser(selectedUserForEdit.id, name, role);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUserForEdit.id ? { ...u, name, role } : u
        )
      );
      setLastEditedUserName(name);
      setLastEditedUserRole(role);
      setShowEditModal(false);
      setShowEditSuccessModal(true);
      setSelectedUserForEdit(null);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  }, [selectedUserForEdit]);

  const handleCloseEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedUserForEdit(null);
  }, []);

  const handleCloseEditSuccessModal = useCallback(() => {
    setShowEditSuccessModal(false);
  }, []);

  // Delete handlers
  const handleDeleteMembers = useCallback(() => {
    if (selectedUsers.length === 0) return;
    setShowDeleteConfirmModal(true);
  }, [selectedUsers]);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      const userIdsToDelete = users.filter((u) => u.selected).map((u) => u.id);
      await deleteVendorUsers(userIdsToDelete);
      setUsers((prev) => prev.filter((u) => !u.selected));
      setShowDeleteConfirmModal(false);
      setShowDeleteSuccessModal(true);
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  }, [users]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setShowDeleteConfirmModal(false);
  }, []);

  const handleCloseDeleteSuccessModal = useCallback(() => {
    setShowDeleteSuccessModal(false);
  }, []);

  return {
    // State
    isLoading,
    users,
    selectedUsers,
    allSelected,
    selectedUserForEdit,
    lastEditedUserName,
    lastEditedUserRole,

    // Modal states
    showDeleteConfirmModal,
    showDeleteSuccessModal,
    showEditModal,
    showEditSuccessModal,
    showInviteModal,
    showInviteSuccessModal,

    // Selection handlers
    toggleUserSelection,
    toggleAllSelection,

    // Invite handlers
    handleInviteMember,
    handleInviteConfirm,
    handleCloseInviteModal,
    handleCloseInviteSuccessModal,

    // Edit handlers
    handleEditUser,
    handleEditSave,
    handleCloseEditModal,
    handleCloseEditSuccessModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirm,
    handleCloseDeleteConfirmModal,
    handleCloseDeleteSuccessModal,

    // Constants
    permissionOptions,
  };
}
