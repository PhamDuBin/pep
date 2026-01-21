import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private _isCollapsed = signal(false);

  isCollapsed = this._isCollapsed.asReadonly();

  toggle(): void {
    this._isCollapsed.update(value => !value);
  }

  expand(): void {
    this._isCollapsed.set(false);
  }

  collapse(): void {
    this._isCollapsed.set(true);
  }
}
