import { Injectable } from '@angular/core';

export interface Cliente {
  id: number;
  nombre: string;
  codigo: string;
  telefono: string;
  estado: 'Activo' | 'Inactivo';
}

export interface Prestamo {
  codigo: string;
  cliente: string;
  capital: number;
  intereses: number;
  cuotasPagadas: number;
  cuotasTotales: number;
  estado: 'Activo' | 'Pagado' | 'Atrasado';
}

/**
 * Datos ficticios compartidos entre pantallas (prototipo académico).
 * Al eliminar un cliente o un préstamo, el Panel Principal se entera
 * porque todas las pantallas leen de este mismo servicio.
 */
@Injectable({ providedIn: 'root' })
export class DatosService {
  private siguienteId = 7;

  clientes: Cliente[] = [
    { id: 1, nombre: 'Juan Pérez', codigo: 'CLI-001', telefono: '809-555-0101', estado: 'Activo' },
    { id: 2, nombre: 'María Rodríguez', codigo: 'CLI-002', telefono: '809-555-0102', estado: 'Activo' },
    { id: 3, nombre: 'Carlos Martínez', codigo: 'CLI-003', telefono: '829-555-0103', estado: 'Inactivo' },
    { id: 4, nombre: 'Ana González', codigo: 'CLI-004', telefono: '849-555-0104', estado: 'Activo' },
    { id: 5, nombre: 'Luis Fernández', codigo: 'CLI-005', telefono: '809-555-0105', estado: 'Activo' },
    { id: 6, nombre: 'Rosa Jiménez', codigo: 'CLI-006', telefono: '829-555-0106', estado: 'Inactivo' },
  ];

  prestamos: Prestamo[] = [
    { codigo: 'PRE-001', cliente: 'Juan Pérez', capital: 10000, intereses: 2000, cuotasPagadas: 4, cuotasTotales: 12, estado: 'Activo' },
    { codigo: 'PRE-002', cliente: 'María Rodríguez', capital: 15000, intereses: 3000, cuotasPagadas: 9, cuotasTotales: 12, estado: 'Activo' },
    { codigo: 'PRE-003', cliente: 'Carlos Martínez', capital: 8000, intereses: 0, cuotasPagadas: 10, cuotasTotales: 10, estado: 'Pagado' },
    { codigo: 'PRE-004', cliente: 'Ana González', capital: 20000, intereses: 4500, cuotasPagadas: 2, cuotasTotales: 18, estado: 'Atrasado' },
  ];

  get clientesActivos(): number {
    return this.clientes.filter((c) => c.estado === 'Activo').length;
  }

  get prestamosActivos(): number {
    return this.prestamos.filter((p) => p.estado !== 'Pagado').length;
  }

  get capitalPendiente(): number {
    return this.prestamos.filter((p) => p.estado !== 'Pagado').reduce((total, p) => total + p.capital, 0);
  }

  get interesesPendientes(): number {
    return this.prestamos.filter((p) => p.estado !== 'Pagado').reduce((total, p) => total + p.intereses, 0);
  }

  eliminarCliente(id: number): { cliente: Cliente; posicion: number } | null {
    const posicion = this.clientes.findIndex((c) => c.id === id);
    if (posicion === -1) {
      return null;
    }
    const [cliente] = this.clientes.splice(posicion, 1);
    return { cliente, posicion };
  }

  restaurarCliente(cliente: Cliente, posicion: number): void {
    this.clientes.splice(posicion, 0, cliente);
  }

  agregarCliente(nombre: string, telefono: string): Cliente {
    const id = this.siguienteId++;
    const cliente: Cliente = {
      id,
      nombre,
      telefono,
      codigo: 'CLI-' + String(id).padStart(3, '0'),
      estado: 'Activo',
    };
    this.clientes.unshift(cliente);
    return cliente;
  }

  cambiarEstadoCliente(id: number): void {
    const cliente = this.clientes.find((c) => c.id === id);
    if (cliente) {
      cliente.estado = cliente.estado === 'Activo' ? 'Inactivo' : 'Activo';
    }
  }

  registrarPago(codigo: string): void {
    const prestamo = this.prestamos.find((p) => p.codigo === codigo);
    if (!prestamo || prestamo.estado === 'Pagado') {
      return;
    }
    prestamo.cuotasPagadas = Math.min(prestamo.cuotasPagadas + 1, prestamo.cuotasTotales);
    if (prestamo.estado === 'Atrasado') {
      prestamo.estado = 'Activo';
    }
    if (prestamo.cuotasPagadas === prestamo.cuotasTotales) {
      prestamo.estado = 'Pagado';
    }
  }

  agregarPrestamo(cliente: string, capital: number, cuotasTotales: number): Prestamo {
    const numero = this.prestamos.length + 1;
    const prestamo: Prestamo = {
      codigo: 'PRE-' + String(numero).padStart(3, '0'),
      cliente,
      capital,
      intereses: Math.round(capital * 0.2), // 20 % fijo (dato de demostración)
      cuotasPagadas: 0,
      cuotasTotales,
      estado: 'Activo',
    };
    this.prestamos.unshift(prestamo);
    return prestamo;
  }

  prestamosDe(nombreCliente: string): Prestamo[] {
    return this.prestamos.filter((p) => p.cliente === nombreCliente);
  }

  /** Simula una consulta al servidor (para el pull-to-refresh). */
  sincronizar(): Promise<Date> {
    return new Promise((resolve) => setTimeout(() => resolve(new Date()), 1200));
  }
}
