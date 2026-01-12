import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import styles from "./Button.module.scss";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "link"
  | "outline";

export type ButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantClassMap: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  ghost: "btn-ghost",
  link: "btn-link",
  outline: "btn-outline",
};

const sizeClassMap: Record<ButtonSize, string> = {
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

const loadingSizeMap: Record<ButtonSize, string> = {
  xs: "loading-xs",
  sm: "loading-sm",
  md: "loading-sm",
  lg: "loading-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      "btn",
      variantClassMap[variant],
      sizeClassMap[size],
      fullWidth ? "btn-block" : "",
      styles.button,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <span
            className={`loading loading-spinner ${loadingSizeMap[size]}`}
            aria-hidden="true"
          />
        )}
        {!loading && leftIcon && (
          <span className={styles.iconLeft} aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <span className={styles.content}>{children}</span>
        {!loading && rightIcon && (
          <span className={styles.iconRight} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
