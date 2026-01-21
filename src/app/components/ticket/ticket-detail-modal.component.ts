import { Component, Input } from '@angular/core';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActionStatusComponent } from '../../components/actions/action-status.component';
import { FormsModule } from '@angular/forms';
import { Tickets } from 'src/app/types/tickets.types';

@Component({
    selector: 'app-ticket-detail-modal',
    template: `
    <ion-header class="jira-modal-header">
        <ion-toolbar color="primary">
            <ion-title>Ticket #{{ ticket.TicketID }} - {{ ticket.TaskName || ticket.Issue || 'Sin título' }}</ion-title>
            <ion-buttons slot="end">
                <ion-button (click)="dismiss()">
                    <ion-icon name="close-outline"></ion-icon>
                </ion-button>
            </ion-buttons>
        </ion-toolbar>
    </ion-header>
    <ion-content class="jira-modal-content">
        <div class="jira-modal-body">
            <aside class="jira-modal-aside">
                <div class="ticket-info-block">
                    <h3>Información</h3>
                    <p><strong>Estado:</strong> <ion-badge [color]="getAuthorizationColor(ticket.AssignmentStatusName)">{{ ticket.AssignmentStatusName }}</ion-badge></p>
                    <p><strong>Solicitante:</strong> {{ ticket.UserHolderName || 'Sin asignar' }}</p>
                    <p><strong>Ejecutor:</strong> {{ ticket.UserExecName || 'Sin ejecutor' }}</p>
                    <p><strong>Fecha de creación:</strong> {{ ticket.TicketStartDate | date:'dd/MM/yyyy' }}</p>
                    <p *ngIf="ticket.Quotation"><strong>Cotización:</strong> {{ ticket.Quotation | currency:'USD':'symbol':'1.2-2' }}</p>
                    <p><strong>Observaciones:</strong> {{ ticket.Observations || 'N/A' }}</p>
                </div>
                <div class="ticket-actions-block">
                    <ion-button expand="block" color="danger" (click)="confirmDelete()">
                        <ion-icon name="trash-outline" slot="start"></ion-icon>
                        Eliminar ticket
                    </ion-button>
                </div>
            </aside>
            <main class="jira-modal-main">
                <ion-segment [(ngModel)]="tab" color="primary">
                    <ion-segment-button value="detalles">Detalles</ion-segment-button>
                    <ion-segment-button value="acciones">Tareas pendientes</ion-segment-button>
                </ion-segment>
                <div [ngSwitch]="tab" class="jira-modal-tabs">
                    <div *ngSwitchCase="'detalles'">
                        <h2>Detalles del ticket</h2>
                        <p><strong>Descripción:</strong> {{ ticket.ConclusionDefinition || ticket.Issue || 'Sin descripción' }}</p>
                        <p *ngIf="ticket.Conclusion"><strong>Conclusión:</strong> {{ ticket.Conclusion }}</p>
                        <p><strong>Fechas:</strong></p>
                        <ul>
                            <li><strong>Inicio:</strong> {{ ticket.StartDate | date:'dd/MM/yyyy HH:mm' }}</li>
                            <li><strong>Fin:</strong> {{ ticket.EndDate | date:'dd/MM/yyyy HH:mm' }}</li>
                        </ul>
                    </div>
                    <div *ngSwitchCase="'acciones'">
                        <h2>Tareas pendientes</h2>
                        <app-action-status
                            [ticketId]="ticket.TicketID"
                            [embedded]="true"
                            (allActionsCompleted)="onAllActionsCompleted()"
                        ></app-action-status>
                    </div>
                </div>
            </main>
        </div>
    </ion-content>
    `,
    styles: [`
        .jira-modal-header {
            border-bottom: 1px solid var(--ion-color-primary-shade);
        }
        .jira-modal-content {
            --background: var(--ion-color-light);
        }
        .jira-modal-body {
            display: flex;
            flex-direction: row;
            height: 100%;
            min-height: 60vh;
        }
        .jira-modal-aside {
            width: 320px;
            background: #f4f5f7;
            padding: 24px 16px;
            border-right: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }
        .ticket-info-block h3 {
            margin-top: 0;
            font-size: 1.1rem;
            color: var(--ion-color-primary);
        }
        .ticket-info-block p {
            margin: 8px 0;
            font-size: 1rem;
        }
        .ticket-actions-block {
            margin-top: auto;
        }
        .jira-modal-main {
            flex: 1;
            padding: 32px 24px;
            overflow-y: auto;
        }
        .jira-modal-tabs {
            margin-top: 24px;
        }
        ion-segment {
            margin-bottom: 16px;
        }
        @media (max-width: 900px) {
            .jira-modal-body {
                flex-direction: column;
            }
            .jira-modal-aside {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid #e0e0e0;
                flex-direction: row;
                gap: 16px;
                padding: 16px 8px;
            }
            .jira-modal-main {
                padding: 16px 8px;
            }
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule, ActionStatusComponent]
})
export class TicketDetailModalComponent {
    @Input() ticket!: Tickets;
    tab: 'detalles' | 'acciones' = 'detalles';

    constructor(private modalCtrl: ModalController, private alertCtrl: AlertController) {}

    dismiss() {
        this.modalCtrl.dismiss();
    }

    async confirmDelete() {
        const alert = await this.alertCtrl.create({
            header: 'Confirmar eliminación',
            message: '¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Eliminar',
                    role: 'destructive',
                    handler: () => {
                        if (typeof this.ticket.TicketID === 'number' && !isNaN(this.ticket.TicketID)) {
                            this.modalCtrl.dismiss({ action: 'delete', ticketId: this.ticket.TicketID! });
                        }
                    }
                }
            ]
        });
        await alert.present();
    }

    getAuthorizationColor(status: string | undefined): string {
        switch(status?.toLowerCase()) {
            case 'no asignado':
                return 'secondary';
            case 'finalizado':
                return 'success';
            case 'denegado':
                return 'danger';
            case 'pendiente':
                return 'warning';
            default:
                return 'medium';
        }
    }

    onAllActionsCompleted() {
        this.modalCtrl.dismiss({ allCompleted: true }, 'updated');
    }
} 