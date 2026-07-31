import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class RegistroPage {

  nombre = '';
  telefono = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  email = '';
  password = '';
  confirmarPassword = '';
  mostrarPassword = false;
  mostrarConfirm = false;
  registrando = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({ eyeOutline, eyeOffOutline });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirm() {
    this.mostrarConfirm = !this.mostrarConfirm;
  }

  registrar() {
    if (!this.nombre || !this.telefono || !this.apellidoPaterno || !this.email || !this.password) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    if (this.password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.registrando = true;

    this.authService.registro({
      nombre: this.nombre,
      apellido_paterno: this.apellidoPaterno,
      apellido_materno: this.apellidoMaterno,
      telefono: this.telefono,
      email: this.email,
      password: this.password,
      password_confirmation: this.confirmarPassword
    } as any).subscribe({
      next: () => {
        this.registrando = false;
        alert('Cuenta creada exitosamente');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.registrando = false;
        if (err.status === 422 && err.error?.errors) {
          const mensajes = ([] as string[]).concat(...Object.values(err.error.errors) as string[][]).join('\n');
          alert(mensajes);
        } else {
          alert('No se pudo crear la cuenta, intenta de nuevo');
        }
      }
    });
  }
}