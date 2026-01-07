import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MessageListComponent } from '../message-list/message-list.component';
import { MessageDetailComponent } from '../message-detail/message-detail.component';
import { VendorHomeService } from '../../services/vendor-home.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, SidebarComponent, MessageListComponent, MessageDetailComponent],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    private vendorHomeService = inject(VendorHomeService);

    selectedMessageId = this.vendorHomeService.getSelectedMessageId();

    onMessageSelected(messageId: string) {
        this.vendorHomeService.selectMessage(messageId);
    }
}
