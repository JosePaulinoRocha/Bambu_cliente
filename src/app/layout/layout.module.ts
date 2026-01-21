import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from '../pages/dashboard.component';
import { KanbanComponent } from '@syncfusion/ej2-angular-kanban';
import { MenuComponent } from './components/menu.component';
import { UsersComponent } from '../pages/users.component';
import { ProblemsManagementComponent } from '../pages/problems-management.component';
import { ButtonMenuComponent } from './components/button-menu.component';

@NgModule({
    declarations: [
        LayoutComponent,
        ButtonMenuComponent
    ],
    imports: [ 
        CommonModule,
        IonicModule,
        MenuComponent,
        RouterModule.forChild([
            {
                path: '',
                component: LayoutComponent,
                children: [
                    {
                      path: 'home',
                      component: DashboardComponent
                    },
                    {
                      path: 'agenda',
                      component: DashboardComponent
                    },
                    {
                      path: 'autorizaciones',
                      component: DashboardComponent 
                    },
                    {
                      path: 'historial',
                      component: DashboardComponent 
                    },
                    {
                      path: 'users',
                      component: UsersComponent
                    },
                    {
                      path: 'problems',
                      component: ProblemsManagementComponent
                    }
                  ]
            }
        ])

    ],
    exports: [],
    providers: [],
})
export class LayoutModule {}