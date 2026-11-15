import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonCard,
  IonCardContent,
  IonButton,
  IonBadge
} from '@ionic/angular';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonCard,
    IonCardContent,
    IonButton,
    IonBadge
  ]
})
export class ClientesPage {

  busqueda = '';

  // Datos ficticios para la actividad académica
  clientes = [
    { id: 1, nombre: 'Juan Pérez', codigo: 'CLI-001', estado: 'Activo' },
    { id: 2, nombre: 'María Rodríguez', codigo: 'CLI-002', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Martínez', codigo: 'CLI-003', estado: 'Inactivo' },
    { id: 4, nombre: 'Ana González', codigo: 'CLI-004', estado: 'Activo' }
  ];

  constructor(private router: Router) {}

  get clientesFiltrados() {
    const texto = this.busqueda.toLowerCase().trim();

    return this.clientes.filter(cliente =>
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.codigo.toLowerCase().includes(texto)
    );
  }

  buscar(evento: CustomEvent) {
    this.busqueda = String(evento.detail.value ?? '');
  }

  regresar() {
    this.router.navigateByUrl('/dashboard');
  }
}