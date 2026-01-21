import { Component } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-settings-dialog',
    template: `
        <ion-header>
            <ion-toolbar>
                <ion-title>Configuraciones</ion-title>
                <ion-buttons slot="end">
                    <ion-button (click)="dismiss()">
                        <ion-icon name="close-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-list>
                <ion-item>
                    <ion-label>Tema</ion-label>
                    <ion-select value="light">
                        <ion-select-option value="light">Claro</ion-select-option>
                        <ion-select-option value="dark">Oscuro</ion-select-option>
                    </ion-select>
                </ion-item>
                <ion-item>
                    <ion-label>Idioma</ion-label>
                    <ion-select value="es">
                        <ion-select-option value="es">Español</ion-select-option>
                        <ion-select-option value="en">English</ion-select-option>
                    </ion-select>
                </ion-item>
            </ion-list>
        </ion-content>
    `,
    styles: [`
        ion-content {
            --background: var(--ion-color-light);
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class SettingsDialogComponent {
    constructor(private modalCtrl: ModalController) {}

    dismiss() {
        this.modalCtrl.dismiss();
    }
} 