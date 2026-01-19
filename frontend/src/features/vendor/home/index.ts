// Components
export { HomePage } from "./HomePage";

// Backward compatibility alias
export { HomePage as VendorHomePage } from "./HomePage";

// Hooks
export { useVendorHome } from "./hooks";

// Types
export type {
  VendorMessage,
  VendorThreadMessage,
  VendorMessageThread,
} from "./types";

// Mock data
export {
  MOCK_VENDOR_MESSAGES,
  MOCK_VENDOR_MESSAGE_THREADS,
} from "./mock";
