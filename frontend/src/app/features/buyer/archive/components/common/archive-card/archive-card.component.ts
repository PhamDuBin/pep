import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveProject } from '../../../models/archive.model';

@Component({
  selector: 'app-archive-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive-card.component.html',
  styleUrl: './archive-card.component.scss'
})
export class ArchiveCardComponent {
  @Input() project!: ArchiveProject;
  @Input() showContextMenu = false;
  @Output() menuClick = new EventEmitter<string>();

  onMenuClick(event: Event): void {
    event.stopPropagation();
    this.menuClick.emit(this.project.id);
  }
}
