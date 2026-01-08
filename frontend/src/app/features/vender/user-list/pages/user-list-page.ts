import { Component, inject } from "@angular/core";
import { UserListComponent } from "../components/user-list/user-list.component";
import { SidebarService } from "../../shared/services/sidebar.service";

@Component({
    selector: 'app-user-list-page',
    standalone: true,
    imports: [UserListComponent],
    template: `
        <div class="flex h-full bg-white overflow-hidden transition-all duration-300"
            [class.ml-[172px]]="!isSidebarCollapsed()"
            [class.ml-[60px]]="isSidebarCollapsed()"
            [style.width]="isSidebarCollapsed() ? 'calc(100vw - 60px)' : 'calc(100vw - 172px)'"
            style="padding-top: 89px;">
            <app-user-list></app-user-list>
        </div>
    `
})
export class UserListPageComponent {
    private sidebarService = inject(SidebarService);

    isSidebarCollapsed = this.sidebarService.isCollapsed;
}