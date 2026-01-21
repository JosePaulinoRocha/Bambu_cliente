import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/types/users.type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-user-seach',
    template: `
        <ion-select
            [(ngModel)]="selectedUser"
            (ionChange)="onUserSelect($event)"
            interface="popover"
            placeholder="Buscar usuario..."
        >
            <ion-select-option *ngFor="let user of users" [value]="user">
                <div class="user-option" [class.current-user]="isCurrentUser(user)">
                    <ion-icon name="person-circle-outline"></ion-icon>
                    <span class="user-name">{{ user.Name }}</span>
                    <ion-badge *ngIf="isCurrentUser(user)" color="success"> - (Tú)</ion-badge>
                </div>
            </ion-select-option>
        </ion-select>
    `,
    styles: [`
        ion-item {
            --padding-start: 0;
            --inner-padding-end: 0;
            --background: transparent;
        }

        ion-label {
            font-weight: 500;
            color: var(--ion-color-dark);
        }

        ion-select {
            width: 100%;
            max-width: 100%;
            --padding-start: 16px;
            --padding-end: 16px;
            --background: var(--ion-color-light);
            --border-radius: 8px;
            --placeholder-color: var(--ion-color-medium);
            --placeholder-opacity: 1;
        }

        .user-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 0;
        }

        ion-icon {
            font-size: 20px;
            color: var(--ion-color-medium);
        }

        .user-name {
            flex: 1;
            font-size: 14px;
        }

        ion-badge {
            font-size: 10px;
            padding: 4px 6px;
        }

        ::ng-deep .select-interface-option {
            --color: var(--ion-color-dark);
            --background: var(--ion-color-light);
        }

        ::ng-deep .select-interface-option:hover {
            --background: var(--ion-color-light-shade);
        }

        ::ng-deep .select-interface-option[aria-disabled="true"] {
            --background: var(--ion-color-primary-tint);
            --color: var(--ion-color-primary-contrast);
        }
        .current-user {
            background-color: var(--ion-color-primary-tint);
            color: var(--ion-color-primary-contrast);
        }
    `],
    standalone: true,
    imports: [IonicModule, CommonModule, FormsModule]
})
export class UserSeachComponent implements OnInit {
    users: User[] = [];
    selectedUser: User | null = null;
    currentUser: User | null = null;
    @Output() userSelected = new EventEmitter<User>();
    constructor(
        private usersService: UsersService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
        this.subscribeToCurrentUser();
    }

    private subscribeToCurrentUser() {
        this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
        });
    }

    async loadUsers() {
        try {
            this.users = await this.usersService.getUsers();
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    isCurrentUser(user: User): boolean {
        return this.currentUser?.UserID === user.UserID;
    }

    onUserSelect(event: any) {
        const selectedUser = event.detail.value;
        // Aquí puedes emitir el usuario seleccionado para asignar tareas o tickets
        // console.log('Usuario seleccionado:', selectedUser);
        this.userSelected.emit(selectedUser);
    }
}
