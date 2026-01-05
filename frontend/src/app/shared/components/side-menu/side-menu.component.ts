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
  template: `
    <aside class="fixed left-0 top-[89px] bottom-0 w-[197px] bg-white flex flex-col justify-between items-start py-[15px] px-[10px] pb-[25px] z-40"
           style="box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);">
      <!-- Top Section (Frame 14) -->
      <div class="flex flex-col items-start gap-[25px] w-[177px] h-[434px] self-stretch">
        <!-- Menu Toggle -->
        <div class="px-[10px]">
          <button class="hover:opacity-70 transition-opacity">
            <svg width="20" height="13" viewBox="0 0 20 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0.5H20M0 6.5H20M0 12.5H20" stroke="#333333" stroke-width="1.5"/>
            </svg>
          </button>
        </div>

        <!-- New Project Button -->
        <div class="flex flex-col gap-[3px]">
          <button class="flex flex-row items-center px-[10px] py-[3px] gap-[7px] w-[177px] h-[26px] rounded cursor-pointer hover:bg-primary-light transition-colors">
            <div class="w-5 h-5 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 1V9M1 5H9" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span class="text-[13px] text-text-dark whitespace-nowrap">新規プロジェクト作成</span>
          </button>
        </div>

        <!-- Separator Line -->
        <div class="w-full h-[1px] bg-gray-200"></div>

        <!-- RFP Section -->
        <div class="flex flex-col gap-[3px]">
          <div class="px-[10px]">
            <span class="text-[14px] text-text-gray">RFP</span>
          </div>
          <div class="flex items-center gap-[7px] px-[10px] py-[7px] cursor-pointer hover:bg-gray-50 rounded transition-colors">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 8.09091H21M19.2143 19H2.78571C2.31211 19 1.85791 18.8084 1.52302 18.4675C1.18814 18.1265 1 17.664 1 17.1818V4.81818C1 4.33597 1.18814 3.87351 1.52302 3.53253C1.85791 3.19156 2.31211 3 2.78571 3H6.17366C6.52624 3.00001 6.87094 3.10629 7.16429 3.30545L8.40714 4.14909C8.70049 4.34825 9.04518 4.45454 9.39777 4.45455H19.2143C19.6879 4.45455 20.1421 4.6461 20.477 4.98708C20.8119 5.32805 21 5.79052 21 6.27273V17.1818C21 17.664 20.8119 18.1265 20.477 18.4675C20.1421 18.8084 19.6879 19 19.2143 19Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-[13px] text-text-dark">アーカイブ</span>
          </div>
        </div>

        <!-- PROJECT Section -->
        <div class="flex flex-col gap-[5px]">
          <div class="px-[10px]">
            <span class="text-[14px] text-text-gray">PROJECT</span>
          </div>
          
          <!-- Search -->
          <div class="flex items-center gap-[7px] px-[10px] py-[7px] cursor-pointer hover:bg-gray-50 rounded transition-colors">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="9" r="6" stroke="#333333" stroke-width="1.5"/>
              <path d="M13.5 13.5L18 18" stroke="#333333" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span class="text-[13px] text-text-dark">プロジェクト検索</span>
          </div>

          <!-- Project List -->
          <div class="flex flex-col gap-[5px]">
            @for (project of projects; track project.id) {
              <div 
                class="flex items-center gap-[3px] px-[10px] py-[5px] rounded cursor-pointer transition-colors group"
                [class.bg-primary-light]="project.isSelected"
                [class.hover:bg-gray-50]="!project.isSelected"
                (click)="selectProject(project)"
              >
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                  <path d="M1 6.681V1.4219C1 1.19371 1 1.07998 1.07261 1.02599C1.14521 0.972007 1.24993 1.008 1.45938 1.07998L8.38424 3.46047C8.79475 3.60156 9 3.6721 9 3.80167C9 3.93124 8.79475 4.00178 8.38424 4.14287L1 6.681ZM1 6.681V11" 
                    [attr.stroke]="project.isSelected ? '#066A9E' : '#333333'" 
                    stroke-linecap="round"/>
                </svg>
                <span 
                  class="text-[14px] flex-1 truncate"
                  [class.text-primary]="project.isSelected"
                  [class.text-text-dark]="!project.isSelected"
                >{{ project.name }}</span>
                @if (project.isSelected) {
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <circle cx="4" cy="8" r="1.5" fill="#066A9E"/>
                    <circle cx="8" cy="8" r="1.5" fill="#066A9E"/>
                    <circle cx="12" cy="8" r="1.5" fill="#066A9E"/>
                  </svg>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Bottom Section (Frame 15) -->
      <div class="flex flex-col justify-center items-start gap-[5px] w-[177px] h-[77px] self-stretch">
        <!-- User List -->
        <div class="flex items-center gap-[7px] px-[10px] py-[7px] cursor-pointer hover:bg-gray-50 rounded transition-colors">
          <svg width="29" height="16" viewBox="0 0 29 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="5" r="4" stroke="#333333" stroke-width="1"/>
            <path d="M1 15C1 12 4 10 8 10C12 10 15 12 15 15" stroke="#333333" stroke-width="1"/>
            <circle cx="20" cy="5" r="4" stroke="#333333" stroke-width="1"/>
            <path d="M13 15C13 12 16 10 20 10C24 10 27 12 27 15" stroke="#333333" stroke-width="1"/>
          </svg>
          <span class="text-[13px] text-text-dark">ユーザ一覧</span>
        </div>

        <!-- User Profile -->
        <div class="flex items-center gap-[7px] px-[10px] py-[5px]">
          <div class="w-[30px] h-[30px] bg-avatar-bg rounded-full flex items-center justify-center">
            <span class="text-[13px] text-white">TY</span>
          </div>
          <span class="text-[13px] text-text-dark">山田 太郎</span>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
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
