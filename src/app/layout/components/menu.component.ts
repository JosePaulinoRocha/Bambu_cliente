import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { UserAvatarComponent } from './user-avatar.component';
import { Router } from '@angular/router';
import { ToolsBarComponent } from './tools-bar.component';
import { TicketsService } from '../../services/tickets.service';
import { AuthService } from 'src/app/services/auth.service';

interface MenuItem {
    title: string;
    url: string;
    icon: string;
    badge?: string;
    badgeColor?: string;
    children?: MenuItem[];
    hierarchies?: number[];
}

@Component({
    selector: 'app-menu',
    template: `
        <div class="menu-header">
            <app-user-avatar [isCollapsed]="isCollapsed"></app-user-avatar>
            <app-tools-bar *ngIf="!isCollapsed"></app-tools-bar>
        </div>
        <ion-list *ngIf="!isCollapsed">
            @for (p of appPages; track p; let i = $index) {
                <ion-menu-toggle auto-hide="false">
                    <ion-item 
                        routerDirection="root" 
                        [routerLink]="[p.url]" 
                        lines="none" 
                        detail="false" 
                        routerLinkActive="selected">
                        <ion-icon aria-hidden="true" slot="start" [ios]="p.icon + '-outline'" [md]="p.icon + '-sharp'"></ion-icon>
                        <ion-label>{{ p.title }}</ion-label>
                        <ion-badge class="breath" *ngIf="p.badge" [color]="p.badgeColor || 'primary'" slot="end">{{ p.badge }}</ion-badge>
                    </ion-item>
                    
                    @if (p.children) {
                        @for (child of p.children; track child) {
                            <ion-item 
                                routerDirection="root" 
                                [routerLink]="[child.url]" 
                                lines="none" 
                                detail="false" 
                                routerLinkActive="selected" 
                                class="submenu-item">
                                <ion-icon aria-hidden="true" slot="start" [ios]="child.icon + '-outline'" [md]="child.icon + '-sharp'"></ion-icon>
                                <ion-label>{{ child.title }}</ion-label>
                                <ion-badge class="breath" *ngIf="child.badge" [color]="child.badgeColor || 'primary'" slot="end">{{ child.badge }}</ion-badge>
                            </ion-item>
                        }
                    }
                </ion-menu-toggle>
            }
        </ion-list>

        <!-- Logout para menú normal -->
        <ion-item button lines="none" (click)="logout()" *ngIf="!isCollapsed">
            <ion-icon color="danger" slot="start" name="log-out-outline"></ion-icon>
            <ion-label color="danger">Cerrar sesión</ion-label>
        </ion-item>

        <!-- Menú colapsado con solo iconos -->
        <div class="collapsed-menu-items" *ngIf="isCollapsed">
            <ng-container *ngFor="let p of appPages; track p">
                <ion-button 
                    fill="clear" 
                    size="small"
                    [routerLink]="[p.url]"
                    routerLinkActive="active-collapsed"
                    class="collapsed-menu-btn">
                    <ion-icon [name]="p.icon + '-outline'" slot="icon-only"></ion-icon>
                </ion-button>
            </ng-container>
            
            <!-- Logout colapsado -->
            <ion-button 
                fill="clear" 
                size="small"
                (click)="logout()"
                class="collapsed-menu-btn logout-btn">
                <ion-icon name="log-out-outline" slot="icon-only"></ion-icon>
            </ion-button>
        </div>
    `,
    styles: [`
        .menu-header {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 16px;
        }

        ion-list {
            padding: 8px;
        }

        ion-item {
            --padding-start: 16px;
            --padding-end: 16px;
            --min-height: 48px;
            margin: 4px 0;
            border-radius: 12px;
            --background-hover: var(--ion-color-light);
            transition: all 0.2s ease;
        }

        .submenu-item {
            --padding-start: 32px;
            font-size: 0.9em;
        }

        ion-item:hover {
            transform: translateX(4px);
        }

        ion-item.selected {
            --background: var(--ion-color-primary);
            --color: white;
            font-weight: 500;
        }

        ion-icon {
            font-size: 1.2rem;
            margin-right: 8px;
            color: var(--ion-color-medium);
        }

        ion-item.selected ion-icon {
            color: white;
        }

        ion-badge.breath {
            animation: breathing 2s ease-in-out infinite;
        }

        @keyframes breathing {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.2); opacity: 1; }
        }

        .collapsed-menu-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 8px 4px;
            align-items: center;
            height: 100%;
            background: transparent;
        }

        .collapsed-menu-btn {
            --color: var(--ion-color-medium);
            --background: transparent;
            width: 40px;
            height: 40px;
            border-radius: 8px;
            transition: all 0.2s ease;
            opacity: 1;
        }

        .collapsed-menu-btn:hover {
            --background: var(--ion-color-light);
            --color: var(--ion-color-primary);
        }

        .collapsed-menu-btn.active-collapsed {
            --background: var(--ion-color-primary);
            --color: white;
        }

        .logout-btn {
            --color: var(--ion-color-danger);
            margin-top: auto;
        }

        .logout-btn:hover {
            --background: var(--ion-color-danger-tint);
        }
    `],
    standalone: true,
    imports: [
        IonicModule,
        RouterModule,
        CommonModule,
        UserAvatarComponent,
        ToolsBarComponent,
    ]
})
export class MenuComponent implements OnInit {
    @Input() isCollapsed = false;
    @Output() collapseChange = new EventEmitter<boolean>();
    public appPages: MenuItem[] = [
        { title: 'Inicio', url: '/app/home', icon: 'home' },
        { title: 'Gestor de tareas', url: '/app/problems', icon: 'alert-circle' },
        { title: 'Usuarios', url: '/app/users', icon: 'people' },
    ];

    constructor(private router: Router, private ticketsService: TicketsService, private authService: AuthService) { }

    ngOnInit(): void {
        
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.collapseChange.emit(this.isCollapsed);
    }

    logout() {
        this.authService.clearSession();
        this.router.navigate(['/login']);
    }
}
