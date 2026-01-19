import { Component, EventEmitter, Output, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendorHomeService } from '../../../services/vendor-home.service';

@Component({
    selector: 'app-message-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent {
    private vendorHomeService = inject(VendorHomeService);

    @Output() messageSelected = new EventEmitter<string>();

    selectedCompanyId = this.vendorHomeService.getSelectedCompanyId();
    searchQuery = signal<string>('');

    // Get all messages by company
    allMessages = computed(() => {
        const companyId = this.selectedCompanyId();
        if (!companyId) return [];
        return this.vendorHomeService.getMessagesByCompany(companyId);
    });

    // Filter messages by search query
    messages = computed(() => {
        const query = this.searchQuery().toLowerCase().trim();
        const allMsgs = this.allMessages();

        if (!query) return allMsgs;

        return allMsgs.filter(message =>
            message.companyName.toLowerCase().includes(query) ||
            message.preview.toLowerCase().includes(query)
        );
    });

    onSearchChange(query: string) {
        this.searchQuery.set(query);
    }

    selectMessage(messageId: string) {
        this.vendorHomeService.selectMessage(messageId);
        this.messageSelected.emit(messageId);
    }
}
