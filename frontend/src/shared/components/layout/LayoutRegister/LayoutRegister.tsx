"use client";

import { ReactNode } from "react";
import { Header } from "../Header";
import { FooterRegister } from "../FooterRegister";

interface LayoutRegistProps {
  children: ReactNode;
}

export function LayoutRegister({ children }: LayoutRegistProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
      }}
    >
      <Header />
      <main
        style={{
          flex: 1,
          marginTop: "65px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
      <FooterRegister />
    </div>
  );
}
