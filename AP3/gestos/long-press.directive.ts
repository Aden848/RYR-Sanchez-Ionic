import { Directive, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/**
 * GESTO 4 — Long-press (mantener presionado) para menú contextual.
 *
 * Uso:  <ion-item appLongPress (longPress)="abrirMenu(cliente)">
 *
 * Cómo se diferencia de un swipe: el long-press exige que el dedo se quede
 * QUIETO durante `duracion` ms. Si el dedo se mueve más de `tolerancia` px,
 * se cancela, porque entonces el usuario está deslizando (swipe / scroll).
 *
 * Se implementa con Pointer Events (funcionan con dedo, mouse y emulador) en
 * vez de createGesture() para no "capturar" el toque: así sigue funcionando
 * el ion-item-sliding (swipe) y el ion-refresher sobre el mismo elemento.
 */
@Directive({
  selector: '[appLongPress]',
  standalone: true,
})
export class LongPressDirective implements OnInit, OnDestroy {
  /** Tiempo que hay que mantener presionado (ms). */
  @Input() duracion = 550;
  /** Movimiento máximo permitido antes de cancelar (px). */
  @Input() tolerancia = 10;

  @Output() longPress = new EventEmitter<PointerEvent>();

  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private inicioX = 0;
  private inicioY = 0;
  private disparado = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
  ) {}

  ngOnInit(): void {
    const elemento = this.el.nativeElement;
    // Los listeners corren fuera de Angular para no recalcular la vista en cada movimiento.
    this.zone.runOutsideAngular(() => {
      elemento.addEventListener('pointerdown', this.alPresionar);
      elemento.addEventListener('pointermove', this.alMover);
      elemento.addEventListener('pointerup', this.cancelar);
      elemento.addEventListener('pointercancel', this.cancelar);
      elemento.addEventListener('pointerleave', this.cancelar);
      // Evita que el navegador abra su propio menú (copiar, seleccionar...).
      elemento.addEventListener('contextmenu', this.bloquearMenuNativo);
      elemento.addEventListener('click', this.bloquearClickTrasLongPress, true);
    });
    elemento.style.setProperty('-webkit-user-select', 'none');
    elemento.style.setProperty('user-select', 'none');
    elemento.style.setProperty('-webkit-touch-callout', 'none');
  }

  ngOnDestroy(): void {
    const elemento = this.el.nativeElement;
    this.limpiarTemporizador();
    elemento.removeEventListener('pointerdown', this.alPresionar);
    elemento.removeEventListener('pointermove', this.alMover);
    elemento.removeEventListener('pointerup', this.cancelar);
    elemento.removeEventListener('pointercancel', this.cancelar);
    elemento.removeEventListener('pointerleave', this.cancelar);
    elemento.removeEventListener('contextmenu', this.bloquearMenuNativo);
    elemento.removeEventListener('click', this.bloquearClickTrasLongPress, true);
  }

  private alPresionar = (evento: PointerEvent): void => {
    if (evento.pointerType === 'mouse' && evento.button !== 0) {
      return;
    }
    this.disparado = false;
    this.inicioX = evento.clientX;
    this.inicioY = evento.clientY;
    this.limpiarTemporizador();
    this.temporizador = setTimeout(() => {
      this.disparado = true;
      this.vibrar();
      this.zone.run(() => this.longPress.emit(evento));
    }, this.duracion);
  };

  private alMover = (evento: PointerEvent): void => {
    if (!this.temporizador) {
      return;
    }
    const dx = Math.abs(evento.clientX - this.inicioX);
    const dy = Math.abs(evento.clientY - this.inicioY);
    if (dx > this.tolerancia || dy > this.tolerancia) {
      // El dedo se movió: es un swipe o scroll, no un long-press.
      this.limpiarTemporizador();
    }
  };

  private cancelar = (): void => {
    this.limpiarTemporizador();
  };

  private bloquearMenuNativo = (evento: Event): void => {
    evento.preventDefault();
  };

  /** Si ya se abrió el menú contextual, el "click" al soltar no debe navegar. */
  private bloquearClickTrasLongPress = (evento: Event): void => {
    if (this.disparado) {
      evento.preventDefault();
      evento.stopImmediatePropagation();
      this.disparado = false;
    }
  };

  private limpiarTemporizador(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
  }

  private async vibrar(): Promise<void> {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch {
      // En el navegador puede no haber vibración; no pasa nada.
    }
  }
}
