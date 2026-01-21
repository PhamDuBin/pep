// =============================================================================
// API MODELS
// =============================================================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Generic error response
 */
export interface ErrorResponse {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  headers?: Record<string, string>;
  body?: unknown;
  timeout?: number;
}
