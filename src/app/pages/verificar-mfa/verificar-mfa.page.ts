import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonItem, IonInput, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailUnreadOutline, shieldCheckmarkOutline, refreshOutline } from 'ionicons/icons';
import { AuthService } from '../../services/auth';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
@
Component({
  selector: 'app-verificar-mfa',
  templateUrl: './verificar-mfa.page.html',
  styleUrls: ['./verificar-mfa.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonItem, IonInput, IonButton, IonIcon, HeaderComponent]
})
export class VerificarMfaPage implements OnInit {

  userId: number | null = null;
  codigo = '';
  cargando = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mailUnreadOutline, shieldCheckmarkOutline, refreshOutline });
  }

  ngOnInit() {
    const state = history.state as { userId?: number };

    if (state?.userId) {
      this.userId = state.userId;
    } else {
      alert('Debes iniciar sesión primero');
      this.router.navigate(['/login']);
    }
  }

  verificar() {
    this.error = '';

    if (!this.codigo) {
      this.error = 'Ingresa el código que llegó a tu correo';
      return;
    }

    if (!this.userId) return;

    this.cargando = true;
    this.authService.verificarMfa(this.userId, this.codigo).subscribe({
      next: async (res) => {
        await this.authService.setToken(res.token);

        const rol = res.user?.role;

        if (rol) {
          await this.authService.setRol(rol);
        }

        if (res.user?.nombre) {
          await this.authService.setNombre(res.user.nombre);
        }

        this.cargando = false;

        if (rol === 'admin' || rol === 'superadmin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: () => {
        this.error = 'Código incorrecto o expirado';
        this.cargando = false;
      }
    });
  }

  volverAlLogin() {
    this.router.navigate(['/login']);
  }
}