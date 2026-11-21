# /interfaces — 3 pantallas con componentes Ionic

Hay que tomar 1 captura de cada pantalla con la app corriendo y guardarla en `capturas/` con estos nombres:
`1_dashboard.png`, `2_clientes.png`, `3_prestamos.png`.

| # | Pantalla | Archivo | Componentes de la lista de la consigna | Otros componentes |
|---|----------|---------|----------------------------------------|-------------------|
| 1 | Panel principal (`/dashboard`) | `1_dashboard.page.html` | **ion-card**, **ion-list**, **ion-refresher**, **ion-fab** (con ion-fab-list), **ion-menu** | ion-badge, ion-toast |
| 2 | Clientes (`/clientes`) | `2_clientes.page.html` | **ion-card**, **ion-list**, **ion-item-sliding**, **ion-refresher**, **ion-fab**, **ion-menu** | ion-searchbar, ion-action-sheet, ion-alert, ion-toast |
| 3 | Préstamos (`/prestamos`) | `3_prestamos.page.html` | **ion-card**, **ion-list**, **ion-refresher**, **ion-fab** (con ion-fab-list), **ion-menu** | ion-segment, ion-progress-bar, ion-chip, ion-modal, ion-action-sheet, ion-alert |

Cada pantalla usa 5 o 6 componentes de la lista (la consigna pide mínimo 3).

**Diseño consistente:** las 3 pantallas usan la misma barra superior azul (`#0b1736`) con el botón del menú en dorado (`#d4af37`), fondo gris claro, tarjetas con bordes redondeados y un botón FAB dorado abajo a la derecha.

## Qué hace cada pantalla
- **Panel principal:** 4 tarjetas con los totales (clientes activos, préstamos activos, capital e intereses pendientes) y una lista de préstamos en curso. Los atrasados aparecen en rojo. El FAB abre accesos rápidos: *Nuevo cliente* y *Préstamos*.
- **Clientes:** buscador y lista de clientes. Deslizando un cliente se puede llamarlo, activarlo o desactivarlo, o eliminarlo. Al mantenerlo presionado se abre un menú contextual. Al tocarlo se ven sus préstamos. El FAB agrega un cliente.
- **Préstamos:** filtro por estado (Todos / Activos / Atrasados / Pagados), barra de progreso de las cuotas, *Registrar pago* y *Ver pagaré* (imagen con zoom). El FAB crea un préstamo nuevo.

Los datos son ficticios y están en `src/app/services/datos.service.ts`. Todas las pantallas comparten esos datos: si eliminan un cliente, el Panel principal se actualiza.
