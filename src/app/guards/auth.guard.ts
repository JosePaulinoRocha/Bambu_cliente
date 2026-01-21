import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): Promise<boolean | UrlTree> | boolean | UrlTree {
    const session = this.authService.getCurrentSession();
    if (!session?.token) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
} 