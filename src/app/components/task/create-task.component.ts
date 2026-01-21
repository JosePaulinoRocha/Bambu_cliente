import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { UserSeachComponent } from '../users/user-seach.component';
import { SegmentSearchComponent } from '../catalogs/segment-search.component';
import { CategorySearchComponent } from '../catalogs/category-search.component';
import { SubcategorySearchComponent } from '../catalogs/subcategory-search.component';
import { ConceptSearchComponent } from '../catalogs/concept-search.component';
import { Segment, Category, Subcategory, Concept } from 'src/app/types/catalogs.types';
import { Task } from 'src/app/types/tasks.types';
import { User } from 'src/app/types/users.type';
import { UsersService } from 'src/app/services/users.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
    selector: 'app-create-task',
    template: `
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-button (click)="dismiss()">
                        <ion-icon name="close-outline"></ion-icon>
                    </ion-button>
                </ion-buttons>
                <ion-title>Crear Tarea</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
            <ion-list class="ion-padding-vertical">

                <!-- Tipo de tarea -->
                <ion-item>
                    <ion-label position="stacked">Tipo de tarea</ion-label>
                    <ion-segment [(ngModel)]="taskType">
                        <ion-segment-button value="simple">Simple</ion-segment-button>
                        @if(showStructuredTaskOption){
                            <ion-segment-button value="estructurada">Estructurada</ion-segment-button>
                        }
                    </ion-segment>
                </ion-item>

                <!-- Asignación -->
                <ion-item *ngIf="hierarchyId === 3">
                    <ion-label position="stacked">¿Asignar a otra persona?</ion-label>
                    <ion-toggle [(ngModel)]="assignToOther"></ion-toggle>
                </ion-item>

                <!-- Selector de usuario -->
                <ion-item *ngIf="hierarchyId === 3 && assignToOther" lines="full" class="ion-margin-bottom">
                    <ion-label position="stacked">Asignar a</ion-label>
                    <app-user-seach (userSelected)="onUserSelected($event)"></app-user-seach>
                </ion-item>

                <!-- Formulario estructurado -->
                @if(taskType === 'estructurada') {
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Título</ion-label>
                        <ion-input type="text" [(ngModel)]="title" placeholder="Ingrese el título de la tarea"></ion-input>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Segmento</ion-label>
                        <app-segment-search
                            [segmentId]="task?.SegmentID ?? null"
                            (segmentSelected)="onSegmentSelected($event)">
                        </app-segment-search>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Categoría</ion-label>
                        <app-category-search
                            [categoryId]="task?.CategoryID ?? null"
                            (categorySelected)="onCategorySelected($event)">
                        </app-category-search>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Subcategoría</ion-label>
                        <app-subcategory-search
                            [subcategoryId]="task?.SubcategoryID ?? null"
                            (subcategorySelected)="onSubcategorySelected($event)">
                        </app-subcategory-search>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Concepto</ion-label>
                        <app-concept-search
                            [conceptId]="task?.ConceptID ?? null"
                            (conceptSelected)="onConceptSelected($event)">
                        </app-concept-search>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Conclusion de finalizado</ion-label>
                        <ion-textarea [(ngModel)]="conclusionDefinition" placeholder="Ingrese la descripción de la tarea" rows="3"></ion-textarea>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Acciones</ion-label>
                        <ion-input type="text" [(ngModel)]="newAction" (keyup.enter)="addAction()" placeholder="Presiona Enter para agregar una acción"></ion-input>
                    </ion-item>
                    @if(actions.length > 0) {
                        <ion-list class="ion-margin-bottom">
                            <ion-list-header>
                                <ion-label>Acciones agregadas</ion-label>
                            </ion-list-header>
                            @for(action of actions; track action) {
                                <ion-item>
                                    <ion-label>{{action}}</ion-label>
                                    <ion-button slot="end" fill="clear" color="danger" (click)="removeAction(action)">
                                        <ion-icon name="close-circle-outline"></ion-icon>
                                    </ion-button>
                                </ion-item>
                            }
                        </ion-list>
                    }
                }

                <!-- Formulario tarea simple -->
                @if(taskType === 'simple') {
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Nombre</ion-label>
                        <ion-input type="text" [(ngModel)]="simpleName" placeholder="Nombre de la tarea simple"></ion-input>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Concepto</ion-label>
                        <app-concept-search
                            [conceptId]="task?.ConceptID ?? null"
                            [selectionMode]="useNewConcept ? 'manual' : 'catalog'"
                            [manualConcept]="useNewConcept ? initialConceptName ?? '' : ''"
                            (conceptSelected)="onConceptSelected($event)">
                        </app-concept-search>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Observaciones</ion-label>
                        <ion-textarea [(ngModel)]="simpleObservations" placeholder="Detalle u observación"></ion-textarea>
                    </ion-item>
                    <ion-item lines="full" class="ion-margin-bottom">
                        <ion-label position="stacked">Archivo</ion-label>
                        <input type="file" (change)="onFileSelected($event)" />
                    </ion-item>
                }

                <div class="ion-padding-vertical">
                    <ion-button
                        expand="block"
                        (click)="createTask()"
                        [disabled]="(taskType === 'estructurada' && !isFormValid()) || (taskType === 'simple' && !isSimpleFormValid())">
                        Crear Tarea
                    </ion-button>
                </div>
            </ion-list>
        </ion-content>
    `,
    styles: [`
        ion-item {
            --padding-start: 0;
            --inner-padding-end: 0;
        }
        ion-label[position="stacked"] {
            font-weight: 500;
            margin-bottom: 8px;
        }
        ion-list-header {
            padding-left: 0;
        }
    `],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        UserSeachComponent,
        CategorySearchComponent,
        SegmentSearchComponent,
        SubcategorySearchComponent,
        ConceptSearchComponent
    ],
    standalone: true
})
export class CreateTaskComponent implements OnInit {
    @Input() task?: Task;
    @Input() actions: string[] = [];
    @Input() mode: 'simple' | 'estructurada' = 'estructurada';
    // Opciones
    @Input() showStructuredTaskOption: boolean = true;
    @Input() description?: string;
    @Input() initialConceptName?: string;
    @Input() useNewConcept: boolean = false;
    @Input() problemId?: number;

