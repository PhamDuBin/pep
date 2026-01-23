"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { TabNavigation, ChatInput, ProjectPlanModeButton } from "@/shared/components";
import { HOME_TABS } from "./mock";
import { Tab } from "./models";

export function HomePage() {
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
      router.push(`/buyer/ai-chat?message=${encodeURIComponent(message)}`);
    },
    [router]
  );

  return (
    <div className="flex flex-col h-full bg-white">
      <TabNavigation tabs={HOME_TABS} onTabChange={handleTabChange} />
      <div className="flex-1 flex flex-col justify-between items-center py-[10px] px-[25px] min-h-[calc(100vh-65px-94px)]">
        <div className="flex flex-col items-center justify-center flex-1 gap-[20px] w-full max-w-[800px] mx-auto">
          <ProjectPlanModeButton />
          <ChatInput onMessageSent={handleMessageSent} />
        </div>
      </div>
    </div>
  );
}
