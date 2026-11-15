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
  IonBadge,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonBadge,
    IonButton
  ]
})
export class PrestamosPage {

  // Información ficticia para el prototipo académico
  prestamos = [
    {
      codigo: 'PRE-001',
      cliente: 'Juan Pérez',
      capital: 10000,
      intereses: 2000,
      estado: 'Activo'
    },
    {
      codigo: 'PRE-002',
      cliente: 'María Rodríguez',
      capital: 15000,
      intereses: 3000,
      estado: 'Activo'
    },
    {
      codigo: 'PRE-003',
      cliente: 'Carlos Martínez',
      capital: 8000,
      intereses: 0,
      estado: 'Pagado'
    }
  ];

  constructor(private router: Router) {}

  regresar() {
    this.router.navigateByUrl('/dashboard');
  }

  formatoMoneda(valor: number): string {
    return 'RD$ ' + valor.toLocaleString('es-DO');
  }
}
