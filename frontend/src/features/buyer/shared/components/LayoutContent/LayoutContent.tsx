import { Header, SideMenu } from "@/shared/components";
import { useSideMenu } from "../../contexts";
import { LayoutContentProps } from "../../models";

export function LayoutContent({ children }: LayoutContentProps) {
  const { isCollapsed } = useSideMenu();

  return (
    <div className="flex flex-col min-h-screen bg-[#ffffff]">
      <Header />
      <SideMenu />
      <main
        className={`mt-[90px] min-h-[calc(100vh-90px)] transition-[margin-left] duration-300 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isCollapsed ? "ml-[60px]" : "ml-[200px]"
          }`}
      >
        {children}
      </main>
    </div>
  );
}
