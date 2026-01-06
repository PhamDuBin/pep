import { Component, computed } from '@angular/core';
import { ModeService } from '../../../services/mode.service';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  templateUrl: './mode-selector.component.html',
  styleUrl: './mode-selector.component.scss'
})
export class ModeSelectorComponent {
  currentMode = computed(() => this.modeService.currentMode());

  constructor(private modeService: ModeService) {}
}
