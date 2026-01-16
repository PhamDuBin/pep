"use client";

import { ReactNode } from "react";
import { Header, VendorSideMenu } from "@/shared/components";
import { VendorProvider, useVendor } from "@/shared/contexts";

interface VendorLayoutContentProps {
  children: ReactNode;
}

function VendorLayoutContent({ children }: VendorLayoutContentProps) {
  const { isCollapsed } = useVendor();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <VendorSideMenu />
      <main
        className={`mt-[89px] min-h-[calc(100vh-89px)] transition-[margin-left] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isCollapsed ? "ml-[60px]" : "ml-[172px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

interface VendorLayoutProps {
  children: ReactNode;
}

export function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <VendorProvider>
      <VendorLayoutContent>{children}</VendorLayoutContent>
    </VendorProvider>
  );
}
