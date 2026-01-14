"use client";

import { ReactNode } from "react";
import { Header, SideMenu } from "@/shared/components";
import { SideMenuProvider, useSideMenu, ProjectProvider } from "@/shared/contexts";
import styles from "./BuyerLayout.module.scss";

interface BuyerLayoutContentProps {
  children: ReactNode;
}

function BuyerLayoutContent({ children }: BuyerLayoutContentProps) {
  const { isCollapsed } = useSideMenu();

  return (
    <div className={styles.buyerLayout}>
      <Header />
      <SideMenu />
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

interface BuyerLayoutProps {
  children: ReactNode;
}

export function BuyerLayout({ children }: BuyerLayoutProps) {
  return (
    <SideMenuProvider>
      <ProjectProvider>
        <BuyerLayoutContent>{children}</BuyerLayoutContent>
      </ProjectProvider>
    </SideMenuProvider>
  );
}
