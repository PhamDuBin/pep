import { Component } from '@angular/core';
import { ArchiveComponent } from '../components/archive/archive.component';

@Component({
  selector: 'app-archive-page',
  standalone: true,
  imports: [ArchiveComponent],
  template: '<app-archive></app-archive>'
})
export class ArchivePageComponent {}
