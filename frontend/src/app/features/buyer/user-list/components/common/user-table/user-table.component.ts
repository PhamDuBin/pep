import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User, UserPermission } from '../../../models/user-list.model';
import { PERMISSION_LABELS } from '../../../constants/user-list.constant';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent {
  @Input() users: User[] = [];
  @Input() isAllSelected: boolean = false;
  @Input() showCheckbox: boolean = true;

  @Output() toggleSelection = new EventEmitter<string>();
  @Output() toggleAllSelection = new EventEmitter<void>();
  @Output() changePermission = new EventEmitter<string>();

  getPermissionLabel(permission: UserPermission): string {
    return PERMISSION_LABELS[permission] || permission;
  }

  onToggleSelection(userId: string): void {
    this.toggleSelection.emit(userId);
  }

  onToggleAllSelection(): void {
    this.toggleAllSelection.emit();
  }

  onChangePermission(userId: string): void {
    this.changePermission.emit(userId);
  }
}
