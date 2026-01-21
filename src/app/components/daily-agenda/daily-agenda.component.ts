import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ScheduledTasksService, ScheduledTask } from '../../services/scheduled-tasks.service';
import { ScheduleTaskComponent } from '../schedule-task/schedule-task.component';

interface AgendaItem {
  time: string;
  title: string;
  status: 'active' | 'overdue' | 'scheduled' | 'empty';
  description?: string;
}

@Component({
  selector: 'app-daily-agenda',
  template: `
    <div class="agenda-container">
      <ion-card>
        <ion-card-header>
          <ion-card-title>🗓 Agenda del día (9:00 AM - 6:00 PM)</ion-card-title>
          <ion-button fill="clear" (click)="openScheduleTask()">
            <ion-icon name="add-circle-outline"></ion-icon>
            Agendar Tarea
          </ion-button>
        </ion-card-header>

        <ion-card-content>
          <div class="agenda-grid">
            <div
              class="agenda-item"
              *ngFor="let item of agendaItems"
              [ngClass]="item.status"
            >
              <div class="time-slot">{{ item.time }}</div>

              <div class="agenda-content">
                <ng-container *ngIf="item.status !== 'empty'">
                  <div
                    class="status-indicator"
                    [ngClass]="item.status"
                  ></div>

                  <div class="agenda-details">
                    <div class="agenda-title">{{ item.title }}</div>
                    <div
                      class="agenda-description"
                      *ngIf="item.description"
                    >
                      {{ item.description }}
                    </div>
                  </div>
                </ng-container>

                <div class="empty-slot" *ngIf="item.status === 'empty'">
                  [Vacío]
                </div>
              </div>
            </div>
          </div>
        </ion-card-content>
      </ion-card>
    </div>
  `,
  styles: [`
    .agenda-container {
      padding: 0;
    }

    ion-card {
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.2s ease;
    }

    ion-card:hover {
      transform: translateY(-2px);
    }

    ion-card-header {
      padding: 16px;
      background: var(--ion-color-light);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    ion-card-title {
      font-size: 1.2rem;
      font-weight: 600;
      color: var(--ion-color-dark);
    }

    ion-card-content {
      padding: 16px;
    }

    .agenda-grid {
      display: grid;
      gap: 12px;
    }

    .agenda-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 16px;
      padding: 12px;
      border-radius: 12px;
      background: white;
      border: 1px solid var(--ion-color-light);
      transition: all 0.2s ease;
      position: relative;
    }

    .agenda-item:not(:last-child)::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      right: 0;
      height: 1px;
      background: repeating-linear-gradient(
        to right,
        var(--ion-color-medium) 0px,
        var(--ion-color-medium) 4px,
        transparent 4px,
        transparent 8px
      );
    }

    .agenda-item:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .time-slot {
      font-weight: 600;
      font-size: 0.95rem;
      color: var(--ion-color-dark);
    }

    .agenda-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-indicator {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .active {
      background-color: var(--ion-color-primary);
    }

    .overdue {
      background-color: var(--ion-color-danger);
    }

    .scheduled {
      background-color: var(--ion-color-success);
    }

    .agenda-item.active {
      background: var(--ion-color-primary-tint);
      border-color: var(--ion-color-primary);
    }

    .agenda-item.overdue {
      background: var(--ion-color-danger-tint);
      border-color: var(--ion-color-danger);
    }

    .agenda-item.scheduled {
      background: var(--ion-color-success-tint);
      border-color: var(--ion-color-success);
    }

    .agenda-item.empty {
      background: var(--ion-color-light);
      border-color: var(--ion-color-light-shade);
    }

    .agenda-title {
      font-weight: 500;
      font-size: 1rem;
      color: var(--ion-color-dark);
      margin-bottom: 4px;
    }

    .agenda-description {
      font-size: 0.9rem;
      color: var(--ion-color-medium);
      line-height: 1.4;
    }

    .empty-slot {
      font-style: italic;
      font-size: 0.9rem;
      color: var(--ion-color-medium);
    }
  `],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DailyAgendaComponent implements OnInit {

  agendaItems: AgendaItem[] = [];

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    this.loadAgendaItems();
  }

  private loadAgendaItems() {
    this.agendaItems = [
      { time: '9:00 AM',  title: 'Revisión de ticket', status: 'scheduled' },
      { time: '10:00 AM', title: 'Tarea de ejemplo', status: 'scheduled' },
      { time: '11:00 AM', title: '', status: 'empty' },
      { time: '12:00 PM', title: 'Soporte interno', status: 'scheduled' },
      { time: '1:00 PM',  title: '', status: 'empty' },
      { time: '2:00 PM',  title: 'Seguimiento', status: 'scheduled' },
      { time: '3:00 PM',  title: '', status: 'empty' },
      { time: '4:00 PM',  title: '', status: 'empty' },
      { time: '5:00 PM',  title: '', status: 'empty' },
      { time: '6:00 PM',  title: '', status: 'empty' }
    ];
  }

  async openScheduleTask() {
    const modal = await this.modalCtrl.create({
      component: ScheduleTaskComponent,
      breakpoints: [0, 0.5, 0.75, 1],
      initialBreakpoint: 0.75
    });

    await modal.present();
  }
}