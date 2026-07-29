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

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      personOutline, cartOutline, personCircleOutline,
      chevronDownOutline, chevronUpOutline, logOutOutline, receiptOutline
    });
  }

  ngOnInit() {
    this.checkAuth();

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
    } else {
      this.nombreUsuario = '';
      this.rolUsuario = '';
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
    this.router.navigate(['/login']);
  }
}