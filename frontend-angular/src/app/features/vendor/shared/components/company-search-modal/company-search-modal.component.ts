import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Company {
    id: string;
    name: string;
}

@Component({
    selector: 'app-company-search-modal',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        @if (isOpen()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" (click)="onBackdropClick($event)">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-[500px] mx-4" (click)="$event.stopPropagation()">
                    <!-- Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h2 class="text-lg font-semibold text-gray-900">会社検索</h2>
                        <button 
                            (click)="close.emit()"
                            class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Search Input -->
                    <div class="px-6 py-4">
                        <div class="relative">
                            <input
                                type="text"
                                [(ngModel)]="searchQuery"
                                (ngModelChange)="onSearchChange()"
                                placeholder="会社名を入力してください"
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                autofocus
                            />
                            <svg class="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                    </div>

                    <!-- Results List -->
                    <div class="px-6 pb-6 max-h-[400px] overflow-y-auto">
                        @if (filteredCompanies().length === 0) {
                            <div class="text-center py-8 text-gray-500">
                                @if (searchQuery.trim()) {
                                    <p>該当する会社が見つかりませんでした</p>
                                } @else {
                                    <p>会社名を入力して検索してください</p>
                                }
                            </div>
                        } @else {
                            <div class="space-y-2">
                                @for (company of filteredCompanies(); track company.id) {
                                    <div
                                        (click)="selectCompany(company)"
                                        class="px-4 py-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                                        <p class="text-sm font-medium text-gray-900">{{ company.name }}</p>
                                    </div>
                                }
                            </div>
                        }
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
export class CompanySearchModalComponent {
    @Input() isOpen = signal(false);
    @Input() companies: Company[] = [];
    @Output() close = new EventEmitter<void>();
    @Output() companySelected = new EventEmitter<Company>();

    searchQuery = '';
    filteredCompanies = signal<Company[]>([]);

    onSearchChange() {
        const query = this.searchQuery.trim().toLowerCase();
        if (!query) {
            this.filteredCompanies.set([]);
            return;
        }

        const filtered = this.companies.filter(company =>
            company.name.toLowerCase().includes(query)
        );
        this.filteredCompanies.set(filtered);
    }

    selectCompany(company: Company) {
        this.companySelected.emit(company);
        this.searchQuery = '';
        this.filteredCompanies.set([]);
        this.close.emit();
    }

    onBackdropClick(event: MouseEvent) {
        this.close.emit();
    }
}
