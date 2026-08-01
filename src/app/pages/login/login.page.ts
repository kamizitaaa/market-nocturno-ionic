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

  // Captcha real (viene del backend)
  captchaToken = '';
  captchaNum1 = 0;
  captchaNum2 = 0;
  captchaRespuesta = '';

  cargandoCaptcha = false;
  mostrarCaptcha = true; // arranca visible

  cargando = false;

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
    this.cargarCaptcha();
  }

  cargarCaptcha() {
    this.cargandoCaptcha = true;
    this.authService.getCaptcha().subscribe({
      next: (res) => {
        this.captchaToken = res.captcha_token;
        this.captchaNum1 = res.numero1;
        this.captchaNum2 = res.numero2;
        this.captchaRespuesta = '';
        this.cargandoCaptcha = false;
      },
      error: () => {
        alert('No se pudo cargar el captcha, intenta de nuevo');
        this.cargandoCaptcha = false;
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleCaptchaVista() {
    this.mostrarCaptcha = !this.mostrarCaptcha;
  }

  login() {
    if (!this.email || !this.password) {
      alert('Por favor ingresa tu correo y contraseña');
      return;
    }

    if (!this.captchaRespuesta) {
      alert('Por favor completa la verificación humana');
      return;
    }

    this.cargando = true;

    this.authService.login(this.email, this.password, this.captchaToken, this.captchaRespuesta).subscribe({
      next: async (res) => {
        this.cargando = false;

        if (res.mfa_requerido === false) {
          // Login directo, sin MFA
          await this.authService.setToken(res.token);

          const rol = res.user?.role;
          if (rol) await this.authService.setRol(rol);
          if (res.user?.nombre) await this.authService.setNombre(res.user.nombre);

          if (rol === 'admin' || rol === 'superadmin') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/home']);
          }
        } else {
          // Flujo normal con MFA
          this.router.navigate(['/verificar-mfa'], { state: { userId: res.user_id } });
        }
      },
      error: () => {
        this.cargando = false;
        alert('Credenciales incorrectas o captcha inválido');
        this.cargarCaptcha();
      }
    });
  }
}