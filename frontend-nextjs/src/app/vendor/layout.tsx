"use client";

import { ReactNode } from "react";
import { Header, VendorSideMenu } from "@/components";
import { VendorProvider, useVendor } from "@/contexts";
import styles from "./layout.module.scss";

interface VendorLayoutContentProps {
  children: ReactNode;
}

function VendorLayoutContent({ children }: VendorLayoutContentProps) {
  const { isCollapsed } = useVendor();

  return (
    <div className={styles.vendorLayout}>
      <Header />
      <VendorSideMenu />
      <main
        className={`${styles.mainContent} ${
          isCollapsed ? styles.menuCollapsed : styles.menuExpanded
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

export default function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <VendorProvider>
      <VendorLayoutContent>{children}</VendorLayoutContent>
    </VendorProvider>
  );
}
