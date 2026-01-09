import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SidebarComponent } from '../shared/components/sidebar/sidebar.component';

@Component({
    selector: 'app-vender-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
    templateUrl: './vender-layout.component.html',
    styleUrl: './vender-layout.component.scss'
})
export class VenderLayoutComponent { }
