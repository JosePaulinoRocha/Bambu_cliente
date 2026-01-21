import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-avatar',
    template: `
        <ion-avatar [style.background-color]="backgroundColor">
            <span class="initials">{{ initials }}</span>
        </ion-avatar>
    `,
    styles: [`
        ion-avatar {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 50px;
            height: 50px;
        }

        .initials {
            color: white;
            font-weight: 600;
            font-size: 1.2rem;
            text-transform: uppercase;
        }
    `],
    standalone: true,
    imports: [
        IonicModule,
        CommonModule
    ]
})
export class AvatarComponent {
    @Input() name: string = '';
    @Input() backgroundColor: string = '#3880ff';

    get initials(): string {
        if (!this.name) return '';
        return this.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
}
