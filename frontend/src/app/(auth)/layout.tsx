// =============================================================================
// REGISTRATION LAYOUT
// =============================================================================
// Empty layout for registration pages (no header/sidebar)

import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
