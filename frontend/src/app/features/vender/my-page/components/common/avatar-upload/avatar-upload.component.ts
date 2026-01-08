import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AvatarColor {
    color: string;
    label: string;
}

@Component({
    selector: 'app-avatar-upload-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './avatar-upload.component.html',
    styleUrl: './avatar-upload.component.scss'
})
export class AvatarUploadModalComponent {
    @Input() isOpen = false;
    @Input() currentAvatarColor?: string;

    @Output() avatarChange = new EventEmitter<string>();
    @Output() close = new EventEmitter<void>();

    // Available avatar colors from G-04 design
    avatarColors: AvatarColor[] = [
        { color: '#8EC5D0', label: 'Blue' },
        { color: '#D08EC9', label: 'Purple' },
        { color: '#83B588', label: 'Green' },
        { color: '#CFD08E', label: 'Yellow' }
    ];

    selectedColor: string = '#8EC5D0'; // Default to blue

    ngOnInit() {
        // Set initial selected color from current avatar color if provided
        if (this.currentAvatarColor) {
            this.selectedColor = this.currentAvatarColor;
        }
    }

    selectColor(color: string): void {
        this.selectedColor = color;
    }

    onSave(): void {
        this.avatarChange.emit(this.selectedColor);
        this.close.emit();
    }

    onClose(): void {
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent): void {
        if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
            this.onClose();
        }
    }
}
