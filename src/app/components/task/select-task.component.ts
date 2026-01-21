import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { Tickets } from 'src/app/types/tickets.types';

@Component({
  selector: 'app-select-task',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Seleccionar tarea</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">Cerrar</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-list *ngIf="tickets?.length; else noData">
        <ion-item *ngFor="let ticket of tickets" (click)="select(ticket)">
          <ion-label>
            <h2>{{ ticket.TaskName }}</h2>
            <p>{{ ticket.SegmentName }} - {{ ticket.CategoryName }} / {{ ticket.SubcategoryName }} / {{ ticket.ConceptName }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ng-template #noData>
        <ion-text color="medium">No hay tickets pendientes.</ion-text>
      </ng-template>
    </ion-content>
  `
})
export class SelectTaskComponent {
  @Input() tickets: Tickets[] = [];

  constructor(private modalCtrl: ModalController) {}

  select(ticket: Tickets) {
    this.modalCtrl.dismiss({ selectedTicket: ticket });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
