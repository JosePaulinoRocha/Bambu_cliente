import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse, Session } from '../types/auth.types';
import { ErrorHandlerService } from './error-handler.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private session: Session | null = null;
  private sessionSubject = new ReplaySubject<Session | null>(1);

  constructor(private errorHandler: ErrorHandlerService, private router: Router) {
    const savedSession = sessionStorage.getItem('session');
    if (savedSession) {
      const session = JSON.parse(savedSession);
      if (this.isTokenExpired(session.token)) {
        // Token vencido: limpiar
        this.clearSession();
      } else {
        this.setSession(session);
      }
    }
  }

  async safeHttpCall<T>(httpCall: () => Promise<T>): Promise<T> {
    try {
      return await httpCall();
    } catch (error: any) {
      if (error.status === 403) {
        this.handleAuthError(403);
      }
      throw error;
    }
  }

  handleAuthError(status: number) {
    if (status === 403) {
      this.clearSession();
      this.router.navigate(['/login']);
    }
  }

  setSession(session: Session) {
    this.session = session;
    this.sessionSubject.next(session);
    sessionStorage.setItem('session', JSON.stringify(session));
    // console.log('Session set', session);
  }

  clearSession() {
    this.session = null;
    this.sessionSubject.next(null);
    sessionStorage.removeItem('session');
  }

  getSession() {
    return this.sessionSubject.asObservable();
  }

  getCurrentSession(): Session | null {
    return this.session;
  }

  isAuthenticated(): boolean {
    return !!this.session?.token && !this.isTokenExpired(this.session.token);
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': this.session?.token ? `Bearer ${this.session.token}` : ''
    };
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch (e) {
      return true;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse | null> {
    const options = {
      url: `${environment.apiUrl}/auth`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      data: {
        email,
        password,
      },
    };

    const response = await CapacitorHttp.post(options);
    const result = await this.errorHandler.handleErrorHttpResponse(response);

    if (result) {
      const loginResponse: LoginResponse = result;
      if (loginResponse.token) {
        const session: Session = {
          token: loginResponse.token,
          user: loginResponse.user,
        };
        this.setSession(session);
      }
      return loginResponse;
    }

    return null;
  }
}
