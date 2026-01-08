import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserRole } from '../../../models/user.model';

@Component({
    selector: 'app-edit-user-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-user-modal.component.html',
    styleUrl: './edit-user-modal.component.scss'
})
export class EditUserModalComponent {
    @Input() isOpen = false;
    @Input() user: User | null = null;
    @Output() save = new EventEmitter<{ userId: number, newRole: UserRole }>();
    @Output() cancel = new EventEmitter<void>();

    selectedRole: UserRole = 'メンバー';

    ngOnChanges(): void {
        if (this.user) {
            this.selectedRole = this.user.role;
        }
    }

    onSave(): void {
        if (this.user) {
            this.save.emit({ userId: this.user.id, newRole: this.selectedRole });
        }
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
