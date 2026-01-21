import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AvatarComponent } from '../../components/ui/avatar.component';
import { User } from '../../types/users.type';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { IonicModule } from '@ionic/angular';
@Component({
    selector: 'app-user-avatar',
    template: `
    <div class="user-avatar">
        <app-avatar [name]="currentUser?.Name || ''" [backgroundColor]="'#3880ff'"></app-avatar>
        <div class="user-info" [class.collapsed]="isCollapsed">
            <h2>{{ currentUser?.Name || '' }}</h2>
            <p>{{ currentUser?.Email || '' }}</p>
            <div class="separator"></div>
        </div>
    </div>
    `,
    styles: [`
        .user-avatar {
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            border-bottom: 1px solid var(--ion-color-light);
            background: white;
        }

        .user-info {
            flex: 1;
            min-width: 0;
            transition: all 0.3s ease;
            
            &.collapsed {
                opacity: 0;
                width: 0;
                overflow: hidden;
            }

            h2 {
                margin: 0 0 4px 0;
                font-size: 1rem;
                font-weight: 600;
                color: var(--ion-color-dark);
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            p {
                margin: 0;
                font-size: .85rem;
                color: var(--ion-color-medium);
                line-height: 1.4;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .separator {
                margin: 8px 0;
                border: none;
                border-top: 1px dashed var(--ion-color-light-shade);
                opacity: 0.5;
            }

            ion-badge {
                --padding-start: 8px;
                --padding-end: 8px;
                --padding-top: 4px;
                --padding-bottom: 4px;
                font-size: 0.75rem;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
        }
    `],
    imports: [AvatarComponent, IonicModule],
})
export class UserAvatarComponent implements OnInit, OnDestroy {
    currentUser: User | null = null;
    @Input() isCollapsed: boolean = false;
    private userSubscription: Subscription | null = null;

    constructor(private usersService: UsersService) {}

    ngOnInit(): void {
        this.userSubscription = this.usersService.currentUser$.subscribe(user => {
            this.currentUser = user;
            // console.log("Current user", this.currentUser);
        });
    }

    ngOnDestroy(): void {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    }
}
