import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-user-avatar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './user-avatar.component.html',
    styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent {
    @Input() imageUrl?: string;
    @Input() userName: string = '';
    @Input() initials: string = '';
    @Input() avatarColor?: string; // Dynamic avatar background color
    @Input() editable: boolean = false;
    @Output() uploadClick = new EventEmitter<void>();

    onUploadClick() {
        this.uploadClick.emit();
    }
}
