import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { SelectTaskComponent } from './select-task.component';
import { ActionStatusComponent } from '../actions/action-status.component';

@Component({
    selector: 'app-current-task',
    standalone: true,
    imports: [IonicModule, CommonModule],
    template: `
        <ion-card>
            <ion-card-header>
                <ion-card-title>⏰ Tarea actual</ion-card-title>
            </ion-card-header>
            <ion-card-content>
                <ng-container *ngIf="showChronometer; else selectTaskTemplate">
                    <div class="activity-info">
                        <div class="task-title">{{ currentTask }}</div>

                        <div class="timer">
                            <ion-icon name="time-outline"></ion-icon>
                            <span>{{ elapsedTime }}</span>
                        </div>

                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress" [style.width.%]="progressPercentage"></div>
                            </div>
                            <span class="progress-text">
                                {{ progressPercentage | number:'1.0-0' }}%
                            </span>
                        </div>

                        <div class="action-buttons">
                            <ion-button
                                color="warning"
                                size="small"
                                class="action-button"
                                (click)="togglePause()">
                                <ion-icon
                                    [name]="isPaused ? 'play' : 'pause'"
                                    slot="start">
                                </ion-icon>
                                {{ isPaused ? 'Seguir' : 'Pausar' }}
                            </ion-button>

                            <ion-button
                                color="success"
                                size="small"
                                class="action-button"
                                (click)="finishTask()">
                                <ion-icon name="checkmark" slot="start"></ion-icon>
                                Concluir
                            </ion-button>
                        </div>
                    </div>
                </ng-container>

                <ng-template #selectTaskTemplate>
                    <ion-button
                        expand="block"
                        color="primary"
                        (click)="startMockTask()">
                        <ion-icon name="document-outline" slot="start"></ion-icon>
                        Seleccionar tarea pendiente
                    </ion-button>
                </ng-template>
            </ion-card-content>
        </ion-card>
    `,
    styles: [`
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
        }

        ion-card-title {
            font-size: 1.2rem;
            font-weight: 600;
            color: var(--ion-color-dark);
        }

        ion-card-content {
            padding: 16px;
        }

        .activity-info {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .task-title {
            font-size: 1.1rem;
            font-weight: 500;
            color: var(--ion-color-dark);
        }

        .timer {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.2rem;
            font-weight: 500;
        }

        .progress-container {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .progress-bar {
            flex: 1;
            height: 8px;
            background-color: var(--ion-color-light);
            border-radius: 4px;
            overflow: hidden;
        }

        .progress {
            height: 100%;
            background: linear-gradient(
                to right,
                var(--ion-color-primary),
                var(--ion-color-primary-shade)
            );
            transition: width 0.3s ease;
        }

        .progress-text {
            font-size: 0.9rem;
            color: var(--ion-color-medium);
            min-width: 40px;
            text-align: right;
        }

        .action-buttons {
            display: flex;
            gap: 12px;
        }
    `]
})
export class CurrentTaskComponent implements OnInit, OnDestroy {

    currentTask = '';
    elapsedTime = '00:00:00';
    progressPercentage = 0;

    showChronometer = false;
    isPaused = false;

    private startTime = 0;
    private accumulatedTime = 0;
    private timerInterval: any;

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.stopTimer();
    }

    startMockTask(): void {
        this.currentTask = 'Diseñar formulario de alta de tareas';
        this.showChronometer = true;
        this.isPaused = false;
        this.accumulatedTime = 0;
        this.startTimer();
    }

    finishTask(): void {
        this.stopTimer();
        this.currentTask = '';
        this.showChronometer = false;
        this.elapsedTime = '00:00:00';
        this.progressPercentage = 0;
    }

    togglePause(): void {
        if (this.isPaused) {
            this.startTime = Date.now() - this.accumulatedTime;
            this.startTimer();
        } else {
            this.accumulatedTime = Date.now() - this.startTime;
            this.stopTimer();
        }
        this.isPaused = !this.isPaused;
    }

    private startTimer(): void {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.updateElapsedTime();
            this.updateProgress();
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private updateElapsedTime(): void {
        const elapsed = this.isPaused
            ? this.accumulatedTime
            : this.accumulatedTime + (Date.now() - this.startTime);

        const h = Math.floor(elapsed / 3600000);
        const m = Math.floor((elapsed % 3600000) / 60000);
        const s = Math.floor((elapsed % 60000) / 1000);

        this.elapsedTime = `${this.pad(h)}:${this.pad(m)}:${this.pad(s)}`;
    }

    private updateProgress(): void {
        const elapsed = this.isPaused
            ? this.accumulatedTime
            : this.accumulatedTime + (Date.now() - this.startTime);

        this.progressPercentage = Math.min((elapsed / 3600000) * 100, 100);
    }

    private pad(n: number): string {
        return n.toString().padStart(2, '0');
    }
}