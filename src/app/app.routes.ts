import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'verificar-mfa',
    loadComponent: () => import('./pages/verificar-mfa/verificar-mfa.page').then(m => m.VerificarMfaPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'emprendimientos',
    loadComponent: () => import('./pages/emprendimientos/emprendimientos.page').then(m => m.EmprendimientosPage)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/carrito/carrito.page').then(m => m.CarritoPage),
    canActivate: [authGuard]
  },
  {
    path: 'mis-pedidos',
    loadComponent: () => import('./pages/mis-pedidos/mis-pedidos.page').then(m => m.MisPedidosPage),
    canActivate: [authGuard]
  },
  {
    path: 'acerca',
    loadComponent: () => import('./pages/acerca/acerca.page').then(m => m.AcercaPage)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then(m => m.ContactoPage)
  },
  {
    path: 'mi-emprendimiento',
    loadComponent: () => import('./pages/mi-emprendimiento/mi-emprendimiento.page').then(m => m.MiEmprendimientoPage),
    canActivate: [authGuard]
  },
  {
    path: 'pedidos-emprendimiento',
    loadComponent: () => import('./pages/pedidos-emprendimiento/pedidos-emprendimiento.page').then(m => m.PedidosEmprendimientoPage),
    canActivate: [authGuard]
  },
  {
    path: 'emprendimientos/:id',
    loadComponent: () => import('./pages/emprendimiento-detalle/emprendimiento-detalle.page').then(m => m.EmprendimientoDetallePage)
  },
  {
    path: 'convocatorias',
    loadComponent: () => import('./pages/convocatorias/convocatorias.page').then(m => m.ConvocatoriasPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [authGuard]
  },
  {
    path: 'olvide-contrasena',
    loadComponent: () => import('./pages/olvide-contrasena/olvide-contrasena.page').then( m => m.OlvideContrasenaPage)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.page').then(m => m.DashboardPage)
      },
      {
        path: 'emprendimientos',
        loadComponent: () => import('./pages/admin/emprendimientos/emprendimientos.page').then(m => m.EmprendimientosPage)
      },
      {
        path: 'convocatorias',
        loadComponent: () => import('./pages/admin/convocatorias/convocatorias.page').then(m => m.ConvocatoriasPage)
      },
      {
        path: 'acerca',
        loadComponent: () => import('./pages/admin/acerca/acerca.page').then(m => m.AcercaPage)
      },
      {
        path: 'contacto',
        loadComponent: () => import('./pages/admin/contacto/contacto.page').then(m => m.ContactoPage)
      },
      {
      path: 'sesiones',
      loadComponent: () => import('./pages/admin/sesiones/sesiones.page').then( m => m.SesionesPage)
      },
      {
        path: 'home-slides',
        loadComponent: () => import('./pages/admin/home-slides/home-slides.page').then( m => m.HomeSlidesPage)
      },
    ]
  },
];