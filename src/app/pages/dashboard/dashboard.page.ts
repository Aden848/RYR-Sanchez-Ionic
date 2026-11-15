import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton
  ]
})
export class DashboardPage {

  // Datos ficticios para el prototipo académico
  clientes = 25;
  prestamos = 18;
  capitalPendiente = 180000;
  interesesPendientes = 36000;

  constructor(private router: Router) {}

  navegar(ruta: string) {
    this.router.navigateByUrl(ruta);
  }

  cerrarSesion() {
    this.router.navigateByUrl('/home');
  }
}