    title: string = '';
    segmentId: string | number = '';
    categoryId: string | number = '';
    subcategoryId: string | number = '';
    conceptId: string | number = '';
    conclusionDefinition: string = '';
    // actions: string[] = [];
    newAction: string = '';
    selectedUser: any;
    hierarchyId: number = 0;
    assignToOther: boolean = false;
    taskType: 'simple' | 'estructurada' = 'estructurada';
    // Para tarea simple
    simpleName: string = '';
    simpleObservations: string = '';
    simpleFile: string = '';

    selectedFile: File | null = null;

    isNewConcept: boolean = false;
    newConceptText: string = '';


    constructor(
        private modalCtrl: ModalController,
        private usersService: UsersService,
        private tasksService: TasksService
    ) { }

    ngOnInit(): void {
        const session = JSON.parse(sessionStorage.getItem('session') || '{}');
        this.hierarchyId = session.user?.HierarchyID || 0;

        this.taskType = this.mode || 'estructurada';

        if (this.task) {
        this.autofillForm(this.task);
        }

        if (this.actions && this.actions.length > 0 && typeof this.actions[0] === 'object') {
            this.actions = this.actions.map((a: any) => a.ActionName || JSON.stringify(a));
        }

        if (this.useNewConcept && this.initialConceptName) {
            this.isNewConcept = true;
            this.newConceptText = this.initialConceptName;
        }

        console.log('Task recibida:', this.task);
        console.log('Actions recibidas:', this.actions);
    }

    autofillForm(task: Task) {
        const isSimple = !task.SegmentID || !task.CategoryID || !task.SubcategoryID;

        if (isSimple) {
            this.taskType = 'simple';
            this.simpleName = task.TaskName;
            this.conceptId = task.ConceptID || '';
            this.simpleObservations = this.description || '';
        } else {
            this.taskType = 'estructurada';
            this.title = task.TaskName;
            this.segmentId = task.SegmentID;
            this.categoryId = task.CategoryID;
            this.subcategoryId = task.SubcategoryID;
            this.conceptId = task.ConceptID || '';
            this.conclusionDefinition = '';
        }

        if (!this.actions || this.actions.length === 0) {
            this.actions = [];
        }
    }

