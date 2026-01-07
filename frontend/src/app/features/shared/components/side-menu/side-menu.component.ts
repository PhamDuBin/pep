import { Component, EventEmitter, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProjectService } from '../../../buyer/home/services/project.service';
import { Project } from '../../../buyer/home/models/project.model';
import { SideMenuService } from '../../services/side-menu.service';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @Output() projectSelected = new EventEmitter<Project>();

  projects = computed(() => this.projectService.projects());
  isCollapsed = computed(() => this.sideMenuService.isCollapsed());

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private sideMenuService: SideMenuService
  ) {}

  toggleMenu(): void {
    this.sideMenuService.toggle();
  }

  selectProject(project: Project) {
    this.projectService.selectProject(project.id);
    this.projectSelected.emit(project);
  }

  navigateToNewProject(): void {
    this.router.navigate(['/buyer']);
  }

  navigateToArchive(): void {
    this.router.navigate(['/buyer/archive']);
  }

  isArchiveActive(): boolean {
    return this.router.url.includes('/buyer/archive');
  }

  navigateToMyPage(): void {
    this.router.navigate(['/buyer/my-page']);
  }

  isMyPageActive(): boolean {
    return this.router.url.includes('/buyer/my-page');
  }
}
