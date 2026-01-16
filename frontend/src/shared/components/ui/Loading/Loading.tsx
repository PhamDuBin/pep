"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { LoadingSize, LoadingType } from "@/shared/types";

//only used in Loading component
export interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  type?: LoadingType;
  size?: LoadingSize;
  color?: string;
}

const typeClassMap: Record<LoadingType, string> = {
  spinner: "loading-spinner",
  dots: "loading-dots",
  ring: "loading-ring",
  ball: "loading-ball",
  bars: "loading-bars",
  infinity: "loading-infinity",
};

const sizeClassMap: Record<LoadingSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-md",
  lg: "loading-lg",
  xl: "loading-xl",
};

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  (
    { type = "spinner", size = "md", color, className = "", style, ...props },
    ref
  ) => {
    const classes = [
      "loading",
      typeClassMap[type],
      sizeClassMap[size],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const customStyle = color ? { ...style, color } : style;

    return (
      <span
        ref={ref}
        className={classes}
        style={customStyle}
        role="status"
        aria-label="Loading"
        {...props}
      />
    );
  }
);

Loading.displayName = "Loading";
