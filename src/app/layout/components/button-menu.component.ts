import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
    selector: 'app-button-menu',
    template: `
        <ion-fab vertical="top" horizontal="start" slot="fixed" [class.hidden]="!isMobile || isMenuOpen">
            <ion-fab-button (click)="toggleMenu()">
                <ion-icon name="menu"></ion-icon>
            </ion-fab-button>
        </ion-fab>
    `,
    styles: [`
        ion-fab {
            margin: 16px;
        }
        .hidden {
            display: none;
        }
    `],
    standalone: false
})
export class ButtonMenuComponent implements OnInit, OnDestroy {
    isMobile = false;
    isMenuOpen = false;
    private menuOpenHandler = () => this.isMenuOpen = true;
    private menuCloseHandler = () => this.isMenuOpen = false;

    constructor(private menuCtrl: MenuController) {
        this.checkScreenSize();
        window.addEventListener('resize', () => this.checkScreenSize());
    }

    async ngOnInit() {
        const menu = await this.menuCtrl.get('first');
        if (menu) {
            menu.addEventListener('ionWillOpen', this.menuOpenHandler);
            menu.addEventListener('ionWillClose', this.menuCloseHandler);
        }
    }

    ngOnDestroy() {
        window.removeEventListener('resize', () => this.checkScreenSize());
        this.menuCtrl.get('first').then(menu => {
            if (menu) {
                menu.removeEventListener('ionWillOpen', this.menuOpenHandler);
                menu.removeEventListener('ionWillClose', this.menuCloseHandler);
            }
        });
    }

    private checkScreenSize() {
        this.isMobile = window.innerWidth < 992;
    }

    async toggleMenu() {
        await this.menuCtrl.toggle('first');
    }
}
