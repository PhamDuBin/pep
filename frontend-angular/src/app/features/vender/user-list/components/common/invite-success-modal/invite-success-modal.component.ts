import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-invite-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './invite-success-modal.component.html',
    styleUrl: './invite-success-modal.component.scss'
})
export class InviteSuccessModalComponent {
    @Input() isOpen = false;
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
