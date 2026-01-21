import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  template: `
  <ion-content [fullscreen]="true">
    <div class="login-container">
      <div class="pattern-background">
      </div>
      <div class="login-content">
        <div class="login-card">
          <div class="login-header">
            <div class="logo-container">
              <img src="assets/logo.png" alt="Logo" class="logo">
              <h1 class="app-title">Sistema de Gestion de Tareas</h1>
            </div>
            <h2 class="subtitle">Bienvenido</h2>
            <p>Inicia sesión para continuar</p>
          </div>
          
          <form (ngSubmit)="onSubmit()" class="login-form">
            <div class="form-group">
              <ion-item>
                <ion-label position="floating">Correo electrónico</ion-label>
                <ion-input type="email" [(ngModel)]="email" name="email" required></ion-input>
              </ion-item>
            </div>
            
            <div class="form-group">
              <ion-item>
                <ion-label position="floating">Contraseña</ion-label>
                <ion-input type="password" [(ngModel)]="password" name="password" required></ion-input>
              </ion-item>
            </div>
            
            <div class="form-footer">
              <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
            </div>
            
            <ion-button expand="block" type="submit" class="login-button">
              Iniciar sesión
            </ion-button>
          </form>
        </div>
      </div>
    </div>
  </ion-content>
  `,
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.login(this.email, this.password).then((response) => {
      if (response?.token) {
        this.router.navigate(['/home']);
      } else {
        console.error('Error en el login:', response);
      }
    }).catch(error => {
      console.error('Error en la petición:', error);
    });
  }
} 