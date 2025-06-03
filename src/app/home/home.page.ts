import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonRouterOutlet, IonButtons, IonText, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonButton, IonText, IonButtons, IonRouterOutlet, IonHeader, IonToolbar, IonTitle, IonContent],
})
export class HomePage {
  constructor() {}
}
