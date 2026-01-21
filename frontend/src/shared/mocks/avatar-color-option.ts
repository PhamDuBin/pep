// =============================================================================
// SHARED MY-PAGE MOCKS
// =============================================================================
// Mocks used by shared components (e.g., AvatarChangeModal)

import { AvatarColorOption } from "@/shared/types";

export const AVATAR_COLOR_OPTIONS: AvatarColorOption[] = [
  {
    id: "color-1",
    color: "#8ec5d0",
    borderColor: "#066a9e",
    isSelected: true,
  },
  {
    id: "color-2",
    color: "#e8b4d8",
    borderColor: "transparent",
    isSelected: false,
  },
  {
    id: "color-3",
    color: "#90d4a8",
    borderColor: "transparent",
    isSelected: false,
  },
  {
    id: "color-4",
    color: "#e8e4b0",
    borderColor: "transparent",
    isSelected: false,
  },
];
