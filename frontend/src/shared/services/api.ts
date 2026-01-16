// =============================================================================
// API SERVICE
// =============================================================================
// Base API service for making HTTP requests.
// Ready for future API integration.

import { API_CONFIG, HTTP_STATUS } from "@/shared/constants";
import {
  type ApiResponse,
  type ErrorResponse,
  type RequestOptions,
} from "@/shared/types";
import { ApiError } from "../errors/ApiError";
import { createTimeout } from "../utils/utils";

/**
 * Make an API request
 * @param endpoint - API endpoint
 * @param options - Request options
 * @returns API response
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const {
    method = "GET",
    headers = {},
    body,
    timeout = API_CONFIG.TIMEOUT,
  } = options;

  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  const fetchOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== "GET") {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await Promise.race([
      fetch(url, fetchOptions),
      createTimeout(timeout),
    ]);

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ErrorResponse;
      throw new ApiError(
        errorData.message || "Request failed",
        response.status,
        errorData.code,
        errorData.details
      );
    }

    return {
      data: data as T,
      success: true,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError(
      error instanceof Error ? error.message : "Unknown error",
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}

/**
 * API service methods
 */
export const api = {
  get: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => request<T>(endpoint, { ...options, method: "POST", body }),

  put: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => request<T>(endpoint, { ...options, method: "PUT", body }),

  patch: <T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<RequestOptions, "method">
  ) => request<T>(endpoint, { ...options, method: "PATCH", body }),

  delete: <T>(
    endpoint: string,
    options?: Omit<RequestOptions, "method" | "body">
  ) => request<T>(endpoint, { ...options, method: "DELETE" }),
};
