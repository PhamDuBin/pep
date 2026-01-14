"use client";

import { SideMenuProvider, ProjectProvider } from "@/shared/contexts";

import { BuyerLayoutContentProps } from "../shared/types";
import { BuyerLayoutContent } from "../shared/components/BuyerLayoutContent";

export function BuyerLayout({ children }: BuyerLayoutContentProps) {
  return (
    <SideMenuProvider>
      <ProjectProvider>
        <BuyerLayoutContent>{children}</BuyerLayoutContent>
      </ProjectProvider>
    </SideMenuProvider>
  );
}
