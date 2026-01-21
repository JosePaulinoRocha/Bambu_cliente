// src/app/services/notifications.service.ts
import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class NotificationsService {
    constructor(private authService: AuthService) {}

    async getOverdueTicketsCount(): Promise<number> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/notifications/overdue-tickets`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return response.data.total || 0;
        });
    }

    async getPendingTicketsCount(): Promise<number> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/notifications/pending-tickets`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return response.data.total || 0;
        });
    }

    async getCompletedTicketsCount(): Promise<number> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/notifications/completed-tickets`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return response.data.total || 0;
        });
    }
}
