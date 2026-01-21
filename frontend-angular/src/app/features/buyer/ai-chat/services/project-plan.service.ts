import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ProjectPlan,
  ProjectPlanStatus,
  DownloadFormat,
  Vendor,
  SendRfpResponse
} from '../models/project-plan.model';
import {
  MOCK_PROJECT_PLAN,
  MOCK_VENDORS,
  PROJECT_PLAN_AI_RESPONSE,
  PROJECT_PLAN_COST_RESPONSE
} from '../constants/project-plan.constant';

@Injectable({
  providedIn: 'root'
})
export class ProjectPlanService {
  private currentPlanSignal = signal<ProjectPlan | null>(null);
  private isGeneratingSignal = signal<boolean>(false);
  private showPdfPreviewSignal = signal<boolean>(false);
  private showDownloadModalSignal = signal<boolean>(false);
  private showRfpSentModalSignal = signal<boolean>(false);
  private sentVendorsSignal = signal<Vendor[]>([]);

  // Public readonly signals
  currentPlan = this.currentPlanSignal.asReadonly();
  isGenerating = this.isGeneratingSignal.asReadonly();
  showPdfPreview = this.showPdfPreviewSignal.asReadonly();
  showDownloadModal = this.showDownloadModalSignal.asReadonly();
  showRfpSentModal = this.showRfpSentModalSignal.asReadonly();
  sentVendors = this.sentVendorsSignal.asReadonly();

  /**
   * Generate project plan from user input
   */
  generateProjectPlan(userInput: string): Observable<ProjectPlan> {
    this.isGeneratingSignal.set(true);

    return new Observable(observer => {
      // Simulate AI generating project plan
      setTimeout(() => {
        const plan: ProjectPlan = {
          ...MOCK_PROJECT_PLAN,
          id: Date.now().toString(),
          title: userInput,
          status: 'generating',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        this.currentPlanSignal.set(plan);
        this.isGeneratingSignal.set(false);

        observer.next(plan);
        observer.complete();
      }, 2000);
    });
  }

  /**
   * Get AI response for project plan generation
   */
  getProjectPlanResponse(): string {
    return PROJECT_PLAN_AI_RESPONSE;
  }

  /**
   * Get cost section response
   */
  getCostResponse(): string {
    return PROJECT_PLAN_COST_RESPONSE;
  }

  /**
   * Show PDF preview
   */
  showPreview(): void {
    if (this.currentPlanSignal()) {
      this.currentPlanSignal.update(plan => plan ? { ...plan, status: 'preview' } : null);
      this.showPdfPreviewSignal.set(true);
    }
  }

  /**
   * Hide PDF preview
   */
  hidePreview(): void {
    this.showPdfPreviewSignal.set(false);
  }

  /**
   * Open download format modal
   */
  openDownloadModal(): void {
    this.showDownloadModalSignal.set(true);
  }

  /**
   * Close download format modal
   */
  closeDownloadModal(): void {
    this.showDownloadModalSignal.set(false);
  }

  /**
   * Download project plan in specified format
   */
  downloadPlan(format: DownloadFormat): Observable<Blob> {
    this.closeDownloadModal();

    // Simulate download
    return new Observable(observer => {
      setTimeout(() => {
        const mockBlob = new Blob(['Mock PDF/PPT content'], {
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-powerpoint'
        });
        observer.next(mockBlob);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Confirm project plan and prepare for RFP
   */
  confirmPlan(): Observable<boolean> {
    return new Observable(observer => {
      setTimeout(() => {
        this.currentPlanSignal.update(plan => plan ? { ...plan, status: 'confirmed' } : null);
        observer.next(true);
        observer.complete();
      }, 500);
    });
  }

  /**
   * Send RFP to vendors
   */
  sendRfpToVendors(): Observable<SendRfpResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const sentVendors = MOCK_VENDORS;
        this.sentVendorsSignal.set(sentVendors);
        this.currentPlanSignal.update(plan => plan ? { ...plan, status: 'sent' } : null);
        this.showRfpSentModalSignal.set(true);
        this.showPdfPreviewSignal.set(false);

        observer.next({
          success: true,
          sentVendors,
          message: '以下のベンダーへRFPを送信しました'
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Close RFP sent modal
   */
  closeRfpSentModal(): void {
    this.showRfpSentModalSignal.set(false);
  }

  /**
   * Navigate to vendor chat
   */
  navigateToVendorChat(): void {
    this.closeRfpSentModal();
    // Navigation will be handled by the component
  }

  /**
   * Reset all state
   */
  reset(): void {
    this.currentPlanSignal.set(null);
    this.isGeneratingSignal.set(false);
    this.showPdfPreviewSignal.set(false);
    this.showDownloadModalSignal.set(false);
    this.showRfpSentModalSignal.set(false);
    this.sentVendorsSignal.set([]);
  }

  /**
   * Get available vendors
   */
  getVendors(): Observable<Vendor[]> {
    return of(MOCK_VENDORS).pipe(delay(300));
  }
}
