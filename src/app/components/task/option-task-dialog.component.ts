import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActionsTaskComponent } from '../actions/actions_task.component';
import { inject } from '@angular/core';
import { ActionsService } from 'src/app/services/actions.service';
import { CreateTaskComponent } from '../task/create-task.component';

interface Task {
    TaskID: number;
    TaskName: string;
    SegmentID: number;
    SegmentName: string;
    CategoryID: number;
    CategoryName: string;
    SubcategoryID: number;
    SubcategoryName: string;
    ConceptID: number | null;
    ConceptName: string | null;
}

@Component({
    selector: 'app-options-task-dialog',
    template: `
        <ion-header>
            <ion-toolbar>
                <ion-title>Opciones de tarea</ion-title>
                <ion-buttons slot="end">
                    <ion-button (click)="dismiss()">
                        <ion-icon name="close-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <ion-list class="options-list" lines="none">
                <ion-item button detail="false" (click)="viewActions()">
                    <ion-icon name="list-outline" slot="start" color="primary"></ion-icon>
                    <ion-label>
                        <h2>Ver acciones</h2>
                        <p>Ver las acciones asociadas a esta tarea</p>
                    </ion-label>
                </ion-item>
                <ion-item button detail="false" (click)="createTicket()">
                    <ion-icon name="ticket-outline" slot="start" color="primary"></ion-icon>
                    <ion-label>
                        <h2>Crear ticket</h2>
                        <p>Crear un nuevo ticket para esta tarea</p>
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    `,
    styles: [`
        ion-content {
            --background: var(--ion-color-light);
        }
        .options-list {
            margin: 16px 0;
        }
        ion-item {
            margin-bottom: 16px;
            --padding-start: 20px;
            --padding-end: 20px;
            --min-height: 90px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            transition: box-shadow 0.2s, transform 0.2s;
        }
        ion-item:last-child {
            margin-bottom: 0;
        }
        ion-item:hover {
            box-shadow: 0 4px 16px rgba(0,0,0,0.10);
            transform: translateY(-2px);
        }
        ion-item ion-icon {
            font-size: 2rem;
            margin-right: 16px;
        }
        ion-item h2 {
            font-size: 1.1rem;
            font-weight: 600;
            margin: 0 0 4px 0;
            color: var(--ion-color-dark);
        }
        ion-item p {
            font-size: 0.95rem;
            color: var(--ion-color-medium);
            margin: 0;
        }
        @media (max-width: 600px) {
            ion-item {
                --min-height: 64px;
                --border-radius: 10px;
                font-size: 1rem;
                margin-bottom: 10px;
            }
            ion-item ion-icon {
                font-size: 1.4rem;
                margin-right: 12px;
            }
            ion-item h2 {
                font-size: 1rem;
            }
            ion-item p {
                font-size: 0.85rem;
            }
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule]
})
export class OptionsTaskDialogComponent {
    @Input() task!: Task;
    @Input() camesFrom: 'allTasks' | 'taskDetail' | null = null;

    private modalCtrl = inject(ModalController);
    private actionsService = inject(ActionsService);

    dismiss() {
        this.modalCtrl.dismiss();
    }

    async viewActions() {
        await this.modalCtrl.dismiss();
        const modal = await this.modalCtrl.create({
            component: ActionsTaskComponent,
            componentProps: { taskId: this.task.TaskID }
        });
        await modal.present();

        const { role } = await modal.onDidDismiss();
        if (role === 'updated') {
            this.modalCtrl.dismiss({ action: 'actions-updated', task: this.task });
        }
    }

    isSimpleTask(): boolean {
        return !this.task.SegmentID || !this.task.CategoryID || !this.task.SubcategoryID;
    }

    async createTicket() {
        try {
            const actions = await this.actionsService.getActionsByTaskId(this.task.TaskID);
            await this.modalCtrl.dismiss();

            console.log("camesFrom", this.camesFrom);
            const modal = await this.modalCtrl.create({
                component: CreateTaskComponent,
                componentProps: {
                    task: this.task,
                    actions: actions,
                    mode: this.isSimpleTask() ? 'simple' : 'estructurada',
                    showStructuredTaskOption: this.camesFrom === 'allTasks' ? false : true
                }
            });

            await modal.present();
            const { data, role } = await modal.onDidDismiss();
        } catch (error) {
            console.error('Error al obtener acciones:', error);
        }
    }

}