    dismiss() {
        this.modalCtrl.dismiss();
    }

    addAction() {
        if (this.newAction.trim()) {
            this.actions.push(this.newAction.trim());
            this.newAction = '';
        }
    }

    removeAction(action: string) {
        this.actions = this.actions.filter(a => a !== action);
    }

    isFormValid(): boolean {
        return !!(
            this.title &&
            this.segmentId &&
            this.categoryId &&
            this.subcategoryId &&
            this.conceptId &&
            this.conclusionDefinition &&
            this.actions.length > 0
        );
    }

    isSimpleFormValid(): boolean {
        return !!(this.simpleName && this.conceptId && this.simpleObservations);
    }

    onSegmentSelected(segment: Segment | string | number) {
        if (typeof segment === 'string' || typeof segment === 'number') {
            this.segmentId = segment;
        } else {
            this.segmentId = segment.SegmentID;
        }
    }

    onCategorySelected(category: Category | string) {
        if (typeof category === 'string') {
            this.categoryId = category;
        } else {
            this.categoryId = category.CategoryID;
        }
    }

    onSubcategorySelected(subcategory: Subcategory | string | number) {
        if (typeof subcategory === 'string' || typeof subcategory === 'number') {
            this.subcategoryId = subcategory;
        } else {
            this.subcategoryId = subcategory.SubcategoryID;
        }
    }

    onConceptSelected(concept: Concept | string | number) {
        if (typeof concept === 'string' || typeof concept === 'number') {
            this.conceptId = concept;
        } else {
            this.conceptId = concept.ConceptID;
        }
    }

    onUserSelected(user: User) {
    this.selectedUser = {
        id: user.UserID,
    };
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.selectedFile = file; // ✅
        }
    }


    async createTask() {
        const session = JSON.parse(sessionStorage.getItem('session') || '{}');
        const currentUserId = session.user?.UserID;
        const currentUserHierarchy = session.user?.HierarchyID;

        const today = new Date();

        if (this.taskType === 'estructurada') {
            const task: any = {
                Name: this.title,
                SegmentID: this.segmentId,
                CategoryID: this.categoryId,
                SubcategoryID: this.subcategoryId,
                ConceptID: this.conceptId,
                ConclusionDefinition: this.conclusionDefinition,
                TicketStartDate: new Date(today.getTime() + 86400000).toISOString().split('T')[0],
                UserHolderID: currentUserId,
                UserHolderDate: today.toISOString().split('T')[0],
                HierarchyID: currentUserHierarchy,
                Actions: this.actions
            };

            if (this.hierarchyId === 3 && this.assignToOther && this.selectedUser?.id) {
                task.UserExecID = this.selectedUser.id;
            }

            console.log('Tarea estructurada:', task);

            try {
                await this.tasksService.createTaskTicket(task);
                this.modalCtrl.dismiss(true);
            } catch (error) {
                console.error('Error al crear tarea estructurada:', error);
            }
        }

        if (this.taskType === 'simple') {

            const simpleTask = {
                Name: this.simpleName,
                ConceptID: this.conceptId, // ✅
                Observations: this.simpleObservations,
                UserHolderID: currentUserId,
                HierarchyID: currentUserHierarchy,
                ...(this.hierarchyId === 3 && this.assignToOther && this.selectedUser?.id ? { UserExecID: this.selectedUser.id } : {})
            };

            console.log('Tarea simple:', simpleTask);

            try {
            const { TicketID } = await this.tasksService.createSimpleTicket(simpleTask);

            if (this.selectedFile && TicketID) {
                const fd = new FormData();
                fd.append('File1', this.selectedFile);

                try {
                    await this.tasksService.uploadTicketFile(TicketID, fd);
                } catch (fileError) {
                    console.error('Error al subir el archivo:', fileError);
                }
            }

            if (this.problemId && TicketID) {
                try {
                    await this.tasksService.linkTicketToProblem(this.problemId, TicketID);
                } catch (err) {
                    console.error('Error al vincular el ticket con el problema:', err);
                }
            }

            this.modalCtrl.dismiss(true);
            } catch (error) {
            console.error('Error al crear tarea simple:', error);
            }

        }
    }


}
