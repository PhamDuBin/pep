"use client";

import { SideMenuProvider, ProjectProvider } from "@/shared/contexts";

import { LayoutContentProps } from "../shared/models";
import { LayoutContent } from "../shared/components/LayoutContent";

export function Layout({ children }: LayoutContentProps) {
  return (
    <SideMenuProvider>
      <ProjectProvider>
        <LayoutContent>{children}</LayoutContent>
      </ProjectProvider>
    </SideMenuProvider>
  );
}
