import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorContact } from '../../../models/carry.model';
import { VendorMessageItemComponent } from '../vendor-message-item/vendor-message-item.component';
import { MESSAGE_LIST_TITLE } from '../../../constants/carry.constant';

@Component({
  selector: 'app-vendor-message-list',
  standalone: true,
  imports: [CommonModule, FormsModule, VendorMessageItemComponent],
  templateUrl: './vendor-message-list.component.html',
  styleUrl: './vendor-message-list.component.scss'
})
export class VendorMessageListComponent {
  @Input() set vendors(value: VendorContact[]) {
    this._vendors.set(value);
  }
  @Input() selectedVendorId: string | null = null;

  @Output() vendorSelected = new EventEmitter<VendorContact>();
  @Output() vendorExitClicked = new EventEmitter<VendorContact>();

  searchQuery = signal('');
  private _vendors = signal<VendorContact[]>([]);

  listTitle = MESSAGE_LIST_TITLE;

  filteredVendors = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const vendors = this._vendors();

    if (!query) {
      return vendors;
    }

    return vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(query) ||
      vendor.lastMessage?.toLowerCase().includes(query)
    );
  });

  onSearchChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  onVendorSelect(vendor: VendorContact): void {
    this.vendorSelected.emit(vendor);
  }

  onVendorExit(vendor: VendorContact): void {
    this.vendorExitClicked.emit(vendor);
  }

  trackByVendorId(index: number, vendor: VendorContact): string {
    return vendor.id;
  }
}
