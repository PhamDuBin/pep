import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorHomeService } from '../../services/vendor-home.service';
import { MOCK_CURRENT_USER } from '../../constants/messages.constant';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    private vendorHomeService = inject(VendorHomeService);

    companies = this.vendorHomeService.getCompanies();
    currentUser = MOCK_CURRENT_USER;

    selectCompany(companyId: string) {
        this.vendorHomeService.selectCompany(companyId);
    }
}
