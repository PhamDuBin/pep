import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageListComponent } from '../common/message-list/message-list.component';
import { MessageDetailComponent } from '../common/message-detail/message-detail.component';
import { VendorHomeService } from '../../services/vendor-home.service';
import { SidebarService } from '../../../shared/services/sidebar.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, MessageListComponent, MessageDetailComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private vendorHomeService = inject(VendorHomeService);
    private sidebarService = inject(SidebarService);

    isSidebarCollapsed = this.sidebarService.isCollapsed;
    selectedMessageId = this.vendorHomeService.getSelectedMessageId();

    onMessageSelected(messageId: string) {
        this.vendorHomeService.selectMessage(messageId);
    }
}
