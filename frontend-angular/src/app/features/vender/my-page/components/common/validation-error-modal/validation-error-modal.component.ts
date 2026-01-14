import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-validation-error-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (isOpen()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" (click)="close.emit()">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-[400px] mx-4" (click)="$event.stopPropagation()">
                    <!-- Content -->
                    <div class="flex flex-col items-center px-6 py-8 gap-6">
                        <p class="text-center font-noto text-[16px] leading-[22px] text-[#333333]">
                            {{ errorMessage() }}
                        </p>
                        
                        <!-- OK Button -->
                        <button 
                            (click)="close.emit()"
                            class="w-[100px] h-[39px] bg-primary hover:bg-primary/90 text-white rounded-[8px] font-noto text-[14px] leading-[19px] transition-colors">
                            OK
                        </button>
                    </div>
                </div>
            </div>
        }
    `,
    styles: [`
        :host {
            display: contents;
        }
    `]
})
export class ValidationErrorModalComponent {
    @Input() isOpen = signal(false);
    @Input() errorMessage = signal('');
    @Output() close = new EventEmitter<void>();
}
