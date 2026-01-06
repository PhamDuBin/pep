import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { SideMenuComponent } from '../../../../shared/components/side-menu/side-menu.component';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { ChatMessageListComponent } from '../common/chat-message-list/chat-message-list.component';
import { ChatInputBoxComponent } from '../common/chat-input-box/chat-input-box.component';
import { PdfPreviewComponent } from '../common/pdf-preview/pdf-preview.component';
import { DownloadFormatModalComponent } from '../common/download-format-modal/download-format-modal.component';
import { RfpConfirmModalComponent } from '../common/rfp-confirm-modal/rfp-confirm-modal.component';
import { VendorSelectionModalComponent } from '../common/vendor-selection-modal/vendor-selection-modal.component';
import { RfpSentModalComponent } from '../common/rfp-sent-modal/rfp-sent-modal.component';
import { ProjectPlanService } from '../../services/project-plan.service';
import { Tab } from '../../../home/models/tab.model';
import { DownloadFormat, Vendor } from '../../models/project-plan.model';
import { MODE_DESCRIPTION, CHAT_INPUT_PLACEHOLDER } from '../../constants/project-plan.constant';

@Component({
  selector: 'app-project-plan',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    SideMenuComponent,
    TabNavigationComponent,
    ChatMessageListComponent,
    ChatInputBoxComponent,
    PdfPreviewComponent,
    DownloadFormatModalComponent,
    RfpConfirmModalComponent,
    VendorSelectionModalComponent,
    RfpSentModalComponent,
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

  constructor(private projectPlanService: ProjectPlanService, private router: Router) {}

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
      console.log('Navigate to carry page');
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
}
