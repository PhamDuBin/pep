import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  id: string;
  name: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss'
})
export class SideMenuComponent {
  @Output() projectSelected = new EventEmitter<Project>();

  projects: Project[] = [
    { id: '1', name: 'SNSショート動画...', isSelected: true },
    { id: '2', name: 'Z世代向けインフルエ...', isSelected: false },
    { id: '3', name: 'ドーナツPRイベント...', isSelected: false },
    { id: '4', name: 'ライブコマース運営...', isSelected: false },
    { id: '5', name: 'ブランド体験型ポッ...', isSelected: false },
    { id: '6', name: 'AIタレント・バーチ...', isSelected: false },
  ];

  selectProject(project: Project) {
    this.projects = this.projects.map(p => ({
      ...p,
      isSelected: p.id === project.id
    }));
    this.projectSelected.emit(project);
  }
}
