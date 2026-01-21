import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

interface Task {
    id: number;
    title: string;
    owner: string;
    category: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
    completed: boolean;
}

@Component({
    selector: 'app-task-list',
    template: `
        <div class="task-list-container">
            <ion-card>
                <ion-card-header>
                    <ion-card-title>📂 Tareas pendientes en LOTE</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                    <div class="task-list">
                        <div class="task-item" 
                             *ngFor="let task of tasks" 
                             [class.completed]="task.status === 'completed'">
                            <ion-checkbox [(ngModel)]="task.completed"></ion-checkbox>
                            <div class="task-info">
                                <span class="task-title">{{task.title}}</span>
                                <span class="task-owner">{{task.owner}}</span>
                                <span class="task-category">{{task.category}}</span>
                                <span class="task-priority" [ngClass]="task.priority">
                                    {{task.priority}}
                                </span>
                            </div>
                        </div>
                    </div>
                </ion-card-content>
            </ion-card>
        </div>
    `,
    styles: [`
        .task-list-container {
            padding: 16px;
        }

        .task-list {
            min-height: 200px;
        }

        .task-item {
            display: flex;
            align-items: center;
            padding: 8px;
            margin: 4px 0;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
            cursor: move;
        }

        .task-info {
            display: flex;
            gap: 16px;
            margin-left: 8px;
        }

        .task-priority {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 0.8em;
        }

        .high {
            background-color: #ffebee;
            color: #c62828;
        }

        .medium {
            background-color: #fff3e0;
            color: #ef6c00;
        }

        .low {
            background-color: #e8f5e9;
            color: #2e7d32;
        }

        .completed {
            opacity: 0.6;
            text-decoration: line-through;
        }
    `],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        FormsModule
    ]
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [
        {
            id: 1,
            title: 'Revisar informe de ventas',
            owner: 'Juan Pérez',
            category: 'Finanzas',
            priority: 'high',
            status: 'pending',
            completed: false
        },
        {
            id: 2,
            title: 'Comprar herramientas',
            owner: 'María García',
            category: 'Compras',
            priority: 'medium',
            status: 'pending',
            completed: false
        }
    ];

    constructor() { }

    ngOnInit(): void { }

    drop(event: any): void {
        // Implementar lógica de drag and drop
        console.log('Task dropped', event);
    }
} 