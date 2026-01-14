// Import shared models for local use
import type { PdfPage, Vendor } from '../../shared/models/chat.model';

// Re-export shared models
export type { PdfPage, DownloadFormat, Vendor, ChatMessage } from '../../shared/models/chat.model';

export interface ProjectPlan {
  id: string;
  title: string;
  content: ProjectPlanContent;
  pdfPages: PdfPage[];
  status: ProjectPlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectPlanContent {
  background: string;
  purpose: string;
  goal: string;
  scope: ProjectScope[];
  schedule: ScheduleItem[];
  qualityStandards: string[];
  staffing: StaffingItem[];
  totalCost: string;
}

export interface ProjectScope {
  phase: string;
  item: string;
  period: string;
  description: string;
}

export interface ScheduleItem {
  phase: number;
  name: string;
  period: string;
  description: string;
}

export interface StaffingItem {
  department: string;
  count: number;
  duration: string;
  unitPrice: string;
  total: string;
}

export type ProjectPlanStatus = 'generating' | 'preview' | 'confirmed' | 'sent';

export interface SendRfpRequest {
  projectPlanId: string;
  vendorIds: string[];
}

export interface SendRfpResponse {
  success: boolean;
  sentVendors: Vendor[];
  message: string;
}
