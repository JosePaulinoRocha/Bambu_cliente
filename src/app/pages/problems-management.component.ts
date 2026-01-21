import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { ProblemReportService } from '../services/problem-report.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { TaskModalComponent } from '../components/problem-report-modal/problem-report-modal.component';

export interface Task {
  TaskID: number;
  Name: string;
  Priority: 'low' | 'medium' | 'high';
  IsCompleted: number; // 0 | 1
  CreatedAt: string;
  UpdatedAt: string;
}

@Component({
  selector: 'app-problems-management',
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Tareas</ion-title>
        <ion-buttons slot="end">
          <ion-button color="primary" (click)="openReportModal()">
            <ion-icon name="add-outline" slot="start"></ion-icon>
            Crear tarea
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="container">

        <!-- Filtros -->
        <ion-card>
          <ion-card-content>
            <ion-row>

              <!-- Prioridad -->
              <ion-col size="12" size-md="4">
                <ion-item>
                  <ion-label position="stacked">Prioridad</ion-label>
                  <ion-select [(ngModel)]="filters.priority" (ionChange)="applyFilters()">
                    <ion-select-option value="">Todas</ion-select-option>
                    <ion-select-option value="low">Baja</ion-select-option>
                    <ion-select-option value="medium">Media</ion-select-option>
                    <ion-select-option value="high">Alta</ion-select-option>
                  </ion-select>
                </ion-item>
              </ion-col>

              <!-- Buscar -->
              <ion-col size="12" size-md="4">
                <ion-item>
                  <ion-label position="stacked">Buscar</ion-label>
                  <ion-input
                    [(ngModel)]="filters.search"
                    placeholder="Buscar por nombre"
                    (ionInput)="applyFilters()">
                  </ion-input>
                </ion-item>
              </ion-col>

              <!-- Buscar por ID -->
              <ion-col size="12" size-md="4">
                <ion-item>
                  <ion-label position="stacked">Buscar por ID</ion-label>
                  <ion-input
                    type="number"
                    [(ngModel)]="filters.id"
                    placeholder="ID de la tarea"
                    (keydown.enter)="applyFilters()">
                  </ion-input>
                </ion-item>
              </ion-col>

            </ion-row>
          </ion-card-content>
        </ion-card>

        <!-- Lista -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Tareas</ion-card-title>
            <ion-card-subtitle>
              {{ filteredTasks.length }} encontradas
            </ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>

            <div *ngIf="loading" class="loading">
              <ion-spinner></ion-spinner>
              <p>Cargando tareas...</p>
            </div>

            <div *ngIf="!loading && filteredTasks.length === 0" class="empty">
              <p>No hay tareas</p>
            </div>

            <ion-list *ngIf="!loading && filteredTasks.length > 0">
              <ion-item
                *ngFor="let task of filteredTasks"
                [class.selected]="selectedTask?.TaskID === task.TaskID"
                (click)="selectTask(task)"
                button>

                <ion-icon
                  slot="start"
                  [name]="getPriorityIcon(task.Priority)"
                  [color]="getPriorityColor(task.Priority)">
                </ion-icon>

                <ion-label>
                  <h3>{{ task.Name }} (ID: {{ task.TaskID }})</h3>
                  <p>
                    Estado:
                    {{ task.IsCompleted ? 'Finalizado' : 'Pendiente' }}
                  </p>

                  <small>
                    <span class="date-label">Creación:</span> {{ task.CreatedAt | date:'short' }}<br>
                    <span class="date-label">Actualización:</span> {{ task.UpdatedAt | date:'short' }}
                  </small>
                </ion-label>

                <ion-badge
                  slot="end"
                  [color]="task.IsCompleted ? 'success' : 'warning'">
                  {{ task.IsCompleted ? 'Finalizado' : 'Pendiente' }}
                </ion-badge>

                <ion-button
                    slot="end"
                    fill="clear"
                    color="danger"
                    size="small"
                    (click)="confirmDelete(task, $event)">
                    <ion-icon name="trash-outline"></ion-icon>
                </ion-button>

              </ion-item>
            </ion-list>

          </ion-card-content>
        </ion-card>

        <!-- Controles de paginación -->
        <div class="pagination-controls" *ngIf="totalTasks > itemsPerPage" style="text-align: center; margin-top: 16px;">
          <ion-button
            [disabled]="currentPage === 1"
            (click)="changePage(currentPage - 1)">
            ← Anterior
          </ion-button>

          <span style="margin: 0 12px;">Página {{ currentPage }} de {{ totalPages }}</span>

          <ion-button
            [disabled]="currentPage === totalPages"
            (click)="changePage(currentPage + 1)">
            Siguiente →
          </ion-button>
        </div>

      </div>
    </ion-content>
  `,
  styles: [`
    .container { padding: 16px; }
    .loading, .empty {
      text-align: center;
      padding: 32px;
      color: var(--ion-color-medium);
    }
    ion-item.selected {
    --background: rgba(46, 204, 113, 0.12);
    }
    .date-label {
      font-weight: bold;
      color: var(--ion-color-medium);
    }
  `]
})
export class ProblemsManagementComponent implements OnInit {

  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  selectedTask: Task | null = null;
  loading = false;
  currentPage = 1;
  itemsPerPage = 10;
  totalTasks = 0;

  filters = {
    id: '',
    priority: '',
    completed: '',
    search: ''
  };

  constructor(
    private problemReportService: ProblemReportService,
    private modalController: ModalController,
    private errorHandler: ErrorHandlerService,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    this.loading = true;
    try {
      const filters = {
        priority: this.filters.priority,
        completed: this.filters.completed
      };

      const data = await this.problemReportService.getTasks(this.currentPage, this.itemsPerPage, filters);
      this.tasks = Array.isArray(data.tasks) ? data.tasks : [];
      this.filteredTasks = [...this.tasks];
      this.totalTasks = data.total;
      this.selectedTask = this.filteredTasks[0] ?? null;
    } catch (err) {
      this.errorHandler.showErrorMsg('Error al cargar tareas');
      this.tasks = [];
      this.filteredTasks = [];
      this.selectedTask = null;
    } finally {
      this.loading = false;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalTasks / this.itemsPerPage);
  }

  // Cambiar página
  async changePage(page: number) {
    this.currentPage = page;
    await this.loadTasks();
  }

  async applyFilters(): Promise<void> {
      const { id, priority, completed, search } = this.filters;
      const text = search.toLowerCase();

      if (id) {
          try {
              const task = await this.problemReportService.getTaskById(+id);
              this.filteredTasks = task ? [task] : [];
          } catch (error) {
              console.error('Error obteniendo tarea por ID', error);
              this.filteredTasks = [];
          }
      } else {
          // Filtros normales
          this.filteredTasks = this.tasks.filter(task => {
              const byPriority = !priority || task.Priority === priority;
              const byStatus = completed === '' || String(task.IsCompleted) === completed;
              const byName = !search || task.Name.toLowerCase().includes(text);
              return byPriority && byStatus && byName;
          });
      }

      this.selectedTask = this.filteredTasks[0] ?? null;
  }

  selectTask(task: Task): void {
    this.selectedTask = task;
    this.openEditModal(task);
  }

  async openReportModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: TaskModalComponent
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
      this.loadTasks();
    }
  }

  async openEditModal(task: Task): Promise<void> {
    const modal = await this.modalController.create({
        component: TaskModalComponent,
        componentProps: {
        mode: 'edit',
        task
        }
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data?.refresh) {
        this.loadTasks();
    }
    }

  getPriorityIcon(priority: string): string {
    return {
      low: 'information-circle-outline',
      medium: 'warning-outline',
      high: 'alert-outline'
    }[priority] ?? 'warning-outline';
  }

  getPriorityColor(priority: string): string {
    return {
      low: 'success',
      medium: 'warning',
      high: 'danger'
    }[priority] ?? 'medium';
  }

    async confirmDelete(task: Task, event: Event) {
        event.stopPropagation();

        const alert = await this.alertController.create({
            header: 'Eliminar tarea',
            message: `¿Estás seguro de que deseas eliminar "${task.Name}"?`,
            buttons: [
                { text: 'Cancelar', role: 'cancel' },
                {
                    text: 'Eliminar',
                    role: 'confirm',
                    handler: async () => {
                        this.loading = true;
                        try {
                            const res = await this.problemReportService.deleteTask(task.TaskID);

                            if (res?.success) {
                                await this.errorHandler.showSuccessMsg('Tarea eliminada correctamente');
                                this.loadTasks();
                            } else {
                                this.errorHandler.showErrorMsg(res?.message || 'Error al eliminar tarea');
                            }
                        } catch (error) {
                            console.error('Error deleting task', error);
                            this.errorHandler.showErrorMsg('No se pudo eliminar la tarea');
                        } finally {
                            this.loading = false;
                        }
                    }
                }
            ]
        });

        await alert.present();
    }

}
