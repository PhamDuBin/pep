// =============================================================================
// CONTEXTS INDEX
// =============================================================================
// Central re-export for backward compatibility.
// Buyer contexts: SideMenuContext, ProjectContext -> features/buyer/shared/contexts
// Vendor contexts: VendorContext -> features/vendor/shared/contexts

export { SideMenuProvider, useSideMenu } from "@/features/buyer/shared/contexts";
export { ProjectProvider, useProjects } from "@/features/buyer/shared/contexts";
export { VendorProvider, useVendor } from "@/features/vendor/shared/contexts";
