import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  ArchiveProject,
  ProjectFilterOption,
  SortOption,
  SortOrder,
  ViewMode,
  ArchiveProjectsResponse,
  ProjectActionResponse,
  ContextMenuAction
} from '../models/archive.model';
import {
  MOCK_ARCHIVE_PROJECTS,
  PROJECT_FILTER_OPTIONS,
  SORT_OPTIONS,
  DEFAULT_PAGE_SIZE
} from '../constants/archive.constant';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {
  // State signals
  private _projects = signal<ArchiveProject[]>([]);
  private _filterOptions = signal<ProjectFilterOption[]>(PROJECT_FILTER_OPTIONS);
  private _sortOptions = signal<SortOption[]>(SORT_OPTIONS);
  private _selectedFilter = signal<string>('all');
  private _selectedSort = signal<SortOrder>('desc');
  private _viewMode = signal<ViewMode>('grid');
  private _currentPage = signal<number>(1);
  private _totalCount = signal<number>(0);
  private _isLoading = signal<boolean>(false);
  private _activeContextMenuId = signal<string | null>(null);
  private _showFilterDropdown = signal<boolean>(false);
  private _showSortDropdown = signal<boolean>(false);

  // Public computed signals
  projects = computed(() => this._projects());
  filterOptions = computed(() => this._filterOptions());
  sortOptions = computed(() => this._sortOptions());
  selectedFilter = computed(() => this._selectedFilter());
  selectedSort = computed(() => this._selectedSort());
  viewMode = computed(() => this._viewMode());
  currentPage = computed(() => this._currentPage());
  totalCount = computed(() => this._totalCount());
  isLoading = computed(() => this._isLoading());
  activeContextMenuId = computed(() => this._activeContextMenuId());
  showFilterDropdown = computed(() => this._showFilterDropdown());
  showSortDropdown = computed(() => this._showSortDropdown());

  // Computed for selected filter label
  selectedFilterLabel = computed(() => {
    const selected = this._filterOptions().find(f => f.id === this._selectedFilter());
    return selected?.name || 'すべてのプロジェクト';
  });

  // Computed for selected sort label
  selectedSortLabel = computed(() => {
    const selected = this._sortOptions().find(s => s.value === this._selectedSort());
    return selected?.label || '作成日';
  });

  // Computed for total pages
  totalPages = computed(() => Math.ceil(this._totalCount() / DEFAULT_PAGE_SIZE));

  constructor() {
    this.loadProjects();
  }

  /**
   * Load projects from API (mock implementation)
   * GET /api/archive/projects
   */
  loadProjects(): void {
    this._isLoading.set(true);

    this.getProjectsApi(
      this._selectedFilter(),
      this._selectedSort(),
      this._currentPage()
    ).subscribe({
      next: (response) => {
        this._projects.set(response.projects);
        this._totalCount.set(response.totalCount);
        this._isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading archive projects:', error);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * Set filter and reload projects
   */
  setFilter(filterId: string): void {
    this._selectedFilter.set(filterId);
    this._filterOptions.update(options =>
      options.map(opt => ({
        ...opt,
        isSelected: opt.id === filterId
      }))
    );
    this._currentPage.set(1);
    this._showFilterDropdown.set(false);
    this.loadProjects();
  }

  /**
   * Set sort order and reload projects
   */
  setSortOrder(order: SortOrder): void {
    this._selectedSort.set(order);
    this._sortOptions.update(options =>
      options.map(opt => ({
        ...opt,
        isSelected: opt.value === order
      }))
    );
    this._showSortDropdown.set(false);
    this.loadProjects();
  }

  /**
   * Toggle view mode between grid and list
   */
  toggleViewMode(): void {
    this._viewMode.update(mode => mode === 'grid' ? 'list' : 'grid');
  }

  /**
   * Set view mode explicitly
   */
  setViewMode(mode: ViewMode): void {
    this._viewMode.set(mode);
  }

  /**
   * Go to specific page
   */
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this._currentPage.set(page);
      this.loadProjects();
    }
  }

  /**
   * Toggle filter dropdown
   */
  toggleFilterDropdown(): void {
    this._showFilterDropdown.update(show => !show);
    this._showSortDropdown.set(false);
    this._activeContextMenuId.set(null);
  }

  /**
   * Toggle sort dropdown
   */
  toggleSortDropdown(): void {
    this._showSortDropdown.update(show => !show);
    this._showFilterDropdown.set(false);
    this._activeContextMenuId.set(null);
  }

  /**
   * Toggle context menu for a project
   */
  toggleContextMenu(projectId: string): void {
    this._activeContextMenuId.update(id => id === projectId ? null : projectId);
    this._showFilterDropdown.set(false);
    this._showSortDropdown.set(false);
  }

  /**
   * Close all dropdowns
   */
  closeAllDropdowns(): void {
    this._showFilterDropdown.set(false);
    this._showSortDropdown.set(false);
    this._activeContextMenuId.set(null);
  }

  /**
   * Handle context menu action
   */
  handleContextAction(projectId: string, action: ContextMenuAction): Observable<ProjectActionResponse> {
    this._activeContextMenuId.set(null);

    switch (action) {
      case 'download':
        return this.downloadProject(projectId);
      case 'rename':
        return this.renameProject(projectId);
      case 'favorite':
        return this.toggleFavorite(projectId);
      case 'delete':
        return this.deleteProject(projectId);
      default:
        return of({ success: false, message: 'Unknown action' });
    }
  }

  /**
   * Download project
   */
  private downloadProject(projectId: string): Observable<ProjectActionResponse> {
    console.log('Downloading project:', projectId);
    return of({ success: true, message: 'Download started' }).pipe(delay(200));
  }

  /**
   * Rename project (placeholder)
   */
  private renameProject(projectId: string): Observable<ProjectActionResponse> {
    console.log('Rename project:', projectId);
    return of({ success: true, message: 'Rename dialog opened' }).pipe(delay(200));
  }

  /**
   * Toggle favorite status
   */
  private toggleFavorite(projectId: string): Observable<ProjectActionResponse> {
    this._projects.update(projects =>
      projects.map(p => {
        if (p.id === projectId) {
          return { ...p, isFavorite: !p.isFavorite };
        }
        return p;
      })
    );
    return of({ success: true, message: 'Favorite toggled' }).pipe(delay(200));
  }

  /**
   * Delete project
   */
  private deleteProject(projectId: string): Observable<ProjectActionResponse> {
    this._projects.update(projects =>
      projects.filter(p => p.id !== projectId)
    );
    this._totalCount.update(count => count - 1);
    return of({ success: true, message: 'Project deleted' }).pipe(delay(200));
  }

  /**
   * Reset state
   */
  resetState(): void {
    this._selectedFilter.set('all');
    this._selectedSort.set('desc');
    this._viewMode.set('grid');
    this._currentPage.set(1);
    this.closeAllDropdowns();
    this.loadProjects();
  }

  // ==========================================
  // Mock API Methods (Replace with real API)
  // ==========================================

  /**
   * Mock: GET /api/archive/projects
   */
  private getProjectsApi(
    filterId: string,
    sortOrder: SortOrder,
    page: number
  ): Observable<ArchiveProjectsResponse> {
    // Filter projects
    let filtered = [...MOCK_ARCHIVE_PROJECTS];

    if (filterId !== 'all') {
      filtered = filtered.filter(p => p.authorId === filterId);
    }

    // Sort projects
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt.replace(/\//g, '-'));
      const dateB = new Date(b.createdAt.replace(/\//g, '-'));
      return sortOrder === 'desc'
        ? dateB.getTime() - dateA.getTime()
        : dateA.getTime() - dateB.getTime();
    });

    // Paginate
    const totalCount = filtered.length;
    const startIndex = (page - 1) * DEFAULT_PAGE_SIZE;
    const paginatedProjects = filtered.slice(startIndex, startIndex + DEFAULT_PAGE_SIZE);

    const response: ArchiveProjectsResponse = {
      projects: paginatedProjects,
      totalCount,
      page,
      pageSize: DEFAULT_PAGE_SIZE
    };

    return of(response).pipe(delay(200));
  }
}
