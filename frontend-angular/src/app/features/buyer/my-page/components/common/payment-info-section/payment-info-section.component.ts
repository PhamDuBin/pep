import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentInfo } from '../../../models/my-page.model';

@Component({
  selector: 'app-payment-info-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-info-section.component.html',
  styleUrl: './payment-info-section.component.scss'
})
export class PaymentInfoSectionComponent {
  @Input() paymentInfo: PaymentInfo | null = null;

  @Output() addPaymentMethod = new EventEmitter<void>();

  get formattedAmount(): string {
    if (!this.paymentInfo) return '';
    const amount = this.paymentInfo.billingAmount.toLocaleString('ja-JP');
    return this.paymentInfo.taxIncluded ? `${amount}円（税込）` : `${amount}円`;
  }

  get paymentMethodDisplay(): string {
    if (!this.paymentInfo?.paymentMethod) return '';
    const method = this.paymentInfo.paymentMethod;
    const typeLabel = method.type.charAt(0).toUpperCase() + method.type.slice(1);
    return `${typeLabel}  **** **** ${method.lastFourDigits}`;
  }

  onAddPaymentMethod(): void {
    this.addPaymentMethod.emit();
  }
}
