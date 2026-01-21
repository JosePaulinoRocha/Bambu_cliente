export interface Problems {
    ProblemID: number;
    ProblemNature: string;
    Title: string;
    Description: string;
    PriorityID: number;
    PriorityName?: 'Low' | 'Medium' | 'High' | 'Critical';
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

export interface ProblemReportCreate {
    ProblemNature: string;
    Title: string;
    Description: string;
    PriorityID: number;
    AdditionalInfo?: string;
}
