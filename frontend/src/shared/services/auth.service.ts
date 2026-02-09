// =============================================================================
// AUTH SERVICE
// =============================================================================
// Authentication service using Supabase Auth

import { UserType } from "../types";
import { supabase } from "./supabase";
import type {
  RegistrationFormData,
  LoginFormData,
  AuthResponse,
  AuthError,
} from "@/shared/models";

/**
 * Sign up a new user
 * @param data - Registration form data
 * @param userType - User type (buyer or vendor)
 * @returns Auth response with user and session
 */
export async function signUp(
  data: RegistrationFormData,
  userType: UserType,
): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          user_type: userType,
        },
      },
    });

    if (error) {
      throw error;
    }

    return {
      user: authData.user
        ? {
            id: authData.user.id,
            email: authData.user.email!,
            userType,
            createdAt: authData.user.created_at,
          }
        : null,
      session: authData.session,
    };
  } catch (error) {
    const authError = error as AuthError;
    throw {
      message: authError.message || "Registration failed",
      code: authError.code,
      status: authError.status,
    };
  }
}

/**
 * Sign in an existing user
 * @param data - Login form data
 * @returns Auth response with user and session
 */
export async function signIn(data: LoginFormData): Promise<AuthResponse> {
  try {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw error;
    }

    return {
      user: authData.user
        ? {
            id: authData.user.id,
            email: authData.user.email!,
            userType: authData.user.user_metadata?.user_type,
            createdAt: authData.user.created_at,
          }
        : null,
      session: authData.session,
    };
  } catch (error) {
    const authError = error as AuthError;
    throw {
      message: authError.message || "Login failed",
      code: authError.code,
      status: authError.status,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    const authError = error as AuthError;
    throw {
      message: authError.message || "Sign out failed",
      code: authError.code,
      status: authError.status,
    };
  }
}

/**
 * Get current user
 * @returns Current user or null
 */
export async function getCurrentUser(): Promise<AuthResponse["user"]> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email!,
      userType: user.user_metadata?.user_type,
      createdAt: user.created_at,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Listen to auth state changes
 * @param callback - Callback function when auth state changes
 * @returns Unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: AuthResponse["user"]) => void,
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    const user = session?.user
      ? {
          id: session.user.id,
          email: session.user.email!,
          userType: session.user.user_metadata?.user_type,
          createdAt: session.user.created_at,
        }
      : null;
    callback(user);
  });

  return () => subscription.unsubscribe();
}
