import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonApp,
  IonBadge,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  gridOutline,
  logOutOutline,
  peopleOutline,
  personCircleOutline,
  settingsOutline,
} from 'ionicons/icons';
import { filter } from 'rxjs';

import { DatosService } from './services/datos.service';

interface OpcionMenu {
  titulo: string;
  url: string;
  icono: string;
  contador?: () => number;
}

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonContent,
    IonFooter,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonBadge,
    IonRouterOutlet,
  ],
})
export class AppComponent {
  /** El menú no se muestra en la pantalla de inicio de sesión. */
  mostrarMenu = false;

  opciones: OpcionMenu[] = [
    { titulo: 'Panel principal', url: '/dashboard', icono: 'grid-outline' },
    { titulo: 'Clientes', url: '/clientes', icono: 'people-outline', contador: () => this.datos.clientes.length },
    { titulo: 'Préstamos', url: '/prestamos', icono: 'cash-outline', contador: () => this.datos.prestamosActivos },
    { titulo: 'Configuración', url: '/configuracion', icono: 'settings-outline' },
  ];

  constructor(
    private router: Router,
    private datos: DatosService,
  ) {
    addIcons({ gridOutline, peopleOutline, cashOutline, settingsOutline, logOutOutline, personCircleOutline });

    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      const ruta = e.urlAfterRedirects;
      this.mostrarMenu = !(ruta === '/' || ruta.startsWith('/home'));
    });
  }

  cerrarSesion(): void {
    // Navegación de demostración: no hay una sesión autenticada real.
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }
}
