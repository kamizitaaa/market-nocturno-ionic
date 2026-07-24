import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../shared/header/header.component';

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

  constructor(private router: Router) {
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

    // Aquí irá la llamada al backend Laravel
    console.log('Registrando usuario...', {
      nombre: this.nombre,
      telefono: this.telefono,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      email: this.email,
      password: this.password
    });

    alert('Cuenta creada exitosamente');
    this.router.navigate(['/login']);
  }
}
