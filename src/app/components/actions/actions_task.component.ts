import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { ActionsService } from 'src/app/services/actions.service';

@Component({
  selector: 'app-actions-task',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
    <ion-header translucent="true">
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-button fill="clear" (click)="dismiss()">
            <ion-icon name="close-outline" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Acciones de la Tarea</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div *ngIf="actions.length > 0; else noActions">
        <ion-card *ngFor="let action of actions" class="action-card">
          <ion-card-header>
            <ion-card-title>{{ action.ActionName }}</ion-card-title>
          </ion-card-header>
        </ion-card>
      </div>

      <ng-template #noActions>
        <ion-text color="medium">
          <p class="ion-text-center ion-padding-top">
            Esta tarea no tiene acciones asociadas.
          </p>
        </ion-text>
      </ng-template>
    </ion-content>
  `,
  styles: [`
    .action-card {
      margin-bottom: 12px;
      border-left: 4px solid var(--ion-color-primary);
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    ion-card-title {
      font-size: 1rem;
      font-weight: 500;
      color: #222;
    }
  `]
})
export class ActionsTaskComponent implements OnInit {
  @Input() taskId!: number;
  actions: { ActionsID: number, ActionName: string, Completed: boolean }[] = [];

  constructor(
    private modalCtrl: ModalController,
    private actionsService: ActionsService
  ) {}

  async ngOnInit() {
    if (this.taskId) {
      const rawActions = await this.actionsService.getActionsByTaskId(this.taskId);
      this.actions = rawActions.map((action: any) => ({
        ActionsID: action.ActionsID,
        ActionName: action.ActionName,
        Completed: action.Completed?.data?.[0] === 1
      }));
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
