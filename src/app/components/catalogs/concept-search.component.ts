import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogService } from 'src/app/services/catalog.service';
import { Concept } from 'src/app/types/catalogs.types';

@Component({
    selector: 'app-concept-search',
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
            <ion-label position="stacked" class="compact-label">Concepto</ion-label>
            <ion-select
                [(ngModel)]="selectedConcept"
                (ionChange)="onConceptSelect($event)"
                interface="popover"
                placeholder="Seleccionar concepto"
                class="compact-select"
            >
                <ion-select-option *ngFor="let concept of concepts" [value]="concept">
                    <div class="category-option">
                        <ion-icon name="bulb-outline"></ion-icon>
                        <span class="category-name">{{ concept.Name }}</span>
                    </div>
                </ion-select-option>
            </ion-select>
        </ion-item>

        <ion-item *ngIf="selectionMode === 'manual'" class="compact-item">
            <ion-label position="stacked" class="compact-label">Nuevo concepto</ion-label>
            <ion-input
                type="text"
                [(ngModel)]="manualConcept"
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
export class ConceptSearchComponent implements OnInit {
    @Input() conceptId: number | null = null;
    @Input() manualConcept: string = '';
    @Input() selectionMode: 'catalog' | 'manual' = 'catalog';

    concepts: Concept[] = [];
    selectedConcept: Concept | null = null;
    // manualConcept: string = '';
    // selectionMode: 'catalog' | 'manual' = 'catalog';

    @Output() conceptSelected = new EventEmitter<Concept | string>();

    constructor(private catalogService: CatalogService) {}

    ngOnInit(): void {
        this.loadConcepts();

        if (this.selectionMode === 'manual' && this.manualConcept) {
            this.manualConcept = this.manualConcept.trim();
            this.conceptSelected.emit(this.manualConcept);
        }
    }

    private loadConcepts() {
        this.catalogService.getCatalog('concepts').subscribe({
            next: (data: Concept[]) => {
                this.concepts = data;
                if (this.conceptId !== null) {
                    const match = data.find(c => c.ConceptID === this.conceptId);
                    if (match) {
                        this.selectedConcept = match;
                        this.conceptSelected.emit(this.selectedConcept);
                    }
                }
            },
            error: (err) => {
                console.error('Error loading concepts:', err);
            }
        });
    }

    onModeChange() {
        if (this.selectionMode === 'catalog' && this.selectedConcept) {
            this.conceptSelected.emit(this.selectedConcept);
        } else if (this.selectionMode === 'manual' && this.manualConcept.trim()) {
            this.conceptSelected.emit(this.manualConcept.trim());
        }
    }

    onConceptSelect(event: any) {
        const selected = event.detail.value;
        this.conceptSelected.emit(selected);
    }

    onManualInputChange() {
        if (this.selectionMode === 'manual') {
            this.conceptSelected.emit(this.manualConcept.trim());
        }
    }
}
