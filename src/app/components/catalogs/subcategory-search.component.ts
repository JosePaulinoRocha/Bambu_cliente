import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogService } from 'src/app/services/catalog.service';
import { Subcategory } from 'src/app/types/catalogs.types';

@Component({
    selector: 'app-subcategory-search',
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
            <ion-label position="stacked" class="compact-label">Subcategoría</ion-label>
            <ion-select
                [(ngModel)]="selectedSubcategory"
                (ionChange)="onSubcategorySelect($event)"
                interface="popover"
                placeholder="Seleccionar subcategoría"
                class="compact-select"
            >
                <ion-select-option *ngFor="let subcategory of subcategories" [value]="subcategory">
                    <div class="category-option">
                        <ion-icon name="layers-outline"></ion-icon>
                        <span class="category-name">{{ subcategory.Name }}</span>
                    </div>
                </ion-select-option>
            </ion-select>
        </ion-item>

        <ion-item *ngIf="selectionMode === 'manual'" class="compact-item">
            <ion-label position="stacked" class="compact-label">Nueva subcategoría</ion-label>
            <ion-input
                type="text"
                [(ngModel)]="manualSubcategory"
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
export class SubcategorySearchComponent implements OnInit {
    @Input() subcategoryId: number | null = null;
    subcategories: Subcategory[] = [];
    selectedSubcategory: Subcategory | null = null;
    manualSubcategory: string = '';
    selectionMode: 'catalog' | 'manual' = 'catalog';

    @Output() subcategorySelected = new EventEmitter<Subcategory | string>();

    constructor(private catalogService: CatalogService) {}

    ngOnInit(): void {
        this.catalogService.getCatalog('subcategories').subscribe({
            next: (data: Subcategory[]) => {
                this.subcategories = data;

                if (this.subcategoryId !== null) {
                    const found = this.subcategories.find(s => s.SubcategoryID === this.subcategoryId);
                    if (found) {
                        this.selectedSubcategory = found;
                        this.selectionMode = 'catalog';
                        this.subcategorySelected.emit(found);
                    } else {
                        console.warn(`Subcategoría con ID ${this.subcategoryId} no encontrada.`);
                    }
                }
            },
            error: (err) => console.error('Error loading subcategories:', err)
        });
    }

    onModeChange() {
        if (this.selectionMode === 'catalog' && this.selectedSubcategory) {
            this.subcategorySelected.emit(this.selectedSubcategory);
        } else if (this.selectionMode === 'manual' && this.manualSubcategory.trim()) {
            this.subcategorySelected.emit(this.manualSubcategory.trim());
        }
    }

    onSubcategorySelect(event: any) {
        this.subcategorySelected.emit(event.detail.value);
    }

    onManualInputChange() {
        if (this.selectionMode === 'manual') {
            this.subcategorySelected.emit(this.manualSubcategory.trim());
        }
    }
}
