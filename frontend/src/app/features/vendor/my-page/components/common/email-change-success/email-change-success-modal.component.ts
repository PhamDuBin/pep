import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-email-change-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './email-change-success-modal.component.html',
    styleUrl: './email-change-success-modal.component.scss'
})
export class EmailChangeSuccessModalComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    onClose(): void {
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.onClose();
        }
    }
}
