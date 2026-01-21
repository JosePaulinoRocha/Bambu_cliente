import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ProblemReportService } from '../../services/problem-report.service';
import { ErrorHandlerService } from '../../services/error-handler.service';
import { Task } from '../../pages/problems-management.component';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ mode === 'edit' ? 'Editar tarea' : 'Crear tarea' }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container">
        <ion-card>
          <ion-card-content>

            <form [formGroup]="taskForm" (ngSubmit)="submitTask()">

              <!-- Nombre -->
              <ion-item>
                <ion-label position="stacked">Nombre *</ion-label>
                <ion-input
                  formControlName="name"
                  maxlength="255">
                </ion-input>
              </ion-item>

              <!-- Prioridad -->
              <ion-item>
                <ion-label position="stacked">Prioridad *</ion-label>
                <ion-select formControlName="priority">
                  <ion-select-option value="low">Baja</ion-select-option>
                  <ion-select-option value="medium">Media</ion-select-option>
                  <ion-select-option value="high">Alta</ion-select-option>
                </ion-select>
              </ion-item>

              <!-- Estado -->
              <ion-item lines="none">
                <ion-label>Finalizada</ion-label>
                <ion-toggle formControlName="isCompleted"></ion-toggle>
              </ion-item>

              <!-- Acciones -->
              <div class="form-actions">
                <ion-button
                  type="submit"
                  expand="block"
                  [disabled]="taskForm.invalid || isSubmitting">
                  {{ isSubmitting
                    ? 'Guardando...'
                    : mode === 'edit'
                      ? 'Actualizar tarea'
                      : 'Crear tarea' }}
                </ion-button>

                <ion-button
                  type="button"
                  expand="block"
                  fill="outline"
                  (click)="dismiss()"
                  [disabled]="isSubmitting">
                  Cancelar
                </ion-button>
              </div>

            </form>

          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  `,
  styles: [`
    .container {
      padding: 16px;
    }

    ion-item {
      margin-bottom: 12px;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
  `]
})
export class TaskModalComponent implements OnInit {

  @Input() mode: 'create' | 'edit' = 'create';
  @Input() task?: Task;

  taskForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private modalController: ModalController,
    private problemReportService: ProblemReportService,
    private errorHandler: ErrorHandlerService
  ) {
    this.taskForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      priority: ['medium', Validators.required],
      isCompleted: [false]
    });
  }

  ngOnInit(): void {
    if (this.mode === 'edit' && this.task) {
      this.taskForm.patchValue({
        name: this.task.Name,
        priority: this.task.Priority,
        isCompleted: !!this.task.IsCompleted
      });
    }
  }

  async submitTask() {
    if (this.taskForm.invalid) return;

    this.isSubmitting = true;

    try {
      const payload = this.taskForm.value;

      let response;
      if (this.mode === 'edit' && this.task) {
        response = await this.problemReportService.updateTask(
          this.task.TaskID,
          payload
        );
      } else {
        response = await this.problemReportService.createTask(payload);
      }

      if (response?.success) {
        this.modalController.dismiss({ refresh: true });
      } else {
        this.errorHandler.showErrorMsg(response?.message || 'Error');
      }

    } catch (error) {
      console.error(error);
      this.errorHandler.showErrorMsg('No se pudo guardar la tarea');
    } finally {
      this.isSubmitting = false;
    }
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
