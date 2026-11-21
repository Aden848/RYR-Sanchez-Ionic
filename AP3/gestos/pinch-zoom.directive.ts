import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

/**
 * GESTO 3 — Pinch / Zoom sobre una imagen.
 *
 * Uso:  <img appPinchZoom src="..." (zoomCambio)="zoom = $event" />
 *
 * - 2 dedos separándose / juntándose  -> acerca / aleja (de 1x a `zoomMaximo`).
 * - 1 dedo con la imagen ampliada      -> mueve la imagen (pan).
 * - Doble toque                        -> alterna entre 1x y 2.5x.
 * - Ctrl + rueda del mouse             -> zoom (para probar en la PC).
 *
 * En el emulador de Android: mantener Ctrl y arrastrar con el mouse simula
 * los dos dedos del pinch.
 *
 * El pinch necesita DOS dedos a la vez, por eso se usan Pointer Events
 * (cada dedo es un pointerId distinto); createGesture() de Ionic solo sigue un dedo.
 */
@Directive({
  selector: '[appPinchZoom]',
  standalone: true,
  exportAs: 'pinchZoom',
})
export class PinchZoomDirective implements OnInit, OnDestroy {
  @Input() zoomMaximo = 4;
  @Output() zoomCambio = new EventEmitter<number>();

  private punteros = new Map<number, { x: number; y: number }>();
  private escala = 1;
  private x = 0;
  private y = 0;

  private distanciaInicial = 0;
  private escalaInicial = 1;
  private ultimoToque = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    const elemento = this.el.nativeElement;
    // Le decimos al navegador que NO haga su propio zoom/scroll sobre la imagen.
    elemento.style.touchAction = 'none';
    elemento.style.transformOrigin = 'center center';
    elemento.style.willChange = 'transform';
    elemento.draggable = false;

    this.zone.runOutsideAngular(() => {
      elemento.addEventListener('pointerdown', this.alPresionar);
      elemento.addEventListener('pointermove', this.alMover);
      elemento.addEventListener('pointerup', this.alSoltar);
      elemento.addEventListener('pointercancel', this.alSoltar);
      elemento.addEventListener('wheel', this.alRueda, { passive: false });
    });
  }

  ngOnDestroy(): void {
    const elemento = this.el.nativeElement;
    elemento.removeEventListener('pointerdown', this.alPresionar);
    elemento.removeEventListener('pointermove', this.alMover);
    elemento.removeEventListener('pointerup', this.alSoltar);
    elemento.removeEventListener('pointercancel', this.alSoltar);
    elemento.removeEventListener('wheel', this.alRueda);
  }

  /** Métodos públicos para los botones +, − y restablecer. */
  acercar(): void {
    this.fijarEscala(this.escala + 0.5);
  }

  alejar(): void {
    this.fijarEscala(this.escala - 0.5);
  }

  restablecer(): void {
    this.x = 0;
    this.y = 0;
    this.fijarEscala(1);
  }

  private alPresionar = (evento: PointerEvent): void => {
    this.el.nativeElement.setPointerCapture(evento.pointerId);
    this.punteros.set(evento.pointerId, { x: evento.clientX, y: evento.clientY });

    if (this.punteros.size === 2) {
      // Empieza el pinch: guardamos la distancia entre los dos dedos.
      this.distanciaInicial = this.distanciaEntreDedos();
      this.escalaInicial = this.escala;
      return;
    }

    if (this.punteros.size === 1) {
      const ahora = Date.now();
      if (ahora - this.ultimoToque < 300) {
        // Doble toque
        if (this.escala > 1) {
          this.restablecer();
        } else {
          this.fijarEscala(2.5);
        }
        this.ultimoToque = 0;
      } else {
        this.ultimoToque = ahora;
      }
    }
  };

  private alMover = (evento: PointerEvent): void => {
    const anterior = this.punteros.get(evento.pointerId);
    if (!anterior) {
      return;
    }
    const actual = { x: evento.clientX, y: evento.clientY };
    this.punteros.set(evento.pointerId, actual);

    if (this.punteros.size === 2 && this.distanciaInicial > 0) {
      // PINCH: nueva escala = escala inicial × (distancia actual / distancia inicial)
      const factor = this.distanciaEntreDedos() / this.distanciaInicial;
      this.fijarEscala(this.escalaInicial * factor);
    } else if (this.punteros.size === 1 && this.escala > 1) {
      // PAN: mover la imagen ampliada con un dedo
      this.x += actual.x - anterior.x;
      this.y += actual.y - anterior.y;
      this.aplicar();
    }
  };

  private alSoltar = (evento: PointerEvent): void => {
    this.punteros.delete(evento.pointerId);
    if (this.punteros.size < 2) {
      this.distanciaInicial = 0;
    }
  };

  private alRueda = (evento: WheelEvent): void => {
    if (!evento.ctrlKey) {
      return;
    }
    evento.preventDefault();
    this.fijarEscala(this.escala * (evento.deltaY < 0 ? 1.1 : 0.9));
  };

  private distanciaEntreDedos(): number {
    const [a, b] = Array.from(this.punteros.values());
    return Math.hypot(b.x - a.x, b.y - a.y);
  }

  private fijarEscala(nuevaEscala: number): void {
    const escalaAnterior = this.escala;
    this.escala = Math.min(Math.max(nuevaEscala, 1), this.zoomMaximo);
    if (this.escala === 1) {
      this.x = 0;
      this.y = 0;
    }
    this.aplicar();
    if (Math.round(escalaAnterior * 100) !== Math.round(this.escala * 100)) {
      this.zone.run(() => this.zoomCambio.emit(this.escala));
    }
  }

  private aplicar(): void {
    // No dejar que la imagen se salga demasiado de su marco
    const elemento = this.el.nativeElement;
    const limiteX = (elemento.offsetWidth * (this.escala - 1)) / 2;
    const limiteY = (elemento.offsetHeight * (this.escala - 1)) / 2;
    this.x = Math.min(Math.max(this.x, -limiteX), limiteX);
    this.y = Math.min(Math.max(this.y, -limiteY), limiteY);
    elemento.style.transform = `translate(${this.x}px, ${this.y}px) scale(${this.escala})`;
  }
}
