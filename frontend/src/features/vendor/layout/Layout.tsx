"use client";

import { ReactNode } from "react";
import { Header } from "@/shared/components";
import { SideMenu } from "@/features/vendor/shared/components";
import { VendorProvider, useVendor } from "@/shared/contexts";

interface LayoutContentProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutContentProps) {
  const { isCollapsed } = useVendor();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <SideMenu />
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

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <VendorProvider>
      <LayoutContent>{children}</LayoutContent>
    </VendorProvider>
  );
}
