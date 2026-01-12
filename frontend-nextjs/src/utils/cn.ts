// =============================================================================
// CLASSNAME UTILITY
// =============================================================================
// Utility function for conditionally joining classNames together.

type ClassValue = string | number | boolean | undefined | null | ClassValue[];

/**
 * Conditionally join classNames together
 * @param classes - Class values to join
 * @returns Joined class string
 * @example
 * cn("btn", isActive && "btn-active", className)
 * // => "btn btn-active custom-class"
 */
export function cn(...classes: ClassValue[]): string {
  return classes
    .flat()
    .filter((cls): cls is string | number => Boolean(cls) && typeof cls !== "boolean")
    .map(String)
    .join(" ")
    .trim();
}
