import { Component, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TabNavigationComponent } from '../../../../shared/components/tab-navigation/tab-navigation.component';
import { VendorMessageListComponent } from '../common/vendor-message-list/vendor-message-list.component';
import { VendorChatComponent } from '../common/vendor-chat/vendor-chat.component';
import { AddMemberModalComponent, AddMemberModalState } from '../common/add-member-modal/add-member-modal.component';
import { CarryService } from '../../services/carry.service';
import { VendorContact, SearchableUser } from '../../models/carry.model';
import { Tab } from '../../../home/models/tab.model';

@Component({
  selector: 'app-carry',
  standalone: true,
  imports: [
    CommonModule,
    TabNavigationComponent,
    VendorMessageListComponent,
    VendorChatComponent,
    AddMemberModalComponent
  ],
  templateUrl: './carry.component.html',
  styleUrl: './carry.component.scss'
})
export class CarryComponent implements OnInit, OnDestroy {
  // Tab configuration matching Figma design
  tabs: Tab[] = [
    {
      id: 'kick',
      label: 'kick',
      subLabel: '(AI Chat)',
      icon: 'kick',
      isActive: false,
      isDisabled: false,
    },
    {
      id: 'carry',
      label: 'carry',
      subLabel: '(コミュニケーション)',
      icon: 'carry',
      isActive: true,
      isDisabled: false,
    },
  ];

  // Computed signals from service
  vendors = computed(() => this.carryService.vendors());
  selectedVendor = computed(() => this.carryService.selectedVendor());
  currentConversation = computed(() => this.carryService.currentConversation());
  projectName = computed(() => this.carryService.projectName());
  isLoading = computed(() => this.carryService.isLoading());
  isSending = computed(() => this.carryService.isSending());
  chatMembers = computed(() => this.carryService.chatMembers());
  searchResults = computed(() => this.carryService.searchResults());
  isSearching = computed(() => this.carryService.isSearching());

  // Modal state
  isAddMemberModalOpen = false;
  addMemberModalState: AddMemberModalState = 'search';
  isAddingMembers = false;

  constructor(
    private carryService: CarryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Service loads vendors in constructor
  }

  ngOnDestroy(): void {
    // Reset state when leaving
    this.carryService.clearSelection();
  }

  onTabChange(tab: Tab): void {
    this.tabs = this.tabs.map(t => ({
      ...t,
      isActive: t.id === tab.id
    }));

    if (tab.id === 'kick') {
      this.router.navigate(['/buyer/ai-chat']);
    }
  }

  onMessageSent(message: string): void {
    this.carryService.sendMessage(message).subscribe({
      next: (response) => {
        console.log('Message sent:', response);
      },
      error: (error) => {
        console.error('Error sending message:', error);
      }
    });
  }

  onVendorSelected(vendor: VendorContact): void {
    this.carryService.selectVendor(vendor);
    this.carryService.loadChatMembers();
  }

  onAddMemberClicked(): void {
    this.isAddMemberModalOpen = true;
    this.addMemberModalState = 'search';
    this.carryService.clearSearchResults();
  }

  onExitChatClicked(): void {
    this.carryService.exitChat().subscribe({
      next: (success) => {
        if (success) {
          console.log('Exited chat successfully');
        }
      },
      error: (error) => {
        console.error('Error exiting chat:', error);
      }
    });
  }

  onVendorExitClicked(vendor: VendorContact): void {
    // Select the vendor first if not selected
    if (this.selectedVendor()?.id !== vendor.id) {
      this.carryService.selectVendor(vendor);
    }
    this.onExitChatClicked();
  }

  onCloseAddMemberModal(): void {
    this.isAddMemberModalOpen = false;
    this.addMemberModalState = 'search';
    this.carryService.clearSearchResults();
  }

  onSearchMembers(query: string): void {
    this.carryService.searchUsers(query);
  }

  onAddMembers(members: SearchableUser[]): void {
    this.isAddingMembers = true;
    this.carryService.addMembers(members).subscribe({
      next: (response) => {
        this.isAddingMembers = false;
        if (response.success) {
          this.addMemberModalState = 'complete';
        }
      },
      error: (error) => {
        this.isAddingMembers = false;
        console.error('Error adding members:', error);
      }
    });
  }
}
