# R Y R Sánchez — Sistema de Gestión de Préstamos

App móvil con **Ionic 9 + Angular** (proyecto integrador, Programación de Dispositivos Móviles).

## Cómo ejecutarla

```bash
npm install
ionic serve          # en el navegador (o: npm start)
```

En Android (emulador o celular):

```bash
ionic build
npx cap add android      # solo la primera vez
npx cap sync android
npx cap open android     # abre Android Studio → botón Run ▶
```

## Pantallas
| Ruta | Pantalla |
|------|----------|
| `/home` | Inicio de sesión (cualquier usuario y contraseña, es demostración) |
| `/dashboard` | Panel principal |
| `/clientes` | Clientes |
| `/prestamos` | Préstamos + pagaré con zoom |
| `/configuracion` | Configuración |

## Semana 3 (AP3): interfaces táctiles y gestos
- **Menú lateral** `ion-menu` con `ion-split-pane` (fijo en tablet) → `src/app/app.component.*`
- **Gestos:** swipe para eliminar, pull-to-refresh, pinch/zoom y long-press → `src/app/gestures/` y las páginas en `src/app/pages/`
- Los entregables de la tarea están en la carpeta [`AP3/`](AP3/), con la documentación de cada parte y el guion del video.
