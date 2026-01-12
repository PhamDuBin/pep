"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { TabNavigation, ChatInput, ProjectPlanModeButton } from "@/components";
import { HOME_TABS } from "@/mocks";
import { Tab } from "@/types";
import styles from "./page.module.scss";

export default function BuyerHomePage() {
  const router = useRouter();

  const handleTabChange = useCallback(
    (tab: Tab) => {
      if (tab.id === "carry") {
        router.push("/buyer/carry");
      }
    },
    [router]
  );

  const handleMessageSent = useCallback(
    (message: string) => {
      // Navigate to AI Chat page with the message
      router.push(`/buyer/ai-chat?message=${encodeURIComponent(message)}`);
    },
    [router]
  );

  return (
    <div className={styles.container}>
      <TabNavigation tabs={HOME_TABS} onTabChange={handleTabChange} />
      <div className={styles.content}>
        <div className={styles.centerContent}>
          <ProjectPlanModeButton />
          <ChatInput onMessageSent={handleMessageSent} />
        </div>
      </div>
    </div>
  );
}
