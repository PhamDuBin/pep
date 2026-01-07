import { Component, EventEmitter, Output, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorHomeService } from '../../services/vendor-home.service';

@Component({
    selector: 'app-message-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './message-list.component.html',
    styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent {
    private vendorHomeService = inject(VendorHomeService);

    @Output() messageSelected = new EventEmitter<string>();

    selectedCompanyId = this.vendorHomeService.getSelectedCompanyId();

    // Filter messages by selected company
    messages = computed(() => {
        const companyId = this.selectedCompanyId();
        if (!companyId) return [];
        return this.vendorHomeService.getMessagesByCompany(companyId);
    });

    selectMessage(messageId: string) {
        this.vendorHomeService.selectMessage(messageId);
        this.messageSelected.emit(messageId);
    }
}
