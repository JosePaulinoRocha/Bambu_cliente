import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, ModalController } from '@ionic/angular';
import { GridModule } from '@syncfusion/ej2-angular-grids';
import { UsersService } from '../services/users.service';
import { User } from '../types/users.type';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-users',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Usuarios</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="openNewUserModal()" fill="solid" color="success">
            <ion-icon name="add-circle-outline"></ion-icon>
            Nuevo Usuario
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Usuarios del Sistema</ion-card-title>
          <ion-card-subtitle>Gestión de usuarios</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-searchbar
            [(ngModel)]="searchTerm"
            (ionChange)="filterUsers()"
            placeholder="Buscar usuarios..."
            animated>
          </ion-searchbar>

          <ion-list>
            <ion-item *ngFor="let user of filteredUsers">
              <ion-label>
                <h2>{{ user.Name }}</h2>
                <p>
                  <ion-icon name="mail-outline"></ion-icon>
                  {{ user.Email }}
                </p>
              </ion-label>

              <ion-buttons slot="end">
                <ion-button fill="clear" (click)="editUser(user)" color="primary">
                  <ion-icon name="create-outline"></ion-icon>
                </ion-button>
              </ion-buttons>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <!-- MODAL -->
    <ion-modal [isOpen]="isModalOpen" (didDismiss)="closeModal()">
      <ng-template>
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingUser ? 'Editar' : 'Nuevo' }} Usuario</ion-title>
            <ion-buttons slot="end">
              <ion-button (click)="closeModal()" color="medium">Cerrar</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Nombre</ion-label>
            <ion-input [(ngModel)]="currentUser.Name"></ion-input>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Email</ion-label>
            <ion-input type="email" [(ngModel)]="currentUser.Email"></ion-input>
          </ion-item>

          <!-- Password SOLO al crear -->
          <ng-container *ngIf="!editingUser">
            <ion-item>
              <ion-label position="stacked">Contraseña</ion-label>
              <ion-input
                type="password"
                [(ngModel)]="password">
              </ion-input>
            </ion-item>

            <ion-item>
              <ion-label position="stacked">Confirmar contraseña</ion-label>
              <ion-input
                type="password"
                [(ngModel)]="confirmPassword">
              </ion-input>
            </ion-item>
          </ng-container>

          <ion-button expand="block" color="success" (click)="saveUser()">
            {{ editingUser ? 'Actualizar' : 'Crear' }}
          </ion-button>
        </ion-content>
      </ng-template>
    </ion-modal>
  `,
  styles: [`
    ion-card {
      margin: 16px;
      border-radius: 16px;
    }
    ion-item {
      margin-bottom: 8px;
    }
  `],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class UsersComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';

  isModalOpen = false;
  editingUser: User | null = null;

  currentUser: User = {
    UserID: '',
    Name: '',
    Email: ''
  };

  password = '';
  confirmPassword = '';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  async loadUsers() {
    const users = await this.usersService.getUsers();
    this.users = users;
    this.filteredUsers = [...users];
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(u =>
      u.Name.toLowerCase().includes(term) ||
      u.Email.toLowerCase().includes(term)
    );
  }

  openNewUserModal() {
    this.editingUser = null;
    this.currentUser = { UserID: '', Name: '', Email: '' };
    this.password = '';
    this.confirmPassword = '';
    this.isModalOpen = true;
  }

  editUser(user: User) {
    this.editingUser = user;
    this.currentUser = { ...user };
    this.isModalOpen = true;
  }

  async saveUser() {
    if (!this.currentUser.Name || !this.currentUser.Email) {
      alert('Nombre y correo son obligatorios');
      return;
    }

    if (!this.editingUser) {
      if (!this.password || !this.confirmPassword) {
        alert('La contraseña es obligatoria');
        return;
      }

      if (this.password !== this.confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
      }
    }

    const payload: any = {
      Name: this.currentUser.Name,
      Email: this.currentUser.Email
    };

    if (!this.editingUser) {
      payload.Password = this.password;
      await this.usersService.createUser(payload);
    } else {
      await this.usersService.updateUser(this.currentUser.UserID, payload);
    }

    this.isModalOpen = false;
    await this.loadUsers();
  }

  closeModal() {
    this.isModalOpen = false;
    this.editingUser = null;
  }
}