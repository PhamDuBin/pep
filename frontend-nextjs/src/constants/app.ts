// =============================================================================
// APPLICATION CONSTANTS
// =============================================================================
// Global application constants and configuration values.

/**
 * Application metadata
 */
export const APP_NAME = "PEP Application";
export const APP_VERSION = "1.0.0";

/**
 * API configuration (to be updated when API is ready)
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
} as const;

/**
 * Pagination defaults
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100] as const,
} as const;

/**
 * Date and time formats
 */
export const DATE_FORMATS = {
  DATE: "YYYY-MM-DD",
  TIME: "HH:mm:ss",
  DATETIME: "YYYY-MM-DD HH:mm:ss",
  DISPLAY_DATE: "DD/MM/YYYY",
  DISPLAY_DATETIME: "DD/MM/YYYY HH:mm",
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  THEME: "pep-theme",
  LANGUAGE: "pep-language",
  AUTH_TOKEN: "pep-auth-token",
  USER: "pep-user",
} as const;

/**
 * Breakpoint values (matching SCSS tokens)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  DEFAULT: 200,
  SLOW: 300,
  SLOWER: 500,
} as const;

/**
 * Debounce delays in milliseconds
 */
export const DEBOUNCE_DELAY = {
  SEARCH: 300,
  RESIZE: 150,
  SCROLL: 100,
  INPUT: 200,
} as const;

/**
 * Z-index layers (matching SCSS tokens)
 */
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;
