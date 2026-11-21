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
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  businessOutline,
  settingsOutline,
  logOutOutline,
  informationCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardContent,
    IonButton,
    IonIcon,
    IonButtons,
    IonMenuButton
  ]
})
export class ConfiguracionPage {

  nombreNegocio = 'R Y R Sánchez';
  usuario = 'Administrador (demostración)';
  version = '1.0.0';

  constructor(private router: Router) {
    addIcons({
      personCircleOutline,
      businessOutline,
      settingsOutline,
      logOutOutline,
      informationCircleOutline
    });
  }

  cerrarSesion() {
    // Navegación de demostración.
    // No existe una sesión autenticada real.
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}