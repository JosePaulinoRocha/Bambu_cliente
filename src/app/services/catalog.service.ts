import { Injectable } from '@angular/core';
import { CapacitorHttp } from '@capacitor/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Catalog } from '../types/catalogs.types';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    private currentCatalogSubject = new BehaviorSubject<Catalog | null>(null);
    public currentCatalog$ = this.currentCatalogSubject.asObservable();
    
    private catalogsCache: { [key: string]: ReplaySubject<any> } = {};
    public slugs: string[] = [
        "segments",
        "categories",
        "subcategories",
        "concepts"
    ];
    
    constructor(
        private authService: AuthService,
        private errorHandler: ErrorHandlerService
    ) {}

    private getCatalogSubject(slug: string): ReplaySubject<any> {
        if (!this.catalogsCache[slug]) {
            this.catalogsCache[slug] = new ReplaySubject<any>(1);
            this.loadCatalogToCache(slug);
        }
        return this.catalogsCache[slug];
    }

    private async loadCatalogToCache(slug: string) {
        try {
            const catalog = await this.getCatalogFromApi(slug);
            this.catalogsCache[slug].next(catalog);
        } catch (error) {
            this.catalogsCache[slug].error(error);
        }
    }

    private async getCatalogFromApi(slug: string): Promise<any> {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/${slug}`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.get(options);
            return await this.errorHandler.handleErrorHttpResponse(response);
        });
    }

    getCatalog(slug: string): ReplaySubject<any> {
        return this.getCatalogSubject(slug);
    }

    async refreshCatalog(slug: string) {
        try {
            const catalog = await this.getCatalogFromApi(slug);
            this.catalogsCache[slug].next(catalog);
        } catch (error) {
            this.catalogsCache[slug].error(error);
        }
    }

    async createCatalog(slug: string, data: any) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/${slug}`,
                headers: this.authService.getAuthHeaders(),
                data: data
            };
            const response = await CapacitorHttp.post(options);
            const result = await this.errorHandler.handleErrorHttpResponse(response);
            if (result) {
                await this.refreshCatalog(slug);
            }
            return result;
        });
    }

    async updateCatalog(slug: string, id: string, data: any) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/${slug}/${id}`,
                headers: this.authService.getAuthHeaders(),
                data: data
            };
            const response = await CapacitorHttp.put(options);
            const result = await this.errorHandler.handleErrorHttpResponse(response);
            if (result) {
                await this.refreshCatalog(slug);
            }
            return result;
        });
    }

    async deleteCatalog(slug: string, id: string) {
        return this.authService.safeHttpCall(async () => {
            const options = {
                url: `${environment.apiUrl}/${slug}/${id}`,
                headers: this.authService.getAuthHeaders()
            };
            const response = await CapacitorHttp.delete(options);
            const result = await this.errorHandler.handleErrorHttpResponse(response);
            if (result) {
                await this.refreshCatalog(slug);
            }
            return result;
        });
    }
}
