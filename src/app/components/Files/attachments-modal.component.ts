import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ProblemReportService } from 'src/app/services/problem-report.service';

@Component({
  standalone: true,
  selector: 'app-attachments-modal',
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Archivos Adjuntos</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss()">
            <ion-icon name="close-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
        <ion-list *ngIf="attachments?.length; else noFiles">
            <ion-item *ngFor="let attachment of attachments">
            <ion-button
                fill="clear"
                slot="start"
                (click)="download(attachment.FilePath)">
                <ion-icon [name]="getFileIcon(attachment.FilePath)"></ion-icon>
            </ion-button>

            <ion-label>
                <h3>{{ attachment.FilePath.split('/').pop() }}</h3>
                <p>{{ attachment.UploadedAt | date: 'short' }}</p>
            </ion-label>
            </ion-item>
        </ion-list>

        <ng-template #noFiles>
            <ion-text color="medium">No hay archivos adjuntos</ion-text>
        </ng-template>
    </ion-content>
  `
})
export class AttachmentsModalComponent implements OnInit {
  @Input() problemID!: number;
  attachments: any[] = [];

  constructor(
    private modalCtrl: ModalController,
    private problemService: ProblemReportService
  ) {}

  async ngOnInit() {
    console.log('📦 ProblemID recibido:', this.problemID);
    this.attachments = await this.problemService.getProblemAttachments(this.problemID);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

    download(fileUrl: string) {
        const cleanFileUrl = fileUrl.replace(/^\/?root\/TicketsApp\/TicketsAppDev\/uploads\//, '');
        const baseUrl = 'https://systemabmxlifuneraria.com/tickets-uploads';
        const fullUrl = `${baseUrl}/${cleanFileUrl}`;
        window.open(fullUrl, '_blank');
    }

  getFileIcon(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'image-outline';
    if (ext === 'pdf') return 'document-outline';
    if (['doc', 'docx'].includes(ext)) return 'document-text-outline';
    if (['xls', 'xlsx'].includes(ext)) return 'grid-outline';
    return 'document-outline';
  }
}
