import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogService } from 'src/app/services/catalog.service';
import { Segment } from 'src/app/types/catalogs.types';

@Component({
    selector: 'app-segment-search',
    standalone: true,
    template: `
        <ion-item lines="none" class="compact-item">
            <ion-label class="compact-label">Selección</ion-label>
            <ion-segment [(ngModel)]="selectionMode" (ionChange)="onModeChange()" class="compact-segment">
                <ion-segment-button value="catalog" class="compact-segment-button">
                    <ion-label>Catálogo</ion-label>
                </ion-segment-button>
                <ion-segment-button value="manual" class="compact-segment-button">
                    <ion-label>Nuevo</ion-label>
                </ion-segment-button>
            </ion-segment>
        </ion-item>

        <ion-item *ngIf="selectionMode === 'catalog'" class="compact-item">
            <ion-label position="stacked" class="compact-label">Segmento</ion-label>
            <ion-select
                [(ngModel)]="selectedSegment"
                (ionChange)="onSegmentSelect($event)"
                interface="popover"
                placeholder="Seleccionar segmento"
                class="compact-select"
            >
                <ion-select-option *ngFor="let segment of segments" [value]="segment">
                    <div class="category-option">
                        <ion-icon name="grid-outline"></ion-icon>
                        <span class="category-name">{{ segment.Name }}</span>
                    </div>
                </ion-select-option>
            </ion-select>
        </ion-item>

        <ion-item *ngIf="selectionMode === 'manual'" class="compact-item">
            <ion-label position="stacked" class="compact-label">Nuevo segmento</ion-label>
            <ion-input
                type="text"
                [(ngModel)]="manualSegment"
                (ionInput)="onManualInputChange()"
                placeholder="Escribe el nombre"
                class="compact-input"
            ></ion-input>
        </ion-item>
    `,
    styles: [`
        .compact-item {
            --padding-start: 8px;
            --padding-end: 8px;
            --inner-padding-end: 0px;
            --min-height: 40px;
        }

        .compact-label {
            font-size: 13px;
            margin-bottom: 2px;
        }

        .compact-segment {
            height: 40px;
            --indicator-height: 2px;
            --border-radius: 6px;
        }

        .compact-segment-button {
            --padding-top: 4px;
            --padding-bottom: 4px;
            font-size: 12px;
        }

        .compact-select {
            --padding-top: 4px;
            --padding-bottom: 4px;
            font-size: 14px;
        }

        .compact-input {
            font-size: 14px;
            --padding-top: 4px;
            --padding-bottom: 4px;
        }

        .category-option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 2px 0;
        }

        ion-icon {
            font-size: 18px;
            color: var(--ion-color-medium);
        }

        .category-name {
            flex: 1;
            font-size: 13px;
        }
    `],
    imports: [IonicModule, CommonModule, FormsModule]
})
export class SegmentSearchComponent implements OnInit {
    @Input() segmentId: number | null = null;

    segments: Segment[] = [];
    selectedSegment: Segment | null = null;
    manualSegment: string = '';
    selectionMode: 'catalog' | 'manual' = 'catalog';

    @Output() segmentSelected = new EventEmitter<Segment | string>();

    constructor(private catalogService: CatalogService) {}

    ngOnInit(): void {
        this.catalogService.getCatalog('segments').subscribe({
            next: (data: Segment[]) => {
            this.segments = data;

            if (this.segmentId !== null) {
                const found = this.segments.find(s => s.SegmentID === this.segmentId);
                if (found) {
                this.selectedSegment = found;
                this.selectionMode = 'catalog';
                this.segmentSelected.emit(found);
                } else {
                console.warn(`Segmento con ID ${this.segmentId} no encontrado.`);
                }
            }
            },
            error: (err) => console.error('Error loading segments:', err)
        });
    }


    onModeChange() {
        if (this.selectionMode === 'catalog' && this.selectedSegment) {
            this.segmentSelected.emit(this.selectedSegment);
        } else if (this.selectionMode === 'manual' && this.manualSegment.trim()) {
            this.segmentSelected.emit(this.manualSegment.trim());
        }
    }

    onSegmentSelect(event: any) {
        this.segmentSelected.emit(event.detail.value);
    }

    onManualInputChange() {
        if (this.selectionMode === 'manual') {
            this.segmentSelected.emit(this.manualSegment.trim());
        }
    }
}
