import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonPopover, IonList, IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline, cartOutline, personCircleOutline,
  chevronDownOutline, chevronUpOutline, logOutOutline, receiptOutline
} from 'ionicons/icons';
import { AuthService } from '../../../services/auth';
import { CarritoService } from '../../../services/carrito';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
    IonPopover, IonList, IonItem
  ]
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  nombreUsuario = '';
  rolUsuario = '';
  menuAbierto = false;
  cantidadCarrito = 0;

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService,
    private router: Router
  ) {
    addIcons({
      personOutline, cartOutline, personCircleOutline,
      chevronDownOutline, chevronUpOutline, logOutOutline, receiptOutline
    });
  }

  ngOnInit() {
    this.checkAuth();

    // Se suscribe una sola vez: cada vez que el contador cambia en cualquier parte de la app, se actualiza aquí
    this.carritoService.cantidad$.subscribe(cantidad => {
      this.cantidadCarrito = cantidad;
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuth();
    });
  }

  async checkAuth() {
    this.isLoggedIn = await this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.nombreUsuario = await this.authService.getNombre() || 'Usuario';
      this.rolUsuario = await this.authService.getRol() || '';

      // Solo carga el contador si el usuario puede tener carrito (no aplica a emprendedores)
      if (this.rolUsuario !== 'emprendedor') {
        this.carritoService.refrescarContador();
      }
    } else {
      this.nombreUsuario = '';
      this.rolUsuario = '';
      this.carritoService.resetContador();
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  verCarrito() {
    if (this.isLoggedIn) {
      this.router.navigate(['/carrito']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  async cerrarSesion() {
    await this.authService.removeToken();
    this.isLoggedIn = false;
    this.nombreUsuario = '';
    this.rolUsuario = '';
    this.carritoService.resetContador();
    this.router.navigate(['/login']);
  }
}