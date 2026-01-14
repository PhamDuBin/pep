// =============================================================================
// PROJECT PLAN MODEL
// =============================================================================

import { PdfPage } from "./pdf-page.model";

export interface ProjectPlanContent {
  background: string;
  purpose: string;
  goal: string;
  scope: Array<{
    phase: string;
    item: string;
    period: string;
    description: string;
  }>;
  schedule: Array<{
    phase: number;
    name: string;
    period: string;
    description: string;
  }>;
  qualityStandards: string[];
  staffing: Array<{
    department: string;
    count: number;
    duration: string;
    unitPrice: string;
    total: string;
  }>;
  totalCost: string;
}

export interface ProjectPlan {
  id: string;
  title: string;
  content: ProjectPlanContent;
  pdfPages: PdfPage[];
  status: "draft" | "preview" | "confirmed" | "sent";
  createdAt: Date;
  updatedAt: Date;
}
