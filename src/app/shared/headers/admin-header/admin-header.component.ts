import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonButton, IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, personCircleOutline } from 'ionicons/icons';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonButtons, IonButton, IonIcon
  ]
})
export class AdminHeaderComponent implements OnInit {

  nombreAdmin = '';
  rolActual = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ logOutOutline, personCircleOutline });
  }

  async ngOnInit() {
    this.nombreAdmin = await this.authService.getNombre() || 'Admin';
    this.rolActual = await this.authService.getRol() || '';
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  async logout() {
    await this.authService.removeToken();
    this.router.navigate(['/login']);
  }
}