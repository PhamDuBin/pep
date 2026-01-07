import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuItem, ContextMenuAction } from '../../../models/archive.model';
import { CONTEXT_MENU_ITEMS } from '../../../constants/archive.constant';

@Component({
  selector: 'app-archive-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive-context-menu.component.html',
  styleUrl: './archive-context-menu.component.scss'
})
export class ArchiveContextMenuComponent {
  @Input() isOpen = false;
  @Output() actionSelect = new EventEmitter<ContextMenuAction>();
  @Output() close = new EventEmitter<void>();

  menuItems: ContextMenuItem[] = CONTEXT_MENU_ITEMS;

  onItemClick(action: ContextMenuAction, event: Event): void {
    event.stopPropagation();
    this.actionSelect.emit(action);
  }

  onBackdropClick(): void {
    this.close.emit();
  }
}
