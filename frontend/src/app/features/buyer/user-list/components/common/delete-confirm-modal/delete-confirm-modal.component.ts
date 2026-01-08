import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

@Component({
  selector: 'app-delete-confirm-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './delete-confirm-modal.component.html',
  styleUrl: './delete-confirm-modal.component.scss'
})
export class DeleteConfirmModalComponent {
  @Input() isOpen: boolean = false;
  @Input() modalType: 'confirm' | 'complete' = 'confirm';
  @Input() selectedCount: number = 0;
  @Input() isSaving: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
