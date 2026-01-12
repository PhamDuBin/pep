import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import styles from "./Badge.module.scss";

export type BadgeVariant =
  | "default"
  | "primary"
  | "secondary"
  | "accent"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "ghost"
  | "outline";

export type BadgeSize = "xs" | "sm" | "md" | "lg";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: "badge-neutral",
  primary: "badge-primary",
  secondary: "badge-secondary",
  accent: "badge-accent",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  info: "badge-info",
  ghost: "badge-ghost",
  outline: "badge-outline",
};

const sizeClassMap: Record<BadgeSize, string> = {
  xs: "badge-xs",
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = "default",
      size = "md",
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    const badgeClasses = [
      "badge",
      variantClassMap[variant],
      sizeClassMap[size],
      styles.badge,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <span ref={ref} className={badgeClasses} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
