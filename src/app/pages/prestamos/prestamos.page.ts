import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetButton,
  AlertButton,
  AlertInput,
  IonActionSheet,
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonFabList,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherCustomEvent,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  add,
  addCircleOutline,
  cashOutline,
  checkmarkCircleOutline,
  close,
  closeCircle,
  documentTextOutline,
  personOutline,
  removeCircleOutline,
  scanOutline,
} from 'ionicons/icons';

import { LongPressDirective } from '../../gestures/long-press.directive';
import { PinchZoomDirective } from '../../gestures/pinch-zoom.directive';
import { DatosService, Prestamo } from '../../services/datos.service';

type Filtro = 'todos' | Prestamo['estado'];

@Component({
  selector: 'app-prestamos',
  templateUrl: './prestamos.page.html',
  styleUrls: ['./prestamos.page.scss'],
  standalone: true,
  imports: [
    DecimalPipe,
    LongPressDirective,
    PinchZoomDirective,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonChip,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonBadge,
    IonProgressBar,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonIcon,
    IonFab,
    IonFabButton,
    IonFabList,
    IonModal,
    IonFooter,
    IonActionSheet,
    IonAlert,
    IonToast,
  ],
})
export class PrestamosPage {
  filtro: Filtro = 'todos';
  clienteFiltro = '';

  // Pagaré (pinch/zoom)
  pagareAbierto = false;
  prestamoPagare: Prestamo | null = null;
  nivelZoom = 1;

  // Menú contextual (long-press)
  menuAbierto = false;
  prestamoSeleccionado: Prestamo | null = null;
  botonesMenu: ActionSheetButton[] = [];

  // Nuevo préstamo
  alertaNuevoAbierta = false;
  camposNuevo: AlertInput[] = [
    { name: 'cliente', type: 'text', placeholder: 'Nombre del cliente' },
    { name: 'capital', type: 'number', placeholder: 'Capital (RD$)', min: 1 },
    { name: 'cuotas', type: 'number', placeholder: 'Número de cuotas', min: 1 },
  ];
  botonesNuevo: AlertButton[] = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Crear',
      handler: (valores: { cliente?: string; capital?: string; cuotas?: string }) => {
        const cliente = (valores.cliente ?? '').trim();
        const capital = Number(valores.capital);
        const cuotas = Math.round(Number(valores.cuotas));
        if (!cliente || !(capital > 0) || !(cuotas > 0)) {
          return false;
        }
        const nuevo = this.datos.agregarPrestamo(cliente, capital, cuotas);
        this.filtro = 'todos';
        this.avisar(`Préstamo ${nuevo.codigo} creado`);
        return true;
      },
    },
  ];

  toastAbierto = false;
  mensajeToast = '';

  constructor(
    public datos: DatosService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    addIcons({
      add,
      addCircleOutline,
      cashOutline,
      checkmarkCircleOutline,
      close,
      closeCircle,
      documentTextOutline,
      personOutline,
      removeCircleOutline,
      scanOutline,
    });

    // Filtro por cliente cuando se llega desde la pantalla de Clientes.
    this.route.queryParamMap.subscribe((params) => {
      this.clienteFiltro = params.get('cliente') ?? '';
    });
  }

  get prestamosFiltrados(): Prestamo[] {
    return this.datos.prestamos.filter(
      (p) =>
        (this.filtro === 'todos' || p.estado === this.filtro) &&
        (!this.clienteFiltro || p.cliente === this.clienteFiltro),
    );
  }

  cambiarFiltro(evento: Event): void {
    this.filtro = ((evento as CustomEvent).detail.value ?? 'todos') as Filtro;
  }

  quitarFiltroCliente(): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  colorEstado(estado: Prestamo['estado']): string {
    return estado === 'Activo' ? 'success' : estado === 'Atrasado' ? 'danger' : 'medium';
  }

  formatoMoneda(valor: number): string {
    return 'RD$ ' + valor.toLocaleString('es-DO');
  }

  /** GESTO 2 — Pull-to-refresh */
  async refrescar(evento: Event): Promise<void> {
    await this.datos.sincronizar();
    (evento as RefresherCustomEvent).target.complete();
    this.avisar('Préstamos actualizados');
  }

  registrarPago(prestamo: Prestamo): void {
    this.datos.registrarPago(prestamo.codigo);
    this.avisar(
      prestamo.estado === 'Pagado'
        ? `¡${prestamo.codigo} quedó saldado!`
        : `Cuota ${prestamo.cuotasPagadas}/${prestamo.cuotasTotales} registrada`,
    );
  }

  /** GESTO 3 — abre el pagaré para hacer pinch/zoom */
  abrirPagare(prestamo: Prestamo | null): void {
    this.prestamoPagare = prestamo;
    this.nivelZoom = 1;
    this.pagareAbierto = true;
  }

  cerrarPagare(): void {
    this.pagareAbierto = false;
  }

  /** GESTO 4 — Long-press sobre la tarjeta del préstamo */
  abrirMenuContextual(prestamo: Prestamo): void {
    this.prestamoSeleccionado = prestamo;
    const pagado = prestamo.estado === 'Pagado';
    this.botonesMenu = [
      {
        text: pagado ? 'Préstamo saldado' : 'Registrar pago',
        icon: 'checkmark-circle-outline',
        handler: () => {
          if (!pagado) {
            this.registrarPago(prestamo);
          }
        },
      },
      { text: 'Ver pagaré', icon: 'document-text-outline', handler: () => this.abrirPagare(prestamo) },
      {
        text: 'Ver solo los préstamos de ' + prestamo.cliente,
        icon: 'person-outline',
        handler: () => {
          this.router.navigate([], { relativeTo: this.route, queryParams: { cliente: prestamo.cliente }, replaceUrl: true });
        },
      },
      { text: 'Cancelar', role: 'cancel', icon: 'close' },
    ];
    this.menuAbierto = true;
  }

  private avisar(mensaje: string): void {
    this.mensajeToast = mensaje;
    this.toastAbierto = false;
    setTimeout(() => (this.toastAbierto = true));
  }
}
