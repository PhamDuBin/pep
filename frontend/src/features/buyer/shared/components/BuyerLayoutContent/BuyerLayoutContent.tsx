import { Header, SideMenu } from "@/shared/components";
import { useSideMenu } from "../../contexts";
import { BuyerLayoutContentProps } from "../../types";
import styles from "./BuyerLayout.module.scss";

export function BuyerLayoutContent({ children }: BuyerLayoutContentProps) {
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
