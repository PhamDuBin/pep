import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectFilterOption, SortOption, SortOrder } from '../../../models/archive.model';

@Component({
  selector: 'app-archive-filter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './archive-filter.component.html',
  styleUrl: './archive-filter.component.scss'
})
export class ArchiveFilterComponent {
  @Input() filterOptions: ProjectFilterOption[] = [];
  @Input() sortOptions: SortOption[] = [];
  @Input() selectedFilterLabel = '';
  @Input() showFilterDropdown = false;
  @Input() showSortDropdown = false;

  @Output() toggleFilter = new EventEmitter<void>();
  @Output() toggleSort = new EventEmitter<void>();
  @Output() filterSelect = new EventEmitter<string>();
  @Output() sortSelect = new EventEmitter<SortOrder>();

  onToggleFilter(event: Event): void {
    event.stopPropagation();
    this.toggleFilter.emit();
  }

  onToggleSort(event: Event): void {
    event.stopPropagation();
    this.toggleSort.emit();
  }

  onFilterSelect(filterId: string, event: Event): void {
    event.stopPropagation();
    this.filterSelect.emit(filterId);
  }

  onSortSelect(order: SortOrder, event: Event): void {
    event.stopPropagation();
    this.sortSelect.emit(order);
  }
}
