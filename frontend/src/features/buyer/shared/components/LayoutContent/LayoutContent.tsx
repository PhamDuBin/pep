import { Header, SideMenu, TrialBanner } from "@/shared/components";
import { useSideMenu } from "../../contexts";
import { LayoutContentProps } from "../../models";
import { MEMBER_USER_MOCK } from "@/features/buyer/my-page/mock";
import { calculateTrialDaysRemaining } from "@/shared/utils/utils";

export function LayoutContent({ children }: LayoutContentProps) {
  const { isCollapsed } = useSideMenu();

  // Check if user is on trial
  const isOnTrial = MEMBER_USER_MOCK.subscriptionPlan === "trial";
  const daysRemaining =
    isOnTrial && MEMBER_USER_MOCK.trialEndDate
      ? calculateTrialDaysRemaining(MEMBER_USER_MOCK.trialEndDate)
      : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      <Header />
      <SideMenu />
      <main
        className={`mt-[65px] min-h-[calc(100vh-90px)] transition-[margin-left] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
          isCollapsed ? "ml-[60px]" : "ml-[200px]"
        }`}
      >
        {isOnTrial && <TrialBanner daysRemaining={daysRemaining} />}
        {children}
      </main>
    </div>
  );
}
