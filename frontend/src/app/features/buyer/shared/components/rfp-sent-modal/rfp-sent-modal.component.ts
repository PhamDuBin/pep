import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vendor } from '../../models/chat.model';

@Component({
  selector: 'app-shared-rfp-sent-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfp-sent-modal.component.html',
  styleUrl: './rfp-sent-modal.component.scss'
})
export class SharedRfpSentModalComponent {
  @Input() isOpen = false;
  @Input() vendors: Vendor[] = [];
  @Input() itemsPerRow = 2;

  @Output() vendorChat = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onVendorChat(): void {
    this.vendorChat.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  getVendorRows(): Vendor[][] {
    const rows: Vendor[][] = [];

    for (let i = 0; i < this.vendors.length; i += this.itemsPerRow) {
      rows.push(this.vendors.slice(i, i + this.itemsPerRow));
    }

    return rows;
  }
}
