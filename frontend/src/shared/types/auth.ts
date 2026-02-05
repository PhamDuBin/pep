/**
 * Authentication-related type definitions
 */

/**
 * Sign-in credentials
 */
export interface SignInCredentials {
    email: string;
    password: string;
}

/**
 * Props for the SignInForm component
 */
export interface SignInFormProps {
    /** Title to display at the top of the form */
    title?: string;
    /** Callback function when form is submitted */
    onSubmit: (email: string, password: string) => Promise<void>;
    /** Callback function when forgot password is clicked */
    onForgotPassword?: () => void;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * Props for the ForgotPasswordForm component
 */
export interface ForgotPasswordFormProps {
    /** Title to display at the top of the form */
    title?: string;
    /** Callback function when form is submitted */
    onSubmit: (email: string) => Promise<void>;
    /** Callback function when back button is clicked */
    onBack?: () => void;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * Forgot password form data
 */
export interface ForgotPasswordData {
    email: string;
}

/**
 * Authentication error response
 */
export interface AuthError {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
}
