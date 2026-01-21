import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryRecord } from '../../../models/my-page.model';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-payment-history-table',
  standalone: true,
  imports: [CommonModule, PaginationComponent],
  templateUrl: './payment-history-table.component.html',
  styleUrl: './payment-history-table.component.scss'
})
export class PaymentHistoryTableComponent {
  @Input() records: PaymentHistoryRecord[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() downloadInvoice = new EventEmitter<string>();

  formatAmount(amount: number): string {
    return `${amount.toLocaleString('ja-JP')}円`;
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'paid':
        return '支払い済み';
      case 'pending':
        return '支払い待ち';
      case 'failed':
        return '支払い失敗';
      default:
        return status;
    }
  }

  onPageChange(page: number): void {
    this.pageChange.emit(page);
  }

  onDownload(recordId: string): void {
    this.downloadInvoice.emit(recordId);
  }
}
