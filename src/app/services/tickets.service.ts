import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class TicketsService {
    constructor(
        private authService: AuthService,
        private errorHandler: ErrorHandlerService
    ) { }

    async getTickets() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tasks/Tickets`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getTicketsSinAsignar() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tasks/TicketsSinAsignar`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getTicketsSinAsignarCount(): Promise<number> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/TicketsSinAsignarCount`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            const result = await this.errorHandler.handleErrorHttpResponse(response);
            return result?.total || 0;
        });
    }

    async deleteTicket(ticketId: number) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/${ticketId}`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.delete(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async updateTicketStatus(ticketId: number, status: number) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/status/${ticketId}`,
                headers: this.authService.getAuthHeaders(),
                data: { AssignmentStatusID: status }
            };
            const response = await CapacitorHttp.put(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getTicketsPendientes() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/Pendientes`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async updateTicketSchedule(ticketId: number, startDate: string, endDate: string) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/schedule/${ticketId}`,
                headers: this.authService.getAuthHeaders(),
                data: { StartDate: startDate, EndDate: endDate }
            };
            const response = await CapacitorHttp.put(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getMyPendingTickets() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/PendientesUsuario`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }
}
