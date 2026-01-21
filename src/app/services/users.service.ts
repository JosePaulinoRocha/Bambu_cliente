import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Subscription, BehaviorSubject } from 'rxjs';
import { User } from '../types/users.type';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private currentUserSubject = new BehaviorSubject<User | any | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();
    private sessionSubscription: Subscription | null = null;

    constructor(private authService: AuthService) {
        this.initializeUser();
    }

    private initializeUser() {
        this.sessionSubscription = this.authService.getSession().subscribe((session) => {
            this.currentUserSubject.next(session?.user || null);
        });
    }

    userIsCurrent(user: any) {
        return user.UserID === this.currentUserSubject.value?.UserID;
    }

    ngOnDestroy() {
        if (this.sessionSubscription) {
            this.sessionSubscription.unsubscribe();
        }
    }

    async getUsers() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/users`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return response.data;
        });
    }

    async createUser(data: Partial<User>) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/users`,
                headers: this.authService.getAuthHeaders(),
                data: data
            };
            const response = await CapacitorHttp.post(options);
            return response.data;
        });
    }

    async updateUser(id: string, data: Partial<User>) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/users/${id}`,
                headers: this.authService.getAuthHeaders(),
                data: data
            };
            const response = await CapacitorHttp.put(options);
            return response.data;
        });
    }

    async deleteUser(id: string) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/users/${id}`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.delete(options);
            return response.data;
        });
    }
}
