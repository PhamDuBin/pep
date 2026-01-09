import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../models/user.model';

@Component({
    selector: 'app-delete-confirmation-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-confirmation-modal.component.html',
    styleUrl: './delete-confirmation-modal.component.scss'
})
export class DeleteConfirmationModalComponent {
    @Input() isOpen = false;
    @Input() selectedUsers: User[] = [];
    @Output() confirm = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();

    onConfirm(): void {
        this.confirm.emit();
    }

    onCancel(): void {
        this.cancel.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if (event.target === event.currentTarget) {
            this.onCancel();
        }
    }
}
