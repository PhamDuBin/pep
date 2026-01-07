import { Component, computed, OnInit, OnDestroy, ViewChild, ElementRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import {
  SharedChatMessageListComponent,
  SharedChatInputBoxComponent,
  SharedPdfPreviewComponent,
  SharedDownloadFormatModalComponent,
  SharedRfpSentModalComponent,
  DownloadFormat,
  Vendor
} from '../../../shared';
import { RfpConfirmModalComponent } from '../common/rfp-confirm-modal/rfp-confirm-modal.component';
import { VendorSelectionModalComponent } from '../common/vendor-selection-modal/vendor-selection-modal.component';
import { ProjectPlanService } from '../../services/project-plan.service';
import { Tab } from '../../../home/models/tab.model';
import { MODE_DESCRIPTION, CHAT_INPUT_PLACEHOLDER } from '../../constants/project-plan.constant';

@Component({
  selector: 'app-project-plan',
  standalone: true,
  imports: [
    CommonModule,
    TabNavigationComponent,
    SharedChatMessageListComponent,
    SharedChatInputBoxComponent,
    SharedPdfPreviewComponent,
    SharedDownloadFormatModalComponent,
    RfpConfirmModalComponent,
    VendorSelectionModalComponent,
    SharedRfpSentModalComponent,
  ],
  templateUrl: './project-plan.component.html',
  styleUrl: './project-plan.component.scss',
})
export class ProjectPlanComponent implements OnInit, OnDestroy {
  tabs: Tab[] = [
    {
      id: 'kick',
      label: 'kick',
      subLabel: '(AI Chat)',
      icon: 'kick',
      isActive: true,
      isDisabled: false,
    },
    {
      id: 'carry',
      label: 'carry',
      subLabel: '(コミュニケーション)',
      icon: 'carry',
      isActive: false,
      isDisabled: false,
    },
  ];

  messages = computed(() => this.projectPlanService.messages());
  pdfPages = computed(() => this.projectPlanService.pdfPages());
  isLoading = computed(() => this.projectPlanService.isLoading());
  showPdfPreview = computed(() => this.projectPlanService.showPdfPreview());
  showDownloadModal = computed(() => this.projectPlanService.showDownloadModal());
  showRfpConfirmModal = computed(() => this.projectPlanService.showRfpConfirmModal());
  showVendorSelectionModal = computed(() => this.projectPlanService.showVendorSelectionModal());
  showRfpSentModal = computed(() => this.projectPlanService.showRfpSentModal());
  sentVendors = computed(() => this.projectPlanService.sentVendors());
  availableVendors = computed(() => this.projectPlanService.availableVendors());

  modeDescription = MODE_DESCRIPTION;
  chatPlaceholder = CHAT_INPUT_PLACEHOLDER;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(private projectPlanService: ProjectPlanService, private router: Router) {
    // Effect to scroll when PDF preview appears
    effect(() => {
      if (this.showPdfPreview()) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  ngOnInit(): void {
    // Reset state when entering the page
    this.projectPlanService.resetState();
  }

  ngOnDestroy(): void {
    // Optionally reset state when leaving
  }

  onTabChange(tab: Tab): void {
    this.tabs = this.tabs.map((t) => ({
      ...t,
      isActive: t.id === tab.id,
    }));

    if (tab.id === 'carry') {
      this.router.navigate(['/buyer/carry']);
    }
  }

  onMessageSent(message: string): void {
    this.projectPlanService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Project plan message sent:', response);
      },
      error: (error) => {
        console.error('Error sending message:', error);
      },
    });
  }

  onMicrophoneClicked(): void {
    console.log('Microphone clicked - voice input not implemented');
  }

  onDownloadClick(): void {
    this.projectPlanService.openDownloadModal();
  }

  onConfirmClick(): void {
    // Open RFP confirmation modal (step 1 of the flow)
    this.projectPlanService.openRfpConfirmModal();
  }

  onSelectVendors(): void {
    // Open vendor selection modal (step 2 of the flow)
    this.projectPlanService.openVendorSelectionModal();
  }

  onCloseRfpConfirmModal(): void {
    this.projectPlanService.closeRfpConfirmModal();
  }

  onSendRfp(selectedVendors: Vendor[]): void {
    // Send RFP to selected vendors (step 3 of the flow)
    this.projectPlanService.sendRfpToVendors(selectedVendors).subscribe({
      next: (response) => {
        console.log('RFP sent:', response);
      },
      error: (error) => {
        console.error('Error sending RFP:', error);
      },
    });
  }

  onCloseVendorSelectionModal(): void {
    this.projectPlanService.closeVendorSelectionModal();
  }

  onDownloadFormat(format: DownloadFormat): void {
    this.projectPlanService.downloadPlan(format);
  }

  onCloseDownloadModal(): void {
    this.projectPlanService.closeDownloadModal();
  }

  onVendorChat(): void {
    this.projectPlanService.navigateToVendorChat();
    // Navigate to vendor chat page
    console.log('Navigate to vendor chat');
  }

  onCloseRfpModal(): void {
    this.projectPlanService.closeRfpSentModal();
  }

  onBackToBuyerHome(): void {
    this.router.navigate(['/buyer']);
  }

  onChatContentChanged(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      const element = this.scrollContainer?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
}
