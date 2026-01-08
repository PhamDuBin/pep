import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';
import { SearchableUser, ChatMember } from '../../../models/carry.model';

export type AddMemberModalState = 'search' | 'complete';

@Component({
  selector: 'app-add-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent],
  templateUrl: './add-member-modal.component.html',
  styleUrl: './add-member-modal.component.scss'
})
export class AddMemberModalComponent implements OnChanges {
  @Input() isOpen: boolean = false;
  @Input() projectName: string = '';
  @Input() vendorName: string = '';
  @Input() existingMembers: ChatMember[] = [];
  @Input() searchResults: SearchableUser[] = [];
  @Input() isLoading: boolean = false;
  @Input() isSearching: boolean = false;
  @Input() modalState: AddMemberModalState = 'search';

  @Output() close = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();
  @Output() addMembers = new EventEmitter<SearchableUser[]>();

  searchQuery: string = '';
  selectedMembers: SearchableUser[] = [];
  showSuggestions: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && this.isOpen && this.modalState === 'search') {
      this.resetForm();
    }
  }

  private resetForm(): void {
    this.searchQuery = '';
    this.selectedMembers = [];
    this.showSuggestions = false;
  }

  onClose(): void {
    this.close.emit();
  }

  onSearchInput(): void {
    if (this.searchQuery.trim().length > 0) {
      this.showSuggestions = true;
      this.search.emit(this.searchQuery.trim());
    } else {
      this.showSuggestions = false;
    }
  }

  onSearchFocus(): void {
    if (this.searchQuery.trim().length > 0 && this.filteredSearchResults.length > 0) {
      this.showSuggestions = true;
    }
  }

  onSearchBlur(): void {
    // Delay to allow click on suggestion
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  get filteredSearchResults(): SearchableUser[] {
    // Filter out already selected members and existing chat members
    const selectedIds = this.selectedMembers.map(m => m.id);
    const existingIds = this.existingMembers.map(m => m.id);
    return this.searchResults.filter(
      user => !selectedIds.includes(user.id) && !existingIds.includes(user.id)
    );
  }

  selectMember(user: SearchableUser): void {
    if (!this.selectedMembers.find(m => m.id === user.id)) {
      this.selectedMembers.push(user);
    }
    this.searchQuery = '';
    this.showSuggestions = false;
  }

  removeMember(user: SearchableUser): void {
    this.selectedMembers = this.selectedMembers.filter(m => m.id !== user.id);
  }

  onAddMembers(): void {
    if (this.selectedMembers.length > 0) {
      this.addMembers.emit(this.selectedMembers);
    }
  }

  canAddMembers(): boolean {
    return this.selectedMembers.length > 0;
  }

  trackByUserId(index: number, user: SearchableUser): string {
    return user.id;
  }
}
