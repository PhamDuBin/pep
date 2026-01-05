import { Injectable, signal } from '@angular/core';
import { Mode } from '../models/mode.model';
import { PLANNING_MODE } from '../constants/modes.constant';

@Injectable({
  providedIn: 'root'
})
export class ModeService {
  private currentModeSignal = signal<Mode>(PLANNING_MODE);

  // Expose as readonly signal
  currentMode = this.currentModeSignal.asReadonly();

  setMode(mode: Mode): void {
    this.currentModeSignal.set(mode);
  }

  getCurrentMode(): Mode {
    return this.currentModeSignal();
  }
}
