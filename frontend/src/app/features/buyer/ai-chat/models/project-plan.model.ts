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

export interface PdfPage {
  id: string;
  pageNumber: number;
  title: string;
  thumbnailUrl?: string;
}

export type ProjectPlanStatus = 'generating' | 'preview' | 'confirmed' | 'sent';

export type DownloadFormat = 'pdf' | 'ppt';

export interface Vendor {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface SendRfpRequest {
  projectPlanId: string;
  vendorIds: string[];
}

export interface SendRfpResponse {
  success: boolean;
  sentVendors: Vendor[];
  message: string;
}
