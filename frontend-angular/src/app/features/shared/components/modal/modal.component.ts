import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  /** Controls modal visibility */
  @Input() isOpen: boolean = false;

  /** Modal title - displayed at the top */
  @Input() title: string = '';

  /** Modal size: sm (400px), md (500px), lg (700px), xl (800px) */
  @Input() size: ModalSize = 'md';

  /** Show/hide close button (X) */
  @Input() showCloseButton: boolean = true;

  /** Close modal when clicking backdrop */
  @Input() closeOnBackdrop: boolean = true;

  /** Show loading spinner state */
  @Input() isLoading: boolean = false;

  /** Custom CSS class for modal container */
  @Input() customClass: string = '';

  /** Emitted when modal is closed */
  @Output() closed = new EventEmitter<void>();

  /** Handle ESC key to close modal */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen) {
      this.onClose();
    }
  }

  onClose(): void {
    this.closed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && (event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }

  get sizeClass(): string {
    const sizes: Record<ModalSize, string> = {
      'sm': 'modal-sm',
      'md': 'modal-md',
      'lg': 'modal-lg',
      'xl': 'modal-xl'
    };
    return sizes[this.size];
  }
}
