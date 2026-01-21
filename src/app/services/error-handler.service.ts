import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ErrorHandlerService {
    constructor(
        private toastController: ToastController,
        private router: Router
    ) {}

    async handleErrorHttpResponse(response: HttpResponse): Promise<any> {
        
        if (response.status >= 200 && response.status < 300) {
            return response.data;
        }

        switch (response.status) {
            case 400:
                this.showErrorMsg('Solicitud incorrecta');
                break;
            case 401:
                localStorage.removeItem('user');
                this.router.navigate(['/login']);
                this.showErrorMsg('No tienes permisos para acceder a esta página');
                break;
            case 403:
                this.showErrorMsg('Acceso denegado');
                break;
            case 404:
                this.showErrorMsg('Recurso no encontrado');
                break;
            case 500:
                this.showErrorMsg('Error interno del servidor');
                break;
            default:
                this.showErrorMsgFromResponse(response);
        }
        
        return null;
    }   

    async showSuccessMsg(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            position: 'top',
            color: 'success'
        });
        await toast.present();
    }

    async showErrorMsg(error: any) {
        const message = error.message || 'Ha ocurrido un error';
        console.error("showErrorMsg", message);
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            position: 'top',
            color: 'danger'
        });
        await toast.present();
    }

    async showErrorMsgFromResponse(response: HttpResponse) {
        const message = response.data?.message || 'Ha ocurrido un error';
        const toast = await this.toastController.create({
            message,
            duration: 3000,
            position: 'top',
            color: 'danger'
        });
        await toast.present();
    }
}