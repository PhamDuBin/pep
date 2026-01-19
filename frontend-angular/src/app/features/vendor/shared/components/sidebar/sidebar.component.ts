import { Component, inject, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VendorHomeService } from '../../../home/services/vendor-home.service';
import { MOCK_CURRENT_USER } from '../../../home/constants/messages.constant';
import { SidebarService } from '../../services/sidebar.service';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
    private vendorHomeService = inject(VendorHomeService);
    private router = inject(Router);
    private sidebarService = inject(SidebarService);

    companies = this.vendorHomeService.getCompanies();
    currentUser = MOCK_CURRENT_USER;
    isCollapsed = this.sidebarService.isCollapsed;

    @HostBinding('class.collapsed')
    get collapsed() {
        return this.isCollapsed();
    }

    toggleSidebar() {
        this.sidebarService.toggleSidebar();
    }

    selectCompany(companyId: string) {
        this.vendorHomeService.selectCompany(companyId);
        this.router.navigate(['/vendor']);
    }

    navigateToMyPage() {
        this.router.navigate(['/vendor/my-page']);
    }

    navigateToUserList() {
        this.router.navigate(['/vendor/user-list']);
    }
}
