"use client";

import { ReactNode } from "react";
import { LayoutRegister } from "@/shared/components/layout";

interface RegistInfoLayoutProps {
  children: ReactNode;
}

export default function RegistInfoLayout({ children }: RegistInfoLayoutProps) {
  return <LayoutRegister>{children}</LayoutRegister>;
}
