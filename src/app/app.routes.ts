import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'clientes',
    loadComponent: () => import('./pages/clientes/clientes.page').then((m) => m.ClientesPage),
  },
  {
    path: 'prestamos',
    loadComponent: () => import('./pages/prestamos/prestamos.page').then((m) => m.PrestamosPage),
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then((m) => m.ConfiguracionPage),
  },
];
