import { Component } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  alertCircle,
  arrowDownOutline,
  cashOutline,
  peopleOutline,
  personAddOutline,
  timeOutline,
  trendingUpOutline,
  walletOutline,
} from 'ionicons/icons';

import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    IonFab,
    IonFabButton,
    IonFabList,
    IonToast,
  ],
})
export class DashboardPage {
  ultimaActualizacion = new Date();
  toastAbierto = false;

  constructor(
    public datos: DatosService,
    private router: Router,
  ) {
    addIcons({
      add,
      alertCircle,
      arrowDownOutline,
      cashOutline,
      peopleOutline,
      personAddOutline,
      timeOutline,
      trendingUpOutline,
      walletOutline,
    });
  }

  get prestamosEnCurso() {
    return this.datos.prestamos.filter((p) => p.estado !== 'Pagado');
  }

  async refrescar(evento: Event): Promise<void> {
    this.ultimaActualizacion = await this.datos.sincronizar();
    (evento as RefresherCustomEvent).target.complete();
    this.toastAbierto = true;
  }

  navegar(ruta: string, queryParams?: Record<string, string>): void {
    this.router.navigate([ruta], { queryParams });
  }
}
