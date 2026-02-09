// =============================================================================
// SUBSCRIPTION MODELS
// =============================================================================
import { SubscriptionPlan } from "../types/subcription";

export interface SubscriptionStatus {
  plan: SubscriptionPlan;
  label: string; // "PROプラン" or "トライアル中" etc.
  trialEndDate?: string; // ISO date string for trial users
}
