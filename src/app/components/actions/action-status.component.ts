import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ActionsService } from 'src/app/services/actions.service';

@Component({
  selector: 'app-action-status',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="!embedded; else embeddedContent">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-button (click)="dismiss()">
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </ion-buttons>
          <ion-title>Acciones del Ticket</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ng-container *ngTemplateOutlet="actionContent"></ng-container>
      </ion-content>
    </ng-container>

    <ng-template #embeddedContent>
      <div class="action-status-wrapper">
        <ng-container *ngTemplateOutlet="actionContent"></ng-container>
      </div>
    </ng-template>

    <ng-template #actionContent>
      <ion-list *ngIf="actions.length > 0; else noActions">
        <ion-item *ngFor="let action of actions">
          <ion-label>{{ action.ActionName }}</ion-label>
          <ion-checkbox
            slot="end"
            [checked]="action.Completed"
            (ionChange)="onCheckboxChange($event.detail.checked, action)"
          ></ion-checkbox>
        </ion-item>
      </ion-list>

      <ng-template #noActions>
        <ion-text color="medium">
          <p class="ion-padding-top">Este ticket no tiene acciones asociadas.</p>
        </ion-text>
      </ng-template>

      <ion-button
        expand="block"
        color="primary"
        (click)="updateStatuses()"
        [disabled]="actions.length === 0 ? false : pendingUpdates.size === 0"
      >
        Actualizar estatus
      </ion-button>
    </ng-template>
  `,
  styles: [`
    .action-status-wrapper {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px;
    }

    ion-label {
      white-space: normal;
    }
  `]
})
export class ActionStatusComponent implements OnInit {
  @Input() ticketId!: number;
  @Input() openedFromCurrentTask: boolean = false;
  @Input() embedded: boolean = false;

  @Output() allActionsCompleted = new EventEmitter<boolean>();

  actions: { ActionsID: number, ActionName: string, Completed: boolean }[] = [];
  pendingUpdates = new Map<number, boolean>();

  constructor(
    private modalCtrl: ModalController,
    private actionsService: ActionsService,
    private toastController: ToastController
  ) {}

  async ngOnInit() {
    if (this.ticketId) {
      const rawActions = await this.actionsService.getActionsByTicketId(this.ticketId);
      this.actions = rawActions.map((action: any) => ({
        ActionsID: action.ActionsID,
        ActionName: action.ActionName,
        Completed: action.Completed?.data?.[0] === 1
      }));
    }
  }

  onCheckboxChange(checked: boolean, action: any) {
    this.pendingUpdates.set(action.ActionsID, checked);
    action.Completed = checked;
  }

  async updateStatuses() {
    try {
      if (this.actions.length === 0) {
        await this.actionsService.finalizeSimpleTask(this.ticketId);
      } else if (this.pendingUpdates.size > 0) {
        const updates = Array.from(this.pendingUpdates.entries()).map(([ActionsID, Completed]) => ({
          ActionsID,
          Completed: Completed ? 1 : 0
        }));

        await this.actionsService.updateMultipleActionStatus(this.ticketId, updates);
        this.pendingUpdates.clear();

        this.actions.forEach(action => {
          const update = updates.find(u => u.ActionsID === action.ActionsID);
          if (update) action.Completed = !!update.Completed;
        });
      }

      const toast = await this.toastController.create({
        message: 'Estatus actualizado correctamente.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      if (this.openedFromCurrentTask || this.embedded) {
        const allCompleted = this.actions.every(action => action.Completed);
        const completionToast = await this.toastController.create({
          message: allCompleted ? '¡Tarea finalizada!' : '⚠️ Aún faltan acciones por completar.',
          duration: 3000,
          color: allCompleted ? 'tertiary' : 'danger'
        });
        await completionToast.present();

        if (this.embedded && allCompleted) {
          this.allActionsCompleted.emit(true);
        }

        if (this.openedFromCurrentTask && allCompleted) {
          this.dismiss(true);
        }
      }

    } catch {
      const errorToast = await this.toastController.create({
        message: 'Error al actualizar el estatus.',
        duration: 2000,
        color: 'danger'
      });
      await errorToast.present();
    }
  }

  dismiss(updated = false) {
    if (this.openedFromCurrentTask && updated) {
      const allCompleted = this.actions.every(action => action.Completed);
      this.modalCtrl.dismiss({ allCompleted }, 'updated');
    } else {
      this.modalCtrl.dismiss(null, updated ? 'updated' : 'cancel');
    }
  }
}
