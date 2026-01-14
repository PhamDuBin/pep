"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SideMenuContextType {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

const SideMenuContext = createContext<SideMenuContextType | undefined>(undefined);

interface SideMenuProviderProps {
  children: ReactNode;
}

export function SideMenuProvider({ children }: SideMenuProviderProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsCollapsed(false);
  }, []);

  const collapse = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  return (
    <SideMenuContext.Provider value={{ isCollapsed, toggle, expand, collapse }}>
      {children}
    </SideMenuContext.Provider>
  );
}

export function useSideMenu() {
  const context = useContext(SideMenuContext);
  if (context === undefined) {
    throw new Error("useSideMenu must be used within a SideMenuProvider");
  }
  return context;
}
