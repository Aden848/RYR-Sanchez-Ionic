import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetButton,
  AlertButton,
  AlertInput,
  IonActionSheet,
  IonAlert,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonTitle,
  IonToast,
  IonToolbar,
  RefresherCustomEvent,
  ToastButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  callOutline,
  cashOutline,
  close,
  handLeftOutline,
  personAddOutline,
  swapHorizontalOutline,
  trashOutline,
} from 'ionicons/icons';

import { LongPressDirective } from '../../gestures/long-press.directive';
import { Cliente, DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [
    DatePipe,
    LongPressDirective,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonRefresher,
    IonRefresherContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonItem,
    IonLabel,
    IonBadge,
    IonIcon,
    IonFab,
    IonFabButton,
    IonActionSheet,
    IonAlert,
    IonToast,
  ],
})
export class ClientesPage {
  busqueda = '';
  ultimaActualizacion = new Date();

  // Menú contextual (long-press)
  menuAbierto = false;
  clienteSeleccionado: Cliente | null = null;
  botonesMenu: ActionSheetButton[] = [];

  // Alerta "Nuevo cliente"
  alertaNuevoAbierta = false;
  camposNuevo: AlertInput[] = [
    { name: 'nombre', type: 'text', placeholder: 'Nombre completo' },
    { name: 'telefono', type: 'tel', placeholder: 'Teléfono (809-555-0000)' },
  ];
  botonesNuevo: AlertButton[] = [
    { text: 'Cancelar', role: 'cancel' },
    {
      text: 'Guardar',
      handler: (valores: { nombre?: string; telefono?: string }) => {
        const nombre = (valores.nombre ?? '').trim();
        if (!nombre) {
          return false; // mantiene abierta la alerta si falta el nombre
        }
        const nuevo = this.datos.agregarCliente(nombre, (valores.telefono ?? '').trim() || 'Sin teléfono');
        this.mostrarToast(`Cliente ${nuevo.codigo} agregado`);
        return true;
      },
    },
  ];

  // Toast con opción de deshacer
  toast: { abierto: boolean; mensaje: string; botones: ToastButton[] } = {
    abierto: false,
    mensaje: '',
    botones: [],
  };

  constructor(
    public datos: DatosService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    addIcons({
      callOutline,
      cashOutline,
      close,
      handLeftOutline,
      personAddOutline,
      swapHorizontalOutline,
      trashOutline,
    });

    // Si se llega desde el botón FAB del Panel ("Nuevo cliente"), abrir la alerta.
    this.route.queryParamMap.subscribe((params) => {
      if (params.get('nuevo') === 'si') {
        this.alertaNuevoAbierta = true;
        this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
      }
    });
  }

  get clientesFiltrados(): Cliente[] {
    const texto = this.busqueda.toLowerCase().trim();
    return this.datos.clientes.filter(
      (cliente) => cliente.nombre.toLowerCase().includes(texto) || cliente.codigo.toLowerCase().includes(texto),
    );
  }

  buscar(evento: Event): void {
    this.busqueda = String((evento as CustomEvent).detail.value ?? '');
  }

  iniciales(nombre: string): string {
    return nombre
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('');
  }

  /** GESTO 2 — Pull-to-refresh */
  async refrescar(evento: Event): Promise<void> {
    this.ultimaActualizacion = await this.datos.sincronizar();
    (evento as RefresherCustomEvent).target.complete();
    this.mostrarToast('Lista de clientes sincronizada');
  }

  /** GESTO 1 — Swipe para eliminar (con opción de deshacer) */
  eliminar(cliente: Cliente): void {
    const eliminado = this.datos.eliminarCliente(cliente.id);
    if (!eliminado) {
      return;
    }
    this.mostrarToast(`${cliente.nombre} eliminado`, [
      {
        text: 'Deshacer',
        handler: () => this.datos.restaurarCliente(eliminado.cliente, eliminado.posicion),
      },
    ]);
  }

  cambiarEstado(cliente: Cliente, deslizable?: IonItemSliding): void {
    this.datos.cambiarEstadoCliente(cliente.id);
    deslizable?.close();
  }

  verPrestamos(cliente: Cliente): void {
    this.router.navigate(['/prestamos'], { queryParams: { cliente: cliente.nombre } });
  }

  /** GESTO 4 — Long-press: menú contextual del cliente */
  abrirMenuContextual(cliente: Cliente, deslizable: IonItemSliding): void {
    deslizable.close();
    this.clienteSeleccionado = cliente;
    this.botonesMenu = [
      { text: 'Ver préstamos', icon: 'cash-outline', handler: () => this.verPrestamos(cliente) },
      {
        text: 'Llamar',
        icon: 'call-outline',
        handler: () => {
          window.location.href = 'tel:' + cliente.telefono;
        },
      },
      {
        text: cliente.estado === 'Activo' ? 'Marcar como inactivo' : 'Marcar como activo',
        icon: 'swap-horizontal-outline',
        handler: () => this.cambiarEstado(cliente),
      },
      { text: 'Eliminar', role: 'destructive', icon: 'trash-outline', handler: () => this.eliminar(cliente) },
      { text: 'Cancelar', role: 'cancel', icon: 'close' },
    ];
    this.menuAbierto = true;
  }

  private mostrarToast(mensaje: string, botones: ToastButton[] = []): void {
    // Si ya hay un toast abierto, se cierra y se vuelve a abrir con el mensaje nuevo.
    this.toast = { abierto: false, mensaje, botones };
    setTimeout(() => (this.toast = { ...this.toast, abierto: true }));
  }
}
