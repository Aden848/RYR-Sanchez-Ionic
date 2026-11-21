# /menu — Menú lateral (ion-menu + ion-split-pane)

Hay que tomar 1 captura del menú abierto en el celular y guardarla como `capturas/menu_celular.png`. Si pueden, tomen otra en modo tablet, `capturas/menu_tablet.png`, con el menú fijo a la izquierda.

**Archivos:** `app.component.html`, `app.component.ts`, `app.component.scss` (copias de `src/app/`).

| Requisito de la rúbrica | Cómo está hecho |
|-------------------------|-----------------|
| Opciones de navegación | Panel principal, Clientes, Préstamos, Configuración y Cerrar sesión (`routerLink` + `ion-menu-toggle`). La opción de la pantalla actual se resalta en dorado (`routerLinkActive`). |
| Iconos | `grid-outline`, `people-outline`, `cash-outline`, `settings-outline`, `log-out-outline` (ionicons). Clientes y Préstamos muestran un contador (`ion-badge`). |
| Encabezado con nombre/logo | Logo circular **R&R** + "R Y R SÁNCHEZ / Gestión de Préstamos". Abajo hay un pie con el usuario. |
| **ion-split-pane para tablet** | `<ion-split-pane contentId="main-content" when="md">`: a partir de **768 px** de ancho el menú queda **fijo** a la izquierda y el botón ☰ se oculta solo. |

- En el celular, el menú se abre con el botón ☰ de cada pantalla (`ion-menu-button`) o deslizando desde el borde izquierdo.
- En el inicio de sesión (`/home`), el menú y el split-pane se desactivan (`[disabled]="!mostrarMenu"`).

**Cómo probar el split-pane:** `ionic serve` → herramientas de desarrollador (F12) → modo dispositivo → elegir *iPad* (o un ancho mayor a 768 px). En Android Studio también se puede crear un emulador de tablet (por ejemplo *Pixel Tablet*).
