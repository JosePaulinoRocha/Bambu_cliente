import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { ErrorHandlerService } from './error-handler.service';
import { ProblemReportCreate } from 'src/app/types/problems'; 

export interface ProblemReport {
    ProblemID: number;
    ProblemNature: string;
    Title: string;
    Description: string;
    PriorityID: number;
    PriorityName?: 'Baja' | 'Media' | 'Alta' | 'Critica';
    AdditionalInfo?: string;
    CreatedAt: string;
    StatusID?: number;
    StatusName?: 'Pendiente' | 'En Progreso' | 'Finalizado' | 'Denegado' | 'Retraso' | 'No Asignado';
    TaskID?: number | null;
    TicketID?: number | null;
    ReportedBy?: number | null;
    Attachments?: {
        AttachmentID: number;
        FilePath: string;
        UploadedAt: string;
    }[];
}

export interface ProblemReportResponse {
    success: boolean;
    message: string;
    taskId?: number;
    ticketId?: number;
    problemId?: number;
}

@Injectable({
    providedIn: 'root'
})
export class ProblemReportService {
    private readonly allowedStatuses = [
        'Pendiente', 'En Progreso', 'Finalizado', 'Denegado', 'Retraso', 'No Asignado'
    ] as const;

    constructor(
        private authService: AuthService,
        private errorHandler: ErrorHandlerService
    ) { }

    async updateProblemReportStatus(problemId: number, status: string): Promise<boolean> {
        try {
            this.updateProblemReportStatusLocally(problemId, status);
            return true;
        } catch (error) {
            console.error('Error al actualizar estado del reporte:', error);
            return false;
        }
    }

    private saveProblemReportLocally(report: ProblemReport) {
        const reports = this.getProblemReportsLocally();
        reports.unshift(report);

        if (reports.length > 50) {
            reports.splice(50);
        }
        localStorage.setItem('problemReports', JSON.stringify(reports));
    }

    private getProblemReportsLocally(): ProblemReport[] {
        const stored = localStorage.getItem('problemReports');
        if (stored) {
            const reports = JSON.parse(stored);
            return reports.map((report: any) => ({
                ...report,
                createdAt: new Date(report.createdAt)
            }));
        }
        return [];
    }

    private updateProblemReportStatusLocally(problemId: number, status: string) {
        const reports: ProblemReport[] = this.getProblemReportsLocally();

        if (!this.allowedStatuses.includes(status as any)) {
            console.warn(`Estado no válido: ${status}`);
            return;
        }

        const reportIndex = reports.findIndex(r => r.ProblemID === problemId);
        if (reportIndex !== -1) {
            reports[reportIndex].StatusName = status as typeof this.allowedStatuses[number];
            localStorage.setItem('problemReports', JSON.stringify(reports));
        }
    }

    async createProblem(problem: ProblemReportCreate): Promise<ProblemReportResponse> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/problems`,
                headers: this.authService.getAuthHeaders(),
                data: problem
            };
            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async uploadProblemFiles(problemId: number, files: File[]): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const formData = new FormData();
            files.forEach(file => formData.append('files', file));

            const options = {
                url: `${environment.apiUrl}/problems/upload/${problemId}`,
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

    async getProblemReports(): Promise<ProblemReport[]> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/problems`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getProblemAttachments(problemId: number): Promise<any[]> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/problems/attachments/${problemId}`,
                headers: this.authService.getAuthHeaders()
            };

            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }


    async createTask(task: {
        name: string;
        priority: 'low' | 'medium' | 'high';
        isCompleted: boolean;
        }): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const options = {
            url: `${environment.apiUrl}/problems/`,
            headers: this.authService.getAuthHeaders(),
            data: task
            };

            const response = await CapacitorHttp.post(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getTasks(page = 1, limit = 10, filters: { priority?: string; completed?: string } = {}): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const params: string[] = [`page=${page}`, `limit=${limit}`];
            if (filters.priority) params.push(`priority=${filters.priority}`);
            if (filters.completed !== undefined) params.push(`completed=${filters.completed}`);

            const options = {
            url: `${environment.apiUrl}/problems/?${params.join('&')}`,
            headers: this.authService.getAuthHeaders()
            };

            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async updateTask(
        taskID: number,
        task: {
            name: string;
            priority: 'low' | 'medium' | 'high';
            isCompleted: boolean;
        }
        ): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const options = {
            url: `${environment.apiUrl}/problems/${taskID}`,
            headers: this.authService.getAuthHeaders(),
            data: task
            };

            const response = await CapacitorHttp.patch(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async deleteTask(taskID: number): Promise<any> {
        return this.authService.safeHttpCall(async () => {
        const options = {
            url: `${environment.apiUrl}/problems/${taskID}`,
            headers: this.authService.getAuthHeaders()
        };
        const response = await CapacitorHttp.delete(options);
        return this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    async getTaskById(taskID: number): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/problems/${taskID}`,
                headers: this.authService.getAuthHeaders()
            };

            const response = await CapacitorHttp.get(options);
            const data = await this.errorHandler.handleErrorHttpResponse(response);

            if (!data?.success) {
                throw new Error(data?.message || 'No se pudo obtener la tarea');
            }

            return data.task; 
        });
    }


}