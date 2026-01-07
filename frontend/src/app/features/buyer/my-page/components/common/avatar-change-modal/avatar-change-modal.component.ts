import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarColorOption } from '../../../models/my-page.model';

@Component({
  selector: 'app-avatar-change-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar-change-modal.component.html',
  styleUrl: './avatar-change-modal.component.scss'
})
export class AvatarChangeModalComponent {
  @Input() isOpen: boolean = false;
  @Input() colorOptions: AvatarColorOption[] = [];
  @Input() isSaving: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() selectColor = new EventEmitter<string>();
  @Output() save = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  onColorSelect(colorId: string): void {
    this.selectColor.emit(colorId);
  }

  onSave(): void {
    this.save.emit();
  }
}
