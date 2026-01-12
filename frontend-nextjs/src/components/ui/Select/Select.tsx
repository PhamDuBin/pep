import {
  forwardRef,
  type SelectHTMLAttributes,
  type ReactNode,
  useId,
} from "react";
import styles from "./Select.module.scss";

export type SelectSize = "xs" | "sm" | "md" | "lg";

export type SelectVariant = "default" | "bordered" | "ghost";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  size?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
  options: SelectOption[];
  placeholder?: string;
  leftIcon?: ReactNode;
}

const sizeClassMap: Record<SelectSize, string> = {
  xs: "select-xs",
  sm: "select-sm",
  md: "select-md",
  lg: "select-lg",
};

const variantClassMap: Record<SelectVariant, string> = {
  default: "",
  bordered: "select-bordered",
  ghost: "select-ghost",
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      size = "md",
      variant = "bordered",
      fullWidth = false,
      options,
      placeholder,
      leftIcon,
      className = "",
      id: providedId,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = providedId || generatedId;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;
    const hasError = Boolean(error);

    const selectClasses = [
      "select",
      variantClassMap[variant],
      sizeClassMap[size],
      fullWidth ? "w-full" : "",
      hasError ? "select-error" : "",
      leftIcon ? styles.hasLeftIcon : "",
      styles.select,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const wrapperClasses = [
      styles.wrapper,
      fullWidth ? styles.fullWidth : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={wrapperClasses}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.selectWrapper}>
          {leftIcon && (
            <span className={styles.iconLeft} aria-hidden="true">
              {leftIcon}
            </span>
          )}

          <select
            ref={ref}
            id={selectId}
            className={selectClasses}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {hasError && (
          <span id={errorId} className={styles.error} role="alert">
            {error}
          </span>
        )}

        {!hasError && helperText && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
