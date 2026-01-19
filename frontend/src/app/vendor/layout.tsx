import { ReactNode } from "react";
import { VendorLayout } from "@/features/vendor/layout";

interface VendorLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: VendorLayoutProps) {
  return <VendorLayout>{children}</VendorLayout>;
}
