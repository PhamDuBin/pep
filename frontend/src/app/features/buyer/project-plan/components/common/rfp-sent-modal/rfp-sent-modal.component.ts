import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vendor } from '../../../models/project-plan.model';

@Component({
  selector: 'app-rfp-sent-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfp-sent-modal.component.html',
  styleUrl: './rfp-sent-modal.component.scss'
})
export class RfpSentModalComponent {
  @Input() isOpen = false;
  @Input() vendors: Vendor[] = [];

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
    const itemsPerRow = 3;

    for (let i = 0; i < this.vendors.length; i += itemsPerRow) {
      rows.push(this.vendors.slice(i, i + itemsPerRow));
    }

    return rows;
  }
}
