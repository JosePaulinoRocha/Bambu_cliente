import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './pages/login.component';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [ 
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: LoginComponent
            }
        ])
    ],
    exports: [],
    providers: [],
})
export class LoginModule {}