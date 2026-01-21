import { Component, OnInit } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-layout',
    template: `
    <ion-app>
      <!-- Layout normal (menú expandido o móvil) -->
      <div *ngIf="!isMenuCollapsed || !isDesktop" class="normal-layout">
        <ion-split-pane contentId="main-content" when="lg">
          <ion-menu contentId="main-content" type="overlay" menuId="first">
            <ion-content class="ion-padding">
              <div class="menu-header-controls" *ngIf="isDesktop">
                <ion-button 
                  fill="clear" 
                  size="small" 
                  (click)="toggleMenu()" 
                  class="collapse-btn">
                  <ion-icon 
                    name="chevron-back-outline" 
                    slot="icon-only">
                  </ion-icon>
                </ion-button>
              </div>
              <app-menu [isCollapsed]="false"></app-menu>
            </ion-content>
          </ion-menu>
          <ion-router-outlet id="main-content"></ion-router-outlet>
        </ion-split-pane>
      </div>
      
      <!-- Layout para menú colapsado en desktop -->
      <div class="collapsed-layout" *ngIf="isMenuCollapsed && isDesktop">
        <!-- Menú colapsado -->
        <div class="collapsed-menu">
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="toggleMenu()" 
            class="expand-btn">
            <ion-icon name="menu-outline" slot="icon-only"></ion-icon>
          </ion-button>
          <app-menu [isCollapsed]="true"></app-menu>
        </div>
        
        <!-- Contenido principal -->
        <div class="main-content-wrapper">
          <ion-router-outlet id="main-content-collapsed"></ion-router-outlet>
        </div>
      </div>
      
      <app-button-menu></app-button-menu>
    </ion-app>
    `,
    styles: [`
      :host {
        display: block;
        height: 100%;
      }

      .normal-layout {
        height: 100vh;
        width: 100%;
      }

      .menu-header-controls {
        display: flex;
        justify-content: flex-end;
        padding: 8px;
        border-bottom: 1px solid var(--ion-color-light);
        margin-bottom: 8px;
      }

      .collapse-btn {
        --color: var(--ion-color-medium);
      }

      .collapsed-layout {
        display: flex;
        height: 100vh;
        width: 100%;
      }

      .collapsed-menu {
        width: 60px;
        background: var(--ion-background-color, #ffffff);
        border-right: 1px solid var(--ion-color-light);
        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        padding: 8px 4px;
        flex-shrink: 0;
        z-index: 100;
      }

      .expand-btn {
        --color: var(--ion-color-primary);
        margin-bottom: 16px;
        align-self: center;
      }

      .main-content-wrapper {
        flex: 1;
        height: 100vh;
        overflow: hidden;
        background: var(--ion-background-color);
      }

      /* Asegurar que el contenido principal ocupe todo el espacio disponible */
      #main-content-collapsed {
        height: 100%;
        width: 100%;
        margin-left: 60px;
      }

      @media (max-width: 991px) {
        .collapsed-layout {
          display: none;
        }
      }
    `],
    standalone: false,
})
export class LayoutComponent implements OnInit {
    public isMenuCollapsed = false;
    public isDesktop = false;

    constructor(private platform: Platform) { }

    async ngOnInit() {
      // Detectar si es desktop usando window.innerWidth
      this.checkIfDesktop();
      
      // Escuchar cambios de tamaño de ventana
      window.addEventListener('resize', () => {
        this.checkIfDesktop();
        // En móvil, siempre expandir el menú
        if (!this.isDesktop) {
          this.isMenuCollapsed = false;
        }
      });

      if (this.platform.is('android')) {
        await StatusBar.setStyle({ style: Style.Dark });
        await StatusBar.setOverlaysWebView({ overlay: true });
      }
    }

    private checkIfDesktop() {
      this.isDesktop = window.innerWidth >= 992;
      // console.log('Is Desktop:', this.isDesktop, 'Width:', window.innerWidth);
    }

    toggleMenu() {
      this.isMenuCollapsed = !this.isMenuCollapsed;
      console.log('Menu collapsed:', this.isMenuCollapsed);
    }
}
