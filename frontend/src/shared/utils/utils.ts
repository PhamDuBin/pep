import { ApiError } from "../types";

/**
 * Create a timeout promise
 */
export function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError("Request timeout", 408));
    }, ms);
  });
}
