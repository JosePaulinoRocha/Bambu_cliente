import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';


@Component({
  selector: 'app-schedule-task',
  standalone: true,
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Agendar Tarea</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">
            <ion-icon name="close"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="schedule-container">

        <!-- Selecciona una tarea -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Selecciona una tarea</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="tasks-grid">
              <div class="task-item selected">
                <ion-checkbox checked="true" disabled></ion-checkbox>
                <div class="task-content">
                  <h3>Tarea de ejemplo</h3>
                  <p>ID: 123</p>
                </div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Selecciona la hora -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Selecciona la hora</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="time-grid">
              <div
                class="time-item"
                *ngFor="let time of timeSlots"
              >
                <div class="time-slot">{{ time }}</div>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Acción -->
        <div class="actions">
          <ion-button expand="block" disabled>
            <ion-icon name="calendar-outline"></ion-icon>
            Agendar Tarea
          </ion-button>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .schedule-container {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    ion-card {
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      margin: 0;
    }

    ion-card-header {
      padding: 16px;
      background: var(--ion-color-light);
    }

    ion-card-title {
      font-size: 1.1rem;
      font-weight: 600;
    }

    .tasks-grid {
      display: grid;
      gap: 12px;
    }

    .task-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--ion-color-light);
      background-checked: transparent;
    }

    .task-content h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
    }

    .task-content p {
      margin: 4px 0 0;
      font-size: 0.85rem;
      color: var(--ion-color-medium);
    }

    .time-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 12px;
    }

    .time-item {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--ion-color-light);
      background: var(--ion-color-light);
      text-align: center;
      opacity: 0.6;
    }

    .time-slot {
      font-weight: 600;
    }

    .actions {
      padding: 12px;
      border-radius: 12px;
      background: var(--ion-color-light);
    }
  `]
})
export class ScheduleTaskComponent {

  // Horas mock
  timeSlots: string[] = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM'
  ];

  constructor(private modalCtrl: ModalController) {}

  close() {
    this.modalCtrl.dismiss();
  }
}