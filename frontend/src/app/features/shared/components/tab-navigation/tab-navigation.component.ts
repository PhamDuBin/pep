import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Tab {
    id: string;
    label: string;
    subLabel: string;
    icon: 'kick' | 'carry';
    isActive: boolean;
    isDisabled: boolean;
}

@Component({
    selector: 'app-tab-navigation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tab-navigation.component.html',
    styleUrl: './tab-navigation.component.scss'
})
export class TabNavigationComponent {
    @Input() tabs: Tab[] = [];
    @Output() tabChange = new EventEmitter<Tab>();

    private hoveredTabId: string | null = null;

    isHovered(tabId: string): boolean {
        return this.hoveredTabId === tabId;
    }

    selectTab(tab: Tab) {
        if (tab.isDisabled) return;

        this.tabs = this.tabs.map(t => ({
            ...t,
            isActive: t.id === tab.id
        }));
        this.tabChange.emit(tab);
    }
}
