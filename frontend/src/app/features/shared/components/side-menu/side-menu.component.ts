import { Component, EventEmitter, Output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../../buyer/home/services/project.service';
import { Project } from '../../../buyer/home/models/project.model';

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

  constructor(private projectService: ProjectService) {}

  selectProject(project: Project) {
    this.projectService.selectProject(project.id);
    this.projectSelected.emit(project);
  }
}
