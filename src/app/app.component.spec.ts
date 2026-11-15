import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton
  ],
})
export class HomePage {

  usuario: string = '';
  contrasena: string = '';
  mensaje: string = '';

  iniciarSesion() {

    if (!this.usuario.trim() || !this.contrasena.trim()) {
      this.mensaje = 'Debes completar todos los campos.';
      return;
    }

    this.mensaje = 'Inicio de sesión de demostración.';

  }

}