import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
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
  @Output() exitClicked = new EventEmitter<VendorContact>();

  isHovered = false;
  showMenu = false;

  onSelect(): void {
    if (!this.showMenu) {
      this.selected.emit(this.vendor);
    }
  }

  onMouseEnter(): void {
    this.isHovered = true;
  }

  onMouseLeave(): void {
    this.isHovered = false;
    if (!this.showMenu) {
      this.showMenu = false;
    }
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  onExitClick(event: MouseEvent): void {
    event.stopPropagation();
    this.showMenu = false;
    this.exitClicked.emit(this.vendor);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menuContainer = target.closest('.menu-container');
    if (!menuContainer && this.showMenu) {
      this.showMenu = false;
    }
  }
}
