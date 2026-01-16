import { ApiError } from "../errors/ApiError";
import { HTTP_STATUS } from "../constants/http-status-code";

/**
 * Create a timeout promise
 */
export function createTimeout(ms: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError("Request timeout", HTTP_STATUS.REQUEST_TIMEOUT));
    }, ms);
  });
}
