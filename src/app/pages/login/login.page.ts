import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
  shieldCheckmarkOutline, chevronDownOutline, chevronUpOutline, refreshOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  mostrarPassword = false;
  mostrarCaptcha = false;
  recuerdame = false;
  captchaNum1 = 0;
  captchaNum2 = 0;
  captchaRespuesta: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
      shieldCheckmarkOutline, chevronDownOutline, chevronUpOutline, refreshOutline
    });
  }

  ngOnInit() {
    this.generarCaptcha();
  }

  generarCaptcha() {
    this.captchaNum1 = Math.floor(Math.random() * 9) + 1;
    this.captchaNum2 = Math.floor(Math.random() * 9) + 1;
    this.captchaRespuesta = null;
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleCaptcha() {
    this.mostrarCaptcha = !this.mostrarCaptcha;
  }

  login() {
    if (!this.email || !this.password) {
      alert('Por favor ingresa tu correo y contraseña');
      return;
    }

    if (!this.mostrarCaptcha || this.captchaRespuesta !== this.captchaNum1 * this.captchaNum2) {
      alert('Por favor completa la verificación humana');
      this.mostrarCaptcha = true;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('rol', res.rol);
        localStorage.setItem('nombre', res.nombre);
        this.router.navigate(['/home']);
      },
      error: () => {
        alert('Credenciales incorrectas');
        this.generarCaptcha();
      }
    });
  }
}