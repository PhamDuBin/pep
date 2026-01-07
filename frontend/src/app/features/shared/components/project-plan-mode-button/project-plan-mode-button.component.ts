import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-plan-mode-button',
  standalone: true,
  templateUrl: './project-plan-mode-button.component.html',
  styleUrl: './project-plan-mode-button.component.scss'
})
export class ProjectPlanModeButtonComponent {
  constructor(private router: Router) {}

  onClick(): void {
    this.router.navigate(['/buyer/project-plan']);
  }
}
