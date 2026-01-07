import { Component, computed, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ArchiveCardComponent } from '../common/archive-card/archive-card.component';
import { ArchiveListItemComponent } from '../common/archive-list-item/archive-list-item.component';
import { ArchiveFilterComponent } from '../common/archive-filter/archive-filter.component';
import { ArchiveContextMenuComponent } from '../common/archive-context-menu/archive-context-menu.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ArchiveService } from '../../services/archive.service';
import { ArchiveProject, SortOrder, ContextMenuAction } from '../../models/archive.model';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    ArchiveCardComponent,
    ArchiveListItemComponent,
    ArchiveFilterComponent,
    ArchiveContextMenuComponent,
    PaginationComponent
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit, OnDestroy {
  // Computed signals from service
  projects = computed(() => this.archiveService.projects());
  filterOptions = computed(() => this.archiveService.filterOptions());
  sortOptions = computed(() => this.archiveService.sortOptions());
  selectedFilterLabel = computed(() => this.archiveService.selectedFilterLabel());
  viewMode = computed(() => this.archiveService.viewMode());
  currentPage = computed(() => this.archiveService.currentPage());
  totalPages = computed(() => this.archiveService.totalPages());
  isLoading = computed(() => this.archiveService.isLoading());
  activeContextMenuId = computed(() => this.archiveService.activeContextMenuId());
  showFilterDropdown = computed(() => this.archiveService.showFilterDropdown());
  showSortDropdown = computed(() => this.archiveService.showSortDropdown());

  constructor(
    private archiveService: ArchiveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Service loads projects in constructor
  }

  ngOnDestroy(): void {
    this.archiveService.resetState();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close all dropdowns when clicking outside
    this.archiveService.closeAllDropdowns();
  }

  onToggleFilter(): void {
    this.archiveService.toggleFilterDropdown();
  }

  onToggleSort(): void {
    this.archiveService.toggleSortDropdown();
  }

  onFilterSelect(filterId: string): void {
    this.archiveService.setFilter(filterId);
  }

  onSortSelect(order: SortOrder): void {
    this.archiveService.setSortOrder(order);
  }

  onToggleViewMode(): void {
    this.archiveService.toggleViewMode();
  }

  onMenuClick(projectId: string): void {
    this.archiveService.toggleContextMenu(projectId);
  }

  onContextAction(projectId: string, action: ContextMenuAction): void {
    this.archiveService.handleContextAction(projectId, action).subscribe({
      next: (response) => {
        console.log('Action completed:', response);
      },
      error: (error) => {
        console.error('Action failed:', error);
      }
    });
  }

  onCloseContextMenu(): void {
    this.archiveService.closeAllDropdowns();
  }

  onPageChange(page: number): void {
    this.archiveService.goToPage(page);
  }

  isContextMenuOpen(projectId: string): boolean {
    return this.activeContextMenuId() === projectId;
  }
}
