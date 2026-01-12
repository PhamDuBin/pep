"use client";

import { forwardRef, type HTMLAttributes } from "react";
import styles from "./Loading.module.scss";

export type LoadingType = "spinner" | "dots" | "ring" | "ball" | "bars" | "infinity";
export type LoadingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface LoadingProps extends HTMLAttributes<HTMLSpanElement> {
  type?: LoadingType;
  size?: LoadingSize;
  color?: string;
}

const typeClassMap: Record<LoadingType, string> = {
  spinner: styles.spinner,
  dots: styles.dots,
  ring: styles.ring,
  ball: styles.ball,
  bars: styles.bars,
  infinity: styles.infinity,
};

const sizeClassMap: Record<LoadingSize, string> = {
  xs: styles.xs,
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
  xl: styles.xl,
};

export const Loading = forwardRef<HTMLSpanElement, LoadingProps>(
  ({ type = "spinner", size = "md", color, className = "", style, ...props }, ref) => {
    const classes = [
      styles.loading,
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
