import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
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
  }

  checkAuth() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.nombreUsuario = localStorage.getItem('nombre') || 'Usuario';
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
}