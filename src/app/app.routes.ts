import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';
import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}

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
    path: 'registro',
    loadComponent: () => import('./pages/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'emprendimientos',
    loadComponent: () => import('./pages/emprendimientos/emprendimientos.page').then(m => m.EmprendimientosPage)
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
    path: 'convocatorias',
    loadComponent: () => import('./pages/convocatorias/convocatorias.page').then( m => m.ConvocatoriasPage)
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    //canActivate: [authGuard, roleGuard],
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
      { path: 'acerca', 
        loadComponent: () => import('./pages/admin/acerca/acerca.page').then(m => m.AcercaPage) 
      },
      {
    path: 'contacto',
    loadComponent: () => import('./pages/admin/contacto/contacto.page').then( m => m.ContactoPage)
      },
    ]
  },
];