// =============================================================================
// PROJECT PLAN SERVICE
// =============================================================================

import { Vendor, ProjectPlan } from "../models";
import { DownloadFormat } from "../types";
import {
  VENDORS_MOCK,
  PROJECT_PLAN_MOCK,
  PROJECT_PLAN_AI_RESPONSE_MOCK,
} from "../mock/project-plan.data";

const USE_MOCK = true;

/**
 * Get list of vendors
 */
export async function getVendors(): Promise<Vendor[]> {
  if (USE_MOCK) {
    return VENDORS_MOCK;
  }

  const res = await fetch("/api/vendors");
  if (!res.ok) throw new Error("Failed to fetch vendors");

  return res.json();
}

/**
 * Get project plan by ID
 */
export async function getProjectPlan(planId?: string): Promise<ProjectPlan> {
  if (USE_MOCK) {
    return PROJECT_PLAN_MOCK;
  }

  const res = await fetch(`/api/project-plans/${planId}`);
  if (!res.ok) throw new Error("Failed to fetch project plan");

  return res.json();
}

/**
 * Generate project plan from message
 */
export async function generateProjectPlan(message: string): Promise<string> {
  if (USE_MOCK) {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    return PROJECT_PLAN_AI_RESPONSE_MOCK;
  }

  const res = await fetch("/api/project-plans/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) throw new Error("Failed to generate project plan");

  const data = await res.json();
  return data.response;
}

/**
 * Download project plan in specified format
 */
export async function downloadProjectPlan(
  planId: string,
  format: DownloadFormat
): Promise<Blob> {
  if (USE_MOCK) {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return empty blob for mock
    return new Blob(["mock content"], { type: "application/pdf" });
  }

  const res = await fetch(`/api/project-plans/${planId}/download?format=${format}`);
  if (!res.ok) throw new Error("Failed to download project plan");

  return res.blob();
}

/**
 * Send RFP to selected vendors
 */
export async function sendRfpToVendors(
  planId: string,
  vendorIds: string[]
): Promise<{ success: boolean; sentCount: number }> {
  if (USE_MOCK) {
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return { success: true, sentCount: vendorIds.length };
  }

  const res = await fetch("/api/rfp/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, vendorIds }),
  });

  if (!res.ok) throw new Error("Failed to send RFP");

  return res.json();
}
