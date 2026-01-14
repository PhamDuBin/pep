"use client";

// =============================================================================
// USER LIST HOOK
// =============================================================================

import { useState, useCallback, useMemo, useEffect } from "react";
import { User, UserPermission, PermissionOption, PermissionChangeModalState } from "../types";
import {
  getUsers,
  getPermissionOptions,
  updateUserPermission,
  deleteUsers,
  inviteUser,
} from "../services/user-list.service";
import { DeleteConfirmModalState, InviteMemberModalState } from "@/shared/types";

export function useUserList() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [permissionOptions, setPermissionOptions] = useState<
    PermissionOption[]
  >([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Modal states
  const [inviteModalState, setInviteModalState] =
    useState<InviteMemberModalState>("form");
  const [permissionModalState, setPermissionModalState] =
    useState<PermissionChangeModalState>("select");
  const [deleteModalState, setDeleteModalState] =
    useState<DeleteConfirmModalState>("confirm");

  // Saving states
  const [isInviting, setIsInviting] = useState(false);
  const [isSavingPermission, setIsSavingPermission] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [usersData, optionsData] = await Promise.all([
          getUsers(),
          getPermissionOptions(),
        ]);
        setUsers(usersData);
        setPermissionOptions(optionsData);
      } catch (error) {
        console.error("Failed to load user list data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const isAllSelected = useMemo(
    () => users.length > 0 && users.every((u) => u.isSelected),
    [users]
  );

  const selectedCount = useMemo(
    () => users.filter((u) => u.isSelected).length,
    [users]
  );

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId),
    [users, selectedUserId]
  );

  const handleToggleSelection = useCallback((userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, isSelected: !u.isSelected } : u
      )
    );
  }, []);

  const handleToggleAllSelection = useCallback(() => {
    const allSelected = users.every((u) => u.isSelected);
    setUsers((prev) => prev.map((u) => ({ ...u, isSelected: !allSelected })));
  }, [users]);

  const handleOpenPermissionModal = useCallback((userId: string) => {
    setSelectedUserId(userId);
    setPermissionModalState("select");
    setShowPermissionModal(true);
  }, []);

  const handleClosePermissionModal = useCallback(() => {
    setShowPermissionModal(false);
    setSelectedUserId(null);
    setPermissionModalState("select");
  }, []);

  const handleConfirmPermissionChange = useCallback(
    async (newPermission: UserPermission) => {
      if (selectedUserId) {
        setIsSavingPermission(true);
        try {
          await updateUserPermission(selectedUserId, newPermission);
          setUsers((prev) =>
            prev.map((u) =>
              u.id === selectedUserId ? { ...u, permission: newPermission } : u
            )
          );
          setPermissionModalState("complete");
        } catch (error) {
          console.error("Failed to update permission:", error);
        } finally {
          setIsSavingPermission(false);
        }
      }
    },
    [selectedUserId]
  );

  const handleDeleteMembers = useCallback(() => {
    if (selectedCount > 0) {
      setDeleteModalState("confirm");
      setShowDeleteModal(true);
    }
  }, [selectedCount]);

  const handleConfirmDelete = useCallback(async () => {
    setIsDeleting(true);
    try {
      const userIdsToDelete = users
        .filter((u) => u.isSelected)
        .map((u) => u.id);
      await deleteUsers(userIdsToDelete);
      setUsers((prev) => prev.filter((u) => !u.isSelected));
      setDeleteModalState("complete");
    } catch (error) {
      console.error("Failed to delete users:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [users]);

  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteModalState("confirm");
  }, []);

  const handleOpenInviteModal = useCallback(() => {
    setInviteModalState("form");
    setShowInviteModal(true);
  }, []);

  const handleCloseInviteModal = useCallback(() => {
    setShowInviteModal(false);
    setInviteModalState("form");
  }, []);

  const handleInvite = useCallback(async (emails: string[]) => {
    setIsInviting(true);
    try {
      // For now, just invite the first email (can be expanded to handle multiple)
      for (const email of emails) {
        const result = await inviteUser(email, "member");
        if (result.success && result.user) {
          setUsers((prev) => [...prev, result.user!]);
        }
      }
      setInviteModalState("complete");
    } catch (error) {
      console.error("Failed to invite user:", error);
    } finally {
      setIsInviting(false);
    }
  }, []);

  const getPermissionLabel = useCallback(
    (permission: UserPermission) => {
      const option = permissionOptions.find((o) => o.value === permission);
      return option ? option.label : permission;
    },
    [permissionOptions]
  );

  return {
    // State
    isLoading,
    users,
    showInviteModal,
    showPermissionModal,
    showDeleteModal,
    selectedUserId,
    isAllSelected,
    selectedCount,
    selectedUser,
    permissionOptions,
    // Modal states
    inviteModalState,
    permissionModalState,
    deleteModalState,
    // Saving states
    isInviting,
    isSavingPermission,
    isDeleting,
    // Handlers
    handleToggleSelection,
    handleToggleAllSelection,
    handleOpenPermissionModal,
    handleClosePermissionModal,
    handleConfirmPermissionChange,
    handleDeleteMembers,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handleOpenInviteModal,
    handleCloseInviteModal,
    handleInvite,
    getPermissionLabel,
  };
}
