import { Component } from '@angular/core';
import { ProjectPlanComponent } from '../components/project-plan/project-plan.component';

@Component({
  selector: 'app-project-plan-page',
  standalone: true,
  imports: [ProjectPlanComponent],
  template: '<app-project-plan></app-project-plan>'
})
export class ProjectPlanPageComponent {}
