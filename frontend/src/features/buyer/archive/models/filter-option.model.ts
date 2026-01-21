// =============================================================================
// FILTER OPTION MODEL
// =============================================================================

import { SortOrder } from "../types";

export interface ProjectFilterOption {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface SortOption {
  value: SortOrder;
  label: string;
  isSelected: boolean;
}

export interface ContextMenuItem {
  action: "download" | "rename" | "favorite" | "delete";
  label: string;
}
