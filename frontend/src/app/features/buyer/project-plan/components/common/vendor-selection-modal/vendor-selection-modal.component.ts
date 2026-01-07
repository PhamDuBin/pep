import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vendor } from '../../../models/project-plan.model';

@Component({
  selector: 'app-vendor-selection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vendor-selection-modal.component.html',
  styleUrl: './vendor-selection-modal.component.scss'
})
export class VendorSelectionModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() vendors: Vendor[] = [];
  @Output() send = new EventEmitter<Vendor[]>();
  @Output() close = new EventEmitter<void>();

  selectedVendorIds: Set<string> = new Set();
  searchQuery = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vendors'] || changes['isOpen']) {
      // Reset selections and search when modal opens
      if (this.isOpen) {
        this.searchQuery = '';
        this.selectedVendorIds = new Set(
          this.vendors.filter(v => v.isSelected).map(v => v.id)
        );
      }
    }
  }

  get filteredVendors(): Vendor[] {
    if (!this.searchQuery.trim()) {
      return this.vendors;
    }
    const query = this.searchQuery.toLowerCase();
    return this.vendors.filter(v => v.name.toLowerCase().includes(query));
  }

  isVendorSelected(vendorId: string): boolean {
    return this.selectedVendorIds.has(vendorId);
  }

  toggleVendor(vendorId: string): void {
    if (this.selectedVendorIds.has(vendorId)) {
      this.selectedVendorIds.delete(vendorId);
    } else {
      this.selectedVendorIds.add(vendorId);
    }
  }

  get selectedCount(): number {
    return this.selectedVendorIds.size;
  }

  onSend(): void {
    const selectedVendors = this.vendors.filter(v => this.selectedVendorIds.has(v.id));
    this.send.emit(selectedVendors);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
}
