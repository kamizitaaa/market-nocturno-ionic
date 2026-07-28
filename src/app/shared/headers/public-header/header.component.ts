import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personOutline, cartOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonButtons, IonButton, IonIcon
  ]
})
export class HeaderComponent implements OnInit {

  isLoggedIn = false;
  nombreUsuario = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ personOutline, cartOutline, personCircleOutline });
  }

  ngOnInit() {
    this.checkAuth();

    // Vuelve a revisar el estado de sesión cada vez que cambias de página
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
    } else {
      this.nombreUsuario = '';
    }
  }

  isActive(path: string): boolean {
    return this.router.url === path;
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
    this.router.navigate(['/login']);
  }
}