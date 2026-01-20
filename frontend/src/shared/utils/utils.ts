import { ApiError } from "../errors/ApiError";
import { HTTP_STATUS } from "../constants/http-status-code";
import { DateFormat } from "../types";

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

/**
  formatDate(date);                        // "2024/01/15 14:30"
  formatDate(date, "YYYY/MM/DD");          // "2024/01/15"
  formatDate(date, "MM/DD HH:MM");         // "01/15 14:30"
 */
export function formatDate(
  input: Date | string | number | null | undefined,
  format: DateFormat = "YYYY/MM/DD HH:MM"
): string {
  if (input === null || input === undefined) {
    return "";
  }

  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  switch (format) {
    case "YYYY/MM/DD":
      return `${year}/${month}/${day}`;
    case "MM/DD HH:MM":
      return `${month}/${day} ${hours}:${minutes}`;
    case "YYYY/MM/DD HH:MM":
    default:
      return `${year}/${month}/${day} ${hours}:${minutes}`;
  }
}
