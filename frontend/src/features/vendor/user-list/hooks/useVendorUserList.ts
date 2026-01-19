"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { VendorUser, PermissionOption } from "../types";
import { ChangePermissionModalState } from "../components/ChangePermissionModal/PermissionChangeModal";
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
  const [permissionOptions, setPermissionOptions] = useState<
    PermissionOption[]
  >([]);

  // Modal states
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<
    "confirm" | "complete"
  >("confirm");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteModalState, setInviteModalState] = useState<"form" | "complete">(
    "form"
  );
  const [showChangePermissionModal, setShowChangePermissionModal] =
    useState(false);
  const [changePermissionModalState, setChangePermissionModalState] =
    useState<ChangePermissionModalState>("select");

  // Permission state
  const [selectedUserForPermission, setSelectedUserForPermission] =
    useState<VendorUser | null>(null);
  const [lastChangedPermissionUserName, setLastChangedPermissionUserName] =
    useState("");
  const [lastChangedPermissionRole, setLastChangedPermissionRole] =
    useState("");

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
      setInviteModalState("complete");
    } catch (error) {
      console.error("Failed to invite user:", error);
    }
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setShowInviteModal(false);
    setInviteModalState("form");
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
      setDeleteModalState("complete");
    } catch (error) {
      console.error("Failed to delete users:", error);
    }
  }, [users]);

  const handleCloseDeleteConfirmModal = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setDeleteModalState("confirm");
  }, []);

  const handleCloseDeleteSuccessModal = useCallback(() => {
    setShowDeleteConfirmModal(false);
    setDeleteModalState("confirm");
  }, []);

  // Change permission handlers
  const handleChangePermission = useCallback((user: VendorUser) => {
    setSelectedUserForPermission(user);
    setChangePermissionModalState("select");
    setShowChangePermissionModal(true);
  }, []);

  const handleChangePermissionSave = useCallback(
    async (newRole: string) => {
      if (!selectedUserForPermission) return;

      try {
        await updateVendorUser(
          selectedUserForPermission.id,
          selectedUserForPermission.name,
          newRole
        );
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUserForPermission.id ? { ...u, role: newRole } : u
          )
        );
        setLastChangedPermissionUserName(selectedUserForPermission.name);
        setLastChangedPermissionRole(newRole);
        setChangePermissionModalState("complete");
      } catch (error) {
        console.error("Failed to change user permission:", error);
      }
    },
    [selectedUserForPermission]
  );

  const handleCloseChangePermissionModal = useCallback(() => {
    setShowChangePermissionModal(false);
    setChangePermissionModalState("select");
    setSelectedUserForPermission(null);
  }, []);

  return {
    // State
    isLoading,
    users,
    selectedUsers,
    allSelected,
    selectedUserForPermission,
    lastChangedPermissionUserName,
    lastChangedPermissionRole,

    // Modal states
    showDeleteConfirmModal,
    deleteModalState,
    showInviteModal,
    inviteModalState,
    showChangePermissionModal,
    changePermissionModalState,

    // Selection handlers
    toggleUserSelection,
    toggleAllSelection,

    // Invite handlers
    handleInviteMember,
    handleInviteConfirm,
    handleCloseInviteModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirm,
    handleCloseDeleteConfirmModal,
    handleCloseDeleteSuccessModal,

    // Change permission handlers
    handleChangePermission,
    handleChangePermissionSave,
    handleCloseChangePermissionModal,

    // Constants
    permissionOptions,
  };
}
