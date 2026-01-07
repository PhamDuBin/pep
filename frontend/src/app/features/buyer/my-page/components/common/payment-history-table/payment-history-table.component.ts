import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentHistoryRecord } from '../../../models/my-page.model';

@Component({
  selector: 'app-payment-history-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history-table.component.html',
  styleUrl: './payment-history-table.component.scss'
})
export class PaymentHistoryTableComponent {
  @Input() records: PaymentHistoryRecord[] = [];
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() downloadInvoice = new EventEmitter<string>();

  get pageNumbers(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

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

  onFirstPage(): void {
    this.pageChange.emit(1);
  }

  onLastPage(): void {
    this.pageChange.emit(this.totalPages);
  }
}
