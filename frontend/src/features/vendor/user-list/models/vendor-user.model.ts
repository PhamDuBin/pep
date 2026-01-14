// =============================================================================
// VENDOR USER MODEL
// =============================================================================

export interface VendorUser {
  id: string;
  name: string;
  initials: string;
  email?: string;
  avatarColor: string;
  avatarUrl?: string;
  role?: string;
  selected?: boolean;
}

export interface PermissionOption {
  value: string;
  label: string;
}
