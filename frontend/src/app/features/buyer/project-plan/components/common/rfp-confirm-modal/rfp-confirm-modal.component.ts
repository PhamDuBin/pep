import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rfp-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rfp-confirm-modal.component.html',
  styleUrl: './rfp-confirm-modal.component.scss'
})
export class RfpConfirmModalComponent {
  @Input() isOpen = false;
  @Output() selectVendors = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  previewImages: string[] = [
    'pictures/pic1.jpg',
    'pictures/pic2.jpg',
  ];

  onSelectVendors(): void {
    this.selectVendors.emit();
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
