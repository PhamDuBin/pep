// =============================================================================
// LAYOUT MODEL
// =============================================================================

import { ReactNode } from "react";

export interface LayoutContentProps {
  children: ReactNode;
}

// Backward compatibility alias
export type BuyerLayoutContentProps = LayoutContentProps;
