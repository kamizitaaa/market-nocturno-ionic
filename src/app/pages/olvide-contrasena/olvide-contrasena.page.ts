import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, shieldCheckmarkOutline, refreshOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-olvide-contrasena',
  templateUrl: './olvide-contrasena.page.html',
  styleUrls: ['./olvide-contrasena.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class OlvideContrasenaPage {

  // Paso 1: pedir correo
  paso = 1;
  email = '';
  enviandoCorreo = false;

  // Paso 2: código + nueva contraseña
  userId: number | null = null;
  codigo = '';
  password = '';
  confirmarPassword = '';
  mostrarPassword = false;
  restableciendo = false;

  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({ mailOutline, lockClosedOutline, shieldCheckmarkOutline, refreshOutline, eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  solicitarCodigo() {
    if (!this.email) {
      this.error = 'Ingresa tu correo electrónico';
      return;
    }

    this.error = '';
    this.enviandoCorreo = true;

    this.authService.olvideContrasena(this.email).subscribe({
      next: (res) => {
        this.enviandoCorreo = false;
        this.userId = res.user_id ?? null;
        this.paso = 2;
      },
      error: () => {
        this.enviandoCorreo = false;
        this.error = 'No se pudo procesar la solicitud, intenta de nuevo';
      }
    });
  }

  restablecer() {
    this.error = '';

    if (!this.codigo) {
      this.error = 'Ingresa el código que llegó a tu correo';
      return;
    }

    if (this.password.length < 8) {
      this.error = 'La contraseña debe tener al menos 8 caracteres';
      return;
    }

    if (this.password !== this.confirmarPassword) {
      this.error = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.userId) {
      this.error = 'Ocurrió un error, solicita el código de nuevo';
      this.paso = 1;
      return;
    }

    this.restableciendo = true;

    this.authService.restablecerContrasena(this.userId, this.codigo, this.password, this.confirmarPassword).subscribe({
      next: () => {
        this.restableciendo = false;
        alert('Tu contraseña fue actualizada correctamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.restableciendo = false;
        this.error = err.error?.message || 'Código incorrecto o expirado';
      }
    });
  }

  volverAlPaso1() {
    this.paso = 1;
    this.codigo = '';
    this.password = '';
    this.confirmarPassword = '';
    this.error = '';
  }
}