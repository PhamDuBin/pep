import { ReactNode } from "react";
import { BuyerLayout } from "@/features/buyer/layout";

interface BuyerLayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: BuyerLayoutProps) {
  return <BuyerLayout>{children}</BuyerLayout>;
}
