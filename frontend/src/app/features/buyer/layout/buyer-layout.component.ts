import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SideMenuComponent } from '../../shared/components/side-menu/side-menu.component';
import { SideMenuService } from '../../shared/services/side-menu.service';

@Component({
  selector: 'app-buyer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SideMenuComponent],
  templateUrl: './buyer-layout.component.html',
  styleUrl: './buyer-layout.component.scss'
})
export class BuyerLayoutComponent {
  isMenuCollapsed = computed(() => this.sideMenuService.isCollapsed());

  constructor(private sideMenuService: SideMenuService) {}
}
