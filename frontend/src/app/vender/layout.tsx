import { ReactNode } from "react";
import { VendorLayout } from "@/features/vendor/layout";

interface VenderLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: VenderLayoutProps) {
  return <VendorLayout>{children}</VendorLayout>;
}
