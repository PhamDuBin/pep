import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ChatMessage,
  PdfPage,
  Vendor,
  ProjectPlanStatus,
  DownloadFormat,
  SendRfpResponse
} from '../models/project-plan.model';
import {
  MOCK_PDF_PAGES,
  MOCK_VENDORS,
  PROJECT_PLAN_AI_RESPONSE,
  PROJECT_PLAN_COST_RESPONSE,
  INITIAL_AI_MESSAGE
} from '../constants/project-plan.constant';

@Injectable({
  providedIn: 'root'
})
export class ProjectPlanService {
  private messagesSignal = signal<ChatMessage[]>([INITIAL_AI_MESSAGE]);
  private pdfPagesSignal = signal<PdfPage[]>([]);
  private planStatusSignal = signal<ProjectPlanStatus>('generating');
  private isLoadingSignal = signal<boolean>(false);
  private showPdfPreviewSignal = signal<boolean>(false);
  private showDownloadModalSignal = signal<boolean>(false);
  private showRfpConfirmModalSignal = signal<boolean>(false);
  private showVendorSelectionModalSignal = signal<boolean>(false);
  private showRfpSentModalSignal = signal<boolean>(false);
  private sentVendorsSignal = signal<Vendor[]>([]);
  private availableVendorsSignal = signal<Vendor[]>([]);

  // Public readonly signals
  messages = this.messagesSignal.asReadonly();
  pdfPages = this.pdfPagesSignal.asReadonly();
  planStatus = this.planStatusSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();
  showPdfPreview = this.showPdfPreviewSignal.asReadonly();
  showDownloadModal = this.showDownloadModalSignal.asReadonly();
  showRfpConfirmModal = this.showRfpConfirmModalSignal.asReadonly();
  showVendorSelectionModal = this.showVendorSelectionModalSignal.asReadonly();
  showRfpSentModal = this.showRfpSentModalSignal.asReadonly();
  sentVendors = this.sentVendorsSignal.asReadonly();
  availableVendors = this.availableVendorsSignal.asReadonly();

  /**
   * Send a message to generate project plan
   */
  sendMessage(content: string): Observable<ChatMessage> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date(),
      sender: 'user',
      isNew: true
    };

    // Mark all existing messages as not new
    this.messagesSignal.update(messages =>
      messages.map(m => ({ ...m, isNew: false }))
    );

    // Add user message
    this.messagesSignal.update(messages => [...messages, userMessage]);
    this.isLoadingSignal.set(true);

    return new Observable(observer => {
      // Simulate AI generating response
      setTimeout(() => {
        // Mark user message as not new
        this.messagesSignal.update(messages =>
          messages.map(m => ({ ...m, isNew: false }))
        );

        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: PROJECT_PLAN_AI_RESPONSE + '\n\n' + PROJECT_PLAN_COST_RESPONSE,
          timestamp: new Date(),
          sender: 'ai',
          isNew: true
        };

        this.messagesSignal.update(messages => [...messages, aiMessage]);
        this.isLoadingSignal.set(false);

        // Show PDF preview after AI response
        setTimeout(() => {
          this.pdfPagesSignal.set(MOCK_PDF_PAGES);
          this.showPdfPreviewSignal.set(true);
          this.planStatusSignal.set('preview');
        }, 500);

        observer.next(aiMessage);
        observer.complete();
      }, 2000);
    });
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
  downloadPlan(format: DownloadFormat): void {
    console.log(`Downloading project plan as ${format.toUpperCase()}`);
    this.closeDownloadModal();
    // In real implementation, trigger actual download
  }

  /**
   * Open RFP confirmation modal (step 1)
   */
  openRfpConfirmModal(): void {
    this.showRfpConfirmModalSignal.set(true);
  }

  /**
   * Close RFP confirmation modal
   */
  closeRfpConfirmModal(): void {
    this.showRfpConfirmModalSignal.set(false);
  }

  /**
   * Open vendor selection modal (step 2)
   */
  openVendorSelectionModal(): void {
    this.showRfpConfirmModalSignal.set(false);
    this.availableVendorsSignal.set(MOCK_VENDORS);
    this.showVendorSelectionModalSignal.set(true);
  }

  /**
   * Close vendor selection modal
   */
  closeVendorSelectionModal(): void {
    this.showVendorSelectionModalSignal.set(false);
  }

  /**
   * Send RFP to selected vendors (step 3)
   */
  sendRfpToVendors(selectedVendors: Vendor[]): Observable<SendRfpResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        this.sentVendorsSignal.set(selectedVendors);
        this.showVendorSelectionModalSignal.set(false);
        this.showPdfPreviewSignal.set(false);
        this.showRfpSentModalSignal.set(true);
        this.planStatusSignal.set('sent');

        observer.next({
          success: true,
          sentVendors: selectedVendors,
          message: 'RFP sent successfully'
        });
        observer.complete();
      }, 500);
    });
  }

  /**
   * @deprecated Use openRfpConfirmModal() instead for proper flow
   * Confirm and send RFP to vendors (legacy - direct send)
   */
  confirmAndSendRfp(): Observable<SendRfpResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        const sentVendors = MOCK_VENDORS.filter(v => v.isSelected);
        this.sentVendorsSignal.set(sentVendors);
        this.showPdfPreviewSignal.set(false);
        this.showRfpSentModalSignal.set(true);
        this.planStatusSignal.set('sent');

        observer.next({
          success: true,
          sentVendors,
          message: 'RFP sent successfully'
        });
        observer.complete();
      }, 500);
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
    // Router navigation will be handled by component
  }

  /**
   * Reset state for new project plan
   */
  resetState(): void {
    this.messagesSignal.set([INITIAL_AI_MESSAGE]);
    this.pdfPagesSignal.set([]);
    this.planStatusSignal.set('generating');
    this.isLoadingSignal.set(false);
    this.showPdfPreviewSignal.set(false);
    this.showDownloadModalSignal.set(false);
    this.showRfpConfirmModalSignal.set(false);
    this.showVendorSelectionModalSignal.set(false);
    this.showRfpSentModalSignal.set(false);
    this.sentVendorsSignal.set([]);
    this.availableVendorsSignal.set([]);
  }
}
