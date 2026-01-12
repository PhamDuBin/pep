"use client";

import { useState, useEffect } from "react";
import { BREAKPOINTS } from "@/constants";

/**
 * Hook that returns whether a media query matches
 * @param query - Media query string
 * @returns Whether the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

/**
 * Hook that returns whether the screen is mobile
 * @returns Whether the screen is mobile
 */
export function useIsMobile(): boolean {
  return useMediaQuery(`(max-width: ${BREAKPOINTS.MD - 1}px)`);
}

/**
 * Hook that returns whether the screen is tablet
 * @returns Whether the screen is tablet
 */
export function useIsTablet(): boolean {
  return useMediaQuery(
    `(min-width: ${BREAKPOINTS.MD}px) and (max-width: ${BREAKPOINTS.LG - 1}px)`
  );
}

/**
 * Hook that returns whether the screen is desktop
 * @returns Whether the screen is desktop
 */
export function useIsDesktop(): boolean {
  return useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
}

/**
 * Hook that returns the current breakpoint
 * @returns Current breakpoint name
 */
export function useBreakpoint(): "sm" | "md" | "lg" | "xl" | "2xl" {
  const isXl = useMediaQuery(`(min-width: ${BREAKPOINTS.XL}px)`);
  const isLg = useMediaQuery(`(min-width: ${BREAKPOINTS.LG}px)`);
  const isMd = useMediaQuery(`(min-width: ${BREAKPOINTS.MD}px)`);
  const isSm = useMediaQuery(`(min-width: ${BREAKPOINTS.SM}px)`);

  if (isXl) return "xl";
  if (isLg) return "lg";
  if (isMd) return "md";
  if (isSm) return "sm";
  return "sm";
}
