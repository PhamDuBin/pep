/**
 * API configuration (to be updated when API is ready)
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
} as const;
