import { describe, it, expect, beforeEach } from 'vitest';
import { DatosService } from './datos.service';

describe('DatosService', () => {
  let service: DatosService;

  beforeEach(() => {
    service = new DatosService();
  });

  it('no debería alterar préstamos si el código no existe', () => {
    const prestamosIniciales = structuredClone(service.prestamos);
    const codigoInexistente = 'PRE-NO-EXISTE-999';

    // Verificar que el código no exista
    const existe = service.prestamos.some(p => p.codigo === codigoInexistente);
    expect(existe).toBe(false);

    service.registrarPago(codigoInexistente);

    expect(service.prestamos).toEqual(prestamosIniciales);
  });

  it('no debería modificar un préstamo que ya está en estado Pagado', () => {
    const prestamoPagado = service.prestamos.find(p => p.estado === 'Pagado');
    if (!prestamoPagado) {
        throw new Error('No se encontró un préstamo Pagado para la prueba');
    }

    const estadoInicial = structuredClone(prestamoPagado);
    service.registrarPago(prestamoPagado.codigo);

    expect(prestamoPagado).toEqual(estadoInicial);
  });

  it('el contador de cuotasPagadas no debe superar cuotasTotales y el estado debe ser Pagado', () => {
    const prestamo = service.prestamos.find(p => p.estado !== 'Pagado');
    if (!prestamo) {
        throw new Error('No se encontró un préstamo no Pagado para la prueba');
    }

    const cuotasNecesarias = prestamo.cuotasTotales - prestamo.cuotasPagadas;

    // Realizamos pagos: (cuotas restantes) + 2 extra
    for(let i = 0; i < cuotasNecesarias + 2; i++) {
      service.registrarPago(prestamo.codigo);
    }

    expect(prestamo.cuotasPagadas).toBe(prestamo.cuotasTotales);
    expect(prestamo.estado).toBe('Pagado');
  });
});
