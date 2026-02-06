import { UserType } from "../types";

export interface RegistrationFormData {
  email: string;
  password: string;
  passwordConfirm: string;
  acceptTerms: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  userType?: UserType;
  createdAt?: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  session: {
    access_token: string;
    refresh_token: string;
  } | null;
}

export interface AuthError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaymentsFormData {
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  cardholderName: string;
  country: string;
  postalCode: string;
  prefecture: string;
  city: string;
  streetAddress: string;
  buildingName: string;
}
