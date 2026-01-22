"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { User, PermissionOption } from "../models";
import { ChangePermissionModalState } from "../components/ChangePermissionModal/PermissionChangeModal";
import {
  getUsers,
  getPermissionOptions,
  inviteUser,
  updateUser,
  deleteUsers,
} from "../services/user-list.service";

export function useUserList() {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
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
    useState<User | null>(null);
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
          getUsers(),
          getPermissionOptions(),
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

  const toggleUserSelection = useCallback((user: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, selected: !u.selected } : u))
    );
  }, []);

  const toggleAllSelection = useCallback(() => {
    const newValue = !allSelected;
    setUsers((prev) => prev.map((u) => ({ ...u, selected: newValue })));
  }, [allSelected]);

  // Invite handlers
  const handleOpenInviteModal = useCallback(() => {
    setShowInviteModal(true);
  }, []);

  const handleInviteMember = useCallback(async (emails: string[]) => {
    try {
      // Invite each email with default role
      for (const email of emails) {
        const result = await inviteUser(email, "メンバー");
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
      await deleteUsers(userIdsToDelete);
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
  const handleChangePermission = useCallback((user: User) => {
    setSelectedUserForPermission(user);
    setChangePermissionModalState("select");
    setShowChangePermissionModal(true);
  }, []);

  const handleChangePermissionSave = useCallback(
    async (newRole: string) => {
      if (!selectedUserForPermission) return;

      try {
        await updateUser(
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
    handleUserSelect: toggleUserSelection,
    handleAllSelect: toggleAllSelection,

    // Invite handlers
    handleInviteMemberClick: handleInviteMember,

    handleCloseInviteModal,

    // Delete handlers
    handleDeleteMembers,
    handleDeleteConfirmClick: handleDeleteConfirm,
    handleCloseDeleteConfirmModal,
    handleCloseDeleteSuccessModal,

    // Change permission handlers
    handleChangePermission,
    handlePermissionSaveClick: handleChangePermissionSave,
    handleCloseChangePermissionModal,

    // Constants
    // Link to UI
    handleOpenInviteModal,
    permissionOptions,
  };
}
