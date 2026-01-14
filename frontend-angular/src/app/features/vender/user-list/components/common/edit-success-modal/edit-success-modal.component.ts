import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRole } from '../../../models/user.model';

@Component({
    selector: 'app-edit-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './edit-success-modal.component.html',
    styleUrl: './edit-success-modal.component.scss'
})
export class EditSuccessModalComponent {
    @Input() isOpen = false;
    @Input() userName = '';
    @Input() newRole: UserRole = 'メンバー';
    @Output() close = new EventEmitter<void>();

    onClose(): void {
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onClose();
        }
    }
}
