import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from './error-handler.service';

interface Task {
    Name: string;
    SegmentID: string | number;
    CategoryID: number | string;
    SubcategoryID: string | number;
    ConclusionDefinition: string;
    TicketStartDate: string;
    UserHolderID: number;
    UserHolderDate: string;
    HierarchyID: number;
    Actions: string[];
}

interface TaskTicket {
    TaskID: number;
    TicketID: number;
}

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    constructor(
        private authService: AuthService,
        private errorHandler: ErrorHandlerService
    ) { }

    async getTasks() {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tasks/Tasks`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async createTask(task: Task) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tasks/Tasks`,
                headers: this.authService.getAuthHeaders(),
                data: task
            };
            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async createTaskTicket(taskTicket: TaskTicket) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tasks/TaskTicket`,
                headers: this.authService.getAuthHeaders(),
                data: taskTicket
            };
            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async createSimpleTicket(data: any) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/TicketSimple`,
                headers: this.authService.getAuthHeaders(),
                data
            };
            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async uploadTicketFile(ticketId: number, formData: FormData) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/file/${ticketId}`,
                headers: {
                    ...this.authService.getAuthHeaders(),
                    'Content-Type': 'multipart/form-data'
                },
                data: formData
            };
            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async linkTicketToProblem(problemId: number, ticketId: number) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/tickets/link-ticket`,
                headers: this.authService.getAuthHeaders(),
                data: { problemId, ticketId }
            };
            const response = await CapacitorHttp.put(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

}
