import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CatalogService } from 'src/app/services/catalog.service';
import { Category } from 'src/app/types/catalogs.types';

@Component({
    selector: 'app-category-search',
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
            <ion-label position="stacked" class="compact-label">Categoría</ion-label>
            <ion-select
                [(ngModel)]="selectedCategory"
                (ionChange)="onCategorySelect($event)"
                interface="popover"
                placeholder="Seleccionar categoría"
                class="compact-select"
            >
                <ion-select-option *ngFor="let category of categories" [value]="category">
                    <div class="category-option">
                        <ion-icon name="pricetag-outline"></ion-icon>
                        <span class="category-name">{{ category.Name }}</span>
                    </div>
                </ion-select-option>
            </ion-select>
        </ion-item>

        <ion-item *ngIf="selectionMode === 'manual'" class="compact-item">
            <ion-label position="stacked" class="compact-label">Nueva categoría</ion-label>
            <ion-input
                type="text"
                [(ngModel)]="manualCategory"
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
export class CategorySearchComponent implements OnInit {
    @Input() categoryId: number | null = null;

    categories: Category[] = [];
    selectedCategory: Category | null = null;
    manualCategory: string = '';
    selectionMode: 'catalog' | 'manual' = 'catalog';

    @Output() categorySelected = new EventEmitter<Category | string>();

    constructor(private catalogService: CatalogService) {}

    ngOnInit(): void {
        this.catalogService.getCatalog('categories').subscribe({
            next: (data: Category[]) => {
                this.categories = data;

                if (this.categoryId !== null) {
                    const found = this.categories.find(c => c.CategoryID === this.categoryId);
                    if (found) {
                        this.selectedCategory = found;
                        this.selectionMode = 'catalog';
                        this.categorySelected.emit(found);
                    } else {
                        console.warn(`Categoría con ID ${this.categoryId} no encontrada.`);
                    }
                }
            },
            error: (err) => {
                console.error('Error loading categories:', err);
            }
        });
    }

    onModeChange() {
        if (this.selectionMode === 'catalog' && this.selectedCategory) {
            this.categorySelected.emit(this.selectedCategory);
        } else if (this.selectionMode === 'manual' && this.manualCategory.trim()) {
            this.categorySelected.emit(this.manualCategory.trim());
        }
    }

    onCategorySelect(event: any) {
        const selected = event.detail.value;
        this.categorySelected.emit(selected);
    }

    onManualInputChange() {
        if (this.selectionMode === 'manual') {
            this.categorySelected.emit(this.manualCategory.trim());
        }
    }
}
