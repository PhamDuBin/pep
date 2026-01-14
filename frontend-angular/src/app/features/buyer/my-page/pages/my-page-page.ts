import { Component } from '@angular/core';
import { MyPageComponent } from '../components/my-page/my-page.component';

@Component({
  selector: 'app-my-page-page',
  standalone: true,
  imports: [MyPageComponent],
  template: '<app-my-page></app-my-page>'
})
export class MyPagePageComponent {}
