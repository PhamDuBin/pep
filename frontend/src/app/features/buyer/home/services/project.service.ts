import { Injectable, signal } from '@angular/core';
import { Project } from '../models/project.model';
import { INITIAL_PROJECTS } from '../constants/projects.constant';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectsSignal = signal<Project[]>(INITIAL_PROJECTS);

  // Expose as readonly signal
  projects = this.projectsSignal.asReadonly();

  selectProject(projectId: string): void {
    this.projectsSignal.update(projects =>
      projects.map(p => ({
        ...p,
        isSelected: p.id === projectId
      }))
    );
  }

  getSelectedProject(): Project | undefined {
    return this.projectsSignal().find(p => p.isSelected);
  }

  addProject(project: Omit<Project, 'id'>): void {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      isSelected: false
    };
    this.projectsSignal.update(projects => [...projects, newProject]);
  }

  deleteProject(projectId: string): void {
    this.projectsSignal.update(projects =>
      projects.filter(p => p.id !== projectId)
    );
  }
}
