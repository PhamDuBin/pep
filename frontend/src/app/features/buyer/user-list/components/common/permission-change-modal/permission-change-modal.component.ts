import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPermission, PermissionOption } from '../../../models/user-list.model';
import { PERMISSION_OPTIONS, PERMISSION_LABELS } from '../../../constants/user-list.constant';
import { ModalComponent } from '../../../../../shared/components/modal/modal.component';

export interface PermissionTableRow {
  feature: string;
  adminCheck?: boolean;
  adminText?: string;
  adminNote?: string;
  memberCheck?: boolean;
  memberText?: string;
  memberNote?: string;
}

@Component({
  selector: 'app-permission-change-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './permission-change-modal.component.html',
  styleUrl: './permission-change-modal.component.scss'
})
export class PermissionChangeModalComponent {
  @Input() isOpen: boolean = false;
  @Input() modalType: 'select' | 'complete' = 'select';
  @Input() userName: string = '';
  @Input() currentPermission: UserPermission | null = null;
  @Input() selectedPermission: UserPermission | null = null;
  @Input() isSaving: boolean = false;

  @Output() close = new EventEmitter<void>();
  @Output() selectPermission = new EventEmitter<UserPermission>();
  @Output() confirm = new EventEmitter<void>();

  permissionOptions: PermissionOption[] = PERMISSION_OPTIONS;

  // Permission comparison table data (matches Figma design)
  permissionTableData: PermissionTableRow[] = [
    {
      feature: 'アカウント・組織',
      adminText: '組織設定の変更/メンバー招待・権限変更/退会',
      memberText: '自分のプロフィール変更'
    },
    {
      feature: 'プロジェクト計画書作成（AI）',
      adminCheck: true,
      memberCheck: true
    },
    {
      feature: 'ベンダー選定',
      adminCheck: true,
      adminNote: '（選定/送信先確定）'
    },
    {
      feature: 'RFP送信（メール/チャット）',
      adminCheck: true
    },
    {
      feature: 'チャット（発注者↔︎ベンダー）',
      adminCheck: true,
      adminNote: '(送受信/クローズ)',
      memberCheck: true,
      memberNote: '(招待時)'
    },
    {
      feature: 'アーカイブ',
      adminCheck: true,
      memberCheck: true
    },
    {
      feature: '決済/請求',
      adminCheck: true,
      adminNote: '(Stripe手続)'
    }
  ];

  getPermissionLabel(permission: UserPermission | null): string {
    if (!permission) return '';
    return PERMISSION_LABELS[permission] || permission;
  }

  onClose(): void {
    this.close.emit();
  }

  onSelectPermission(permission: UserPermission): void {
    this.selectPermission.emit(permission);
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
