import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-vendor-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
    templateUrl: './vendor-layout.component.html',
    styleUrl: './vendor-layout.component.scss'
})
export class VendorLayoutComponent { }
