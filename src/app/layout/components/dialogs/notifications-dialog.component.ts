import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface Notification {
    id: number;
    title: string;
    message: string;
    time: string;
    read: boolean;
}

@Component({
    selector: 'app-notifications-dialog',
    template: `
        <ion-header>
            <ion-toolbar>
                <ion-title>Notificaciones</ion-title>
                <ion-buttons slot="end">
                    <ion-button (click)="dismiss()">
                        <ion-icon name="close-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-list>
                @for (notification of notifications; track notification.id) {
                    <ion-item [class.unread]="!notification.read">
                        <ion-label>
                            <h2>{{ notification.title }}</h2>
                            <p>{{ notification.message }}</p>
                            <p class="time">{{ notification.time }}</p>
                        </ion-label>
                    </ion-item>
                }
            </ion-list>
        </ion-content>
    `,
    styles: [`
        ion-content {
            --background: var(--ion-color-light);
        }

        .unread {
            --background: var(--ion-color-light-shade);
        }

        .time {
            font-size: 0.8em;
            color: var(--ion-color-medium);
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class NotificationsDialogComponent {
    notifications: Notification[] = [
        {
            id: 1,
            title: 'Nueva tarea asignada',
            message: 'Se te ha asignado una nueva tarea de validación',
            time: 'Hace 5 minutos',
            read: false
        },
        {
            id: 2,
            title: 'Tarea completada',
            message: 'La tarea "Revisión de documentos" ha sido completada',
            time: 'Hace 1 hora',
            read: true
        }
    ];

    constructor(private modalCtrl: ModalController) {}

    dismiss() {
        this.modalCtrl.dismiss();
    }
} 