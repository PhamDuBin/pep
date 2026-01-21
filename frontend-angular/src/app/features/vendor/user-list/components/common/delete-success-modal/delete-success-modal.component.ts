import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-success-modal.component.html',
    styleUrl: './delete-success-modal.component.scss'
})
export class DeleteSuccessModalComponent {
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
