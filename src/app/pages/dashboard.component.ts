import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CurrentTaskComponent } from '../components/task/current-task.component';
import { DailyAgendaComponent } from '../components/daily-agenda/daily-agenda.component';
import { UsersService } from '../services/users.service';
import { Subscription } from 'rxjs';
import { User } from '../types/users.type';
import localeEs from '@angular/common/locales/es';
import { NotificationsService } from '../services/notificacions.service';


registerLocaleData(localeEs);

@Component({
    selector: 'app-dashboard',
    template: `
        <ion-content>
            <div class="dashboard-container principal-background">
                <!-- Encabezado del usuario -->
                <div class="user-header">
                    <div class="user-info">
                        <h2>Hola, {{currentUser?.Name || 'Usuario'}}</h2>
                    </div>
                    <div class="date-info">
                        <ion-icon name="calendar-outline"></ion-icon>
                        <span>{{currentDate | date:'EEEE, d MMMM y':'':'es'}}</span>
                    </div>
                </div>

                <!-- Estadísticas rápidas -->
                <div class="quick-stats">
                    <ion-card>
                        <ion-card-content>
                            <div class="stats-grid">
                                <div class="stat-item">
                                    <ion-icon name="alert-circle" color="danger"></ion-icon>
                                    <div class="stat-info">
                                        <span class="stat-value">{{overdueTasks}}</span>
                                        <span class="stat-label">Tareas vencidas</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <ion-icon name="add-circle" color="primary"></ion-icon>
                                    <div class="stat-info">
                                        <span class="stat-value">{{pendingTasks}}</span>
                                        <span class="stat-label">Tareas pendientes</span>
                                    </div>
                                </div>
                                <div class="stat-item">
                                    <ion-icon name="checkmark-circle" color="success"></ion-icon>
                                    <div class="stat-info">
                                        <span class="stat-value">{{completedTasks}}</span>
                                        <span class="stat-label">Completadas</span>
                                    </div>
                                </div>
                            </div>
                        </ion-card-content>
                    </ion-card>
                </div>

                <!-- Actividad actual -->
                <app-current-task></app-current-task>

                <!-- Agenda del día -->
                <app-daily-agenda></app-daily-agenda>

            </div>
        </ion-content>
    `,
    styles: [`
        .dashboard-container {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .user-header {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
        }

        .user-header:hover {
            transform: translateY(-2px);
        }

        .user-info {
            flex: 1;
            h2 {
                margin: 0;
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--ion-color-dark);
            }
            p {
                margin: 6px 0 0;
                color: var(--ion-color-medium);
                font-size: 0.95rem;
            }
        }

        .date-info {
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--ion-color-medium);
            font-size: 0.95rem;
            padding: 8px 12px;
            background: var(--ion-color-light);
            border-radius: 8px;
        }

        ion-card {
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.2s ease;
            overflow: hidden;
        }

        ion-card:hover {
            transform: translateY(-2px);
        }

        .quick-stats {
            ion-card-content {
                padding: 16px;
            }
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: var(--ion-color-light);
            border-radius: 12px;
            transition: background-color 0.2s ease;
        }

        .stat-item:hover {
            background: var(--ion-color-light-shade);
        }

        .stat-info {
            display: flex;
            flex-direction: column;
        }

        .stat-value {
            font-size: 1.6rem;
            font-weight: 700;
            color: var(--ion-color-dark);
        }

        .stat-label {
            font-size: 0.85rem;
            color: var(--ion-color-medium);
            margin-top: 4px;
        }

        .quick-actions {
            ion-card-header {
                padding: 16px;
            }

            ion-card-content {
                padding: 16px;
            }
        }

        .actions-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }

        ion-button {
            --border-radius: 12px;
            height: 48px;
            font-weight: 500;
            transition: transform 0.2s ease;
        }

        ion-button:hover {
            transform: translateY(-2px);
        }

        app-current-task, app-daily-agenda {
            margin: 0;
        }
    `],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        CurrentTaskComponent,
        DailyAgendaComponent,
    ]
})
export class DashboardComponent implements OnInit {
    private userSubscription: Subscription | null = null;
    currentUser: User | null = null;
    userName: string = 'Usuario Ejemplo';
    userRole: string = 'J3';
    currentDate: Date = new Date();
    overdueTasks: number = 0;
    pendingTasks: number = 0;
    completedTasks: number = 0;

    constructor(private usersService: UsersService, private notificationsService: NotificationsService) { }

    ngOnInit(): void {
    this.userSubscription = this.usersService.currentUser$.subscribe(user => {
        this.currentUser = user;
    });

    this.overdueTasks = 2;
    this.pendingTasks = 5;
    this.completedTasks = 3;
    }


}
