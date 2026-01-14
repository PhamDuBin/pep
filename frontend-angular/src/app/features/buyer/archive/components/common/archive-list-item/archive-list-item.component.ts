import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveProject } from '../../../models/archive.model';

@Component({
  selector: 'app-archive-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive-list-item.component.html',
  styleUrl: './archive-list-item.component.scss'
})
export class ArchiveListItemComponent {
  @Input() project!: ArchiveProject;
  @Input() showContextMenu = false;
  @Output() menuClick = new EventEmitter<string>();

  onMenuClick(event: Event): void {
    event.stopPropagation();
    this.menuClick.emit(this.project.id);
  }
}
