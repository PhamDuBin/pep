import { Component } from '@angular/core';
import { CarryComponent } from '../components/carry/carry.component';

@Component({
  selector: 'app-carry-page',
  standalone: true,
  imports: [CarryComponent],
  template: '<app-carry></app-carry>'
})
export class CarryPageComponent {}
