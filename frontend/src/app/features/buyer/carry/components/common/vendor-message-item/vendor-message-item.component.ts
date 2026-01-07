import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorContact } from '../../../models/carry.model';

@Component({
  selector: 'app-vendor-message-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-message-item.component.html',
  styleUrl: './vendor-message-item.component.scss'
})
export class VendorMessageItemComponent {
  @Input({ required: true }) vendor!: VendorContact;
  @Input() isSelected = false;

  @Output() selected = new EventEmitter<VendorContact>();

  onSelect(): void {
    this.selected.emit(this.vendor);
  }
}
