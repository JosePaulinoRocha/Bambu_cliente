import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { SettingsDialogComponent } from './dialogs/settings-dialog.component';
import { NotificationsDialogComponent } from './dialogs/notifications-dialog.component';

@Component({
    selector: 'app-tools-bar',
    template: `
        <div class="tools-bar">
            <ion-button fill="clear" (click)="openSettings()">
                <ion-icon name="settings-outline"></ion-icon>
            </ion-button>
            <ion-button fill="clear" (click)="openNotifications()">
                <ion-icon name="notifications-outline"></ion-icon>
                <ion-badge *ngIf="unreadNotifications > 0" color="danger" class="notification-badge">
                    {{ unreadNotifications }}
                </ion-badge>
            </ion-button>
        </div>
    `,
    styles: [`
        .tools-bar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            gap: 8px;
            padding: 8px;
        }

        ion-button {
            --padding-start: 8px;
            --padding-end: 8px;
            height: 40px;
            margin: 0;
        }

        ion-icon {
            font-size: 1.5rem;
        }

        .notification-badge {
            position: absolute;
            top: 0;
            right: 0;
            transform: translate(25%, -25%);
            font-size: 0.7rem;
            padding: 2px 4px;
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class ToolsBarComponent implements OnInit {
    unreadNotifications = 2; // Esto debería venir de un servicio

    constructor(private modalCtrl: ModalController) {}

    ngOnInit(): void {}

    async openSettings() {
        const modal = await this.modalCtrl.create({
            component: SettingsDialogComponent,
            cssClass: 'modal-fullscreen'
        });
        await modal.present();
    }

    async openNotifications() {
        const modal = await this.modalCtrl.create({
            component: NotificationsDialogComponent,
            cssClass: 'modal-fullscreen'
        });
        await modal.present();
    }
}
