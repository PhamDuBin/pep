// =============================================================================
// USER LIST MOCK DATA - RE-EXPORTS
// =============================================================================

export {
  USERS_MOCK,
  PERMISSION_OPTIONS_MOCK,
  PERMISSION_LABELS_MOCK,
  type UserPermission,
} from "./user-list.data";

// Legacy exports for backward compatibility
export {
  USERS_MOCK as MOCK_VENDOR_USERS,
  PERMISSION_OPTIONS_MOCK as VENDOR_PERMISSION_OPTIONS_MOCK,
  PERMISSION_LABELS_MOCK as VENDOR_PERMISSION_LABELS_MOCK,
  type UserPermission as VendorUserPermission,
} from "./user-list.data";
