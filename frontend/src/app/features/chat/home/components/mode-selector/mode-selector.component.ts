import { Component } from '@angular/core';

@Component({
  selector: 'app-mode-selector',
  standalone: true,
  template: `
    <button class="flex items-center gap-[5px] px-[15px] py-[10px] bg-white border border-primary rounded-lg hover:bg-primary-light transition-colors cursor-pointer">
      <!-- Flag Icon -->
      <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.375 8.89641V1.00776C0.375 0.665481 0.375 0.494881 0.48391 0.413899C0.59282 0.332918 0.749902 0.386906 1.06407 0.49488L11.4514 4.06561C12.0671 4.27724 12.375 4.38306 12.375 4.57741C12.375 4.77177 12.0671 4.87758 11.4514 5.08921L0.375 8.89641ZM0.375 8.89641V15.3749" stroke="#066A9E" stroke-width="0.75" stroke-linecap="round"/>
      </svg>
      <span class="text-[16px] text-primary">プロジェクト計画書作成モード</span>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class ModeSelectorComponent { }
