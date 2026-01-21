import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ActionsService {
  constructor(private authService: AuthService) {}

  async getActionsByTicketId(ticketId: number) {
    return this.authService.safeHttpCall(async () => {
      const options = {
        url: `${environment.apiUrl}/tasks/ActionsByTicket/${ticketId}`,
        headers: this.authService.getAuthHeaders()
      };
      const response = await CapacitorHttp.get(options);
      return response.data;
    });
  }

  async updateMultipleActionStatus(ticketId: number, updates: { ActionsID: number, Completed: number }[]) {
    return this.authService.safeHttpCall(async () => {
      const options = {
        url: `${environment.apiUrl}/tasks/TicketActionStatus`,
        headers: this.authService.getAuthHeaders(),
        data: {
          TicketID: ticketId,
          Updates: updates
        }
      };
      const response = await CapacitorHttp.put(options);
      return response.data;
    });
  }

  async finalizeSimpleTask(ticketId: number) {
    return this.authService.safeHttpCall(async () => {
      const options = {
        url: `${environment.apiUrl}/tasks/FinalizeSimpleTask`,
        headers: this.authService.getAuthHeaders(),
        data: { TicketID: ticketId }
      };
      const response = await CapacitorHttp.put(options);
      return response.data;
    });
  }

  async getActionsByTaskId(taskId: number) {
    return this.authService.safeHttpCall(async () => {
      const options = {
        url: `${environment.apiUrl}/tasks/ActionsByTask/${taskId}`,
        headers: this.authService.getAuthHeaders()
      };
      const response = await CapacitorHttp.get(options);
      return response.data;
    });
  }
}
