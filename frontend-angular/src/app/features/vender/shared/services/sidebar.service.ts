import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SidebarService {
    private _isCollapsed = signal(false);

    isCollapsed = this._isCollapsed.asReadonly();

    toggleSidebar() {
        this._isCollapsed.set(!this._isCollapsed());
    }
}
