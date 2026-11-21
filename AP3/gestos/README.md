# /gestos — 4 gestos implementados

Hay que tomar 1 captura de cada gesto en acción y guardarla en `capturas/` con estos nombres:
`1_swipe.png`, `2_pull_refresh.png`, `3_pinch_zoom.png`, `4_long_press.png`.

| # | Gesto | Dónde se prueba | Código | Propósito (1 frase) |
|---|-------|-----------------|--------|---------------------|
| 1 | **Swipe para eliminar** (`ion-item-sliding`) | Clientes → deslizar un cliente hacia la **izquierda** | `src/app/pages/clientes/clientes.page.html` (`ion-item-sliding`, `ion-item-options side="end"`) y `eliminar()` en `clientes.page.ts` | Permite borrar un cliente con un solo movimiento del dedo, sin entrar a otra pantalla, y ofrece **Deshacer** por si fue un error. |
| 2 | **Pull-to-refresh** (`ion-refresher`) | Panel, Clientes y Préstamos → jalar la pantalla hacia **abajo** | `<ion-refresher (ionRefresh)="refrescar($event)">` y `refrescar()` en cada `.page.ts` | Permite al prestamista actualizar los totales y las listas en cualquier momento, con un gesto que ya conoce de otras apps. |
| 3 | **Pinch / Zoom sobre una imagen** | Préstamos → **Ver pagaré** → pellizcar con 2 dedos (o doble toque) | `src/app/gestures/pinch-zoom.directive.ts` (directiva `appPinchZoom`) | Permite ampliar el pagaré escaneado para leer la letra pequeña (cláusulas, firma, montos) en una pantalla de celular. |
| 4 | **Long-press para menú contextual** | Clientes → **mantener presionado** un cliente (también sobre una tarjeta de Préstamos) | `src/app/gestures/long-press.directive.ts` (directiva `appLongPress`) + `ion-action-sheet` | Muestra las acciones secundarias de un cliente (ver préstamos, llamar, activar, eliminar) sin llenar la pantalla de botones. |

## Detalles técnicos

### 1. Swipe (ion-item-sliding)
- Deslizar a la **izquierda**: aparecen *Activar/Desactivar* y *Eliminar*. Si se desliza hasta el final, el cliente se elimina directamente (`expandable` + `(ionSwipe)`).
- Deslizar a la **derecha**: aparece *Llamar* (abre el marcador con `tel:`).
- Después de eliminar sale un `ion-toast` con el botón **Deshacer**.

### 2. Pull-to-refresh (ion-refresher)
- `slot="fixed"` y `ion-refresher-content` muestran el texto "Desliza para actualizar" y un spinner.
- `datos.sincronizar()` simula una consulta al servidor que tarda 1,2 s. Después se llama a `event.target.complete()` para cerrar el refresher. **Si no se llama a `complete()`, el spinner se queda girando.**

### 3. Pinch / Zoom
- El pinch necesita **2 dedos a la vez**. `createGesture()` de Ionic sigue un solo dedo, por eso la directiva usa **Pointer Events**: cada dedo tiene un `pointerId` distinto.
- Fórmula: `escala = escalaInicial × (distanciaActual / distanciaInicial)`, limitada entre 1x y 4x.
- Con la imagen ampliada, 1 dedo la mueve (pan). El **doble toque** alterna entre 1x y 2,5x. También hay botones − / restablecer / +.
- `touch-action: none` en la imagen evita que el navegador haga su propio zoom o scroll.
- **Probar en el emulador de Android:** mantener **Ctrl** y arrastrar con el mouse simula los dos dedos. En la PC (navegador): **Ctrl + rueda del mouse**.

### 4. Long-press
- Se abre el menú si el dedo se queda **quieto 550 ms**. Si se mueve más de 10 px, se cancela.
- **Diferencia con el swipe:** el swipe depende del **movimiento** (dirección y distancia). El long-press depende del **tiempo sin movimiento**. Por eso los dos pueden estar en el mismo `ion-item` sin chocar: si el dedo se mueve, el long-press se cancela y el `ion-item-sliding` toma el control.
- Vibra con `@capacitor/haptics` cuando se activa (en un celular real).
- **¿Por qué no `createGesture()`?** Un gesto creado con `createGesture()` + `gesture.enable(true)` se registra en el *Gesture Controller* de Ionic. Cuando arranca (`onStart`, que es lo que se ve como `gesture.start` en el video), **captura** el toque, y entonces el `ion-item-sliding` y el `ion-refresher` del mismo elemento dejan de funcionar. Con Pointer Events el long-press convive con los otros dos gestos.

## Errores encontrados y solución
| Problema | Solución |
|----------|----------|
| Al soltar después del long-press, el `click` del item también navegaba a Préstamos. | La directiva bloquea el `click` que llega justo después de un long-press (`bloquearClickTrasLongPress`). |
| En Android, al mantener presionado aparecía el menú nativo de "copiar / seleccionar texto". | Se usó `preventDefault()` en `contextmenu` y `user-select: none` / `-webkit-touch-callout: none`. |
| El zoom del navegador se activaba en lugar del zoom de la imagen. | Se puso `touch-action: none` en la imagen. |
<!-- Si algún gesto falla en su emulador o celular, anótenlo aquí: qué pasó, qué probaron y cómo lo resolvieron (la consigna lo pide). -->
