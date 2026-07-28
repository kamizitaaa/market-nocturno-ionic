# Script para generar/actualizar los archivos del login con Laravel
# Corre esto parado en la RAIZ de tu proyecto Ionic (donde esta package.json)

Write-Host 'Creando archivos...' -ForegroundColor Cyan

New-Item -ItemType Directory -Force -Path 'src/environments' | Out-Null
Set-Content -Path 'src/environments/environment.ts' -Encoding UTF8 -Value @'
export const environment = {
  production: false,
  apiUrl: 'http://127.0.0.1:8000/api'
};
'@
Write-Host '  OK -> src/environments/environment.ts' -ForegroundColor Green

New-Item -ItemType Directory -Force -Path 'src/environments' | Out-Null
Set-Content -Path 'src/environments/environment.prod.ts' -Encoding UTF8 -Value @'
export const environment = {
  production: true,
  // Cámbialo por tu dominio real cuando despliegues el backend
  apiUrl: 'https://tu-dominio-produccion.com/api'
};
'@
Write-Host '  OK -> src/environments/environment.prod.ts' -ForegroundColor Green

New-Item -ItemType Directory -Force -Path 'src/app/services' | Out-Null
Set-Content -Path 'src/app/services/auth.ts' -Encoding UTF8 -Value @'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, tap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { environment } from '../../environments/environment';

export type Rol = 'superadmin' | 'admin' | 'emprendedor' | 'cliente';

export interface Usuario {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string;
  role: Rol;
  mfa_enabled?: boolean;
}

export interface CaptchaResponse {
  numero1: number;
  numero2: number;
  captcha_token: string;
}

export interface LoginResponse {
  message: string;
  user_id: number;
}

export interface MfaResponse {
  message: string;
  token: string;
  user: Usuario;
}

export interface RegistroPayload {
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient) {}

  // ===== CAPTCHA =====
  getCaptcha(): Observable<CaptchaResponse> {
    return this.http.get<CaptchaResponse>(`${environment.apiUrl}/captcha`);
  }

  // ===== REGISTRO =====
  registro(data: RegistroPayload): Observable<{ message: string; user: Usuario }> {
    return this.http.post<{ message: string; user: Usuario }>(`${environment.apiUrl}/registro`, data);
  }

  // ===== LOGIN PASO 1: credenciales + captcha -> dispara MFA por correo =====
  login(email: string, password: string, captchaRespuesta: number, captchaToken: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, {
      email,
      password,
      captcha_respuesta: captchaRespuesta,
      captcha_token: captchaToken,
    });
  }

  // ===== LOGIN PASO 2: verificar código MFA -> entrega token real =====
  verificarMfa(userId: number, codigo: string): Observable<MfaResponse> {
    return this.http.post<MfaResponse>(`${environment.apiUrl}/verificar-mfa`, {
      user_id: userId,
      codigo,
    }).pipe(
      tap((res) => this.guardarSesionSync(res.token, res.user))
    );
  }

  // ===== LOGOUT =====
  logout(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => this.limpiarSesion())
    );
  }

  // ===== USUARIO AUTENTICADO (desde backend) =====
  me(): Observable<Usuario> {
    return this.http.get<Usuario>(`${environment.apiUrl}/me`);
  }

  // ===== STORAGE (Capacitor Preferences: funciona igual en web, iOS y Android) =====

  private async guardarSesion(token: string, user: Usuario): Promise<void> {
    await Preferences.set({ key: TOKEN_KEY, value: token });
    await Preferences.set({ key: USER_KEY, value: JSON.stringify(user) });
  }

  // Wrapper síncrono para usar dentro de un .pipe(tap(...)) sin romper el Observable
  private guardarSesionSync(token: string, user: Usuario): void {
    this.guardarSesion(token, user);
  }

  async limpiarSesion(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: USER_KEY });
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  }

  async getUsuarioGuardado(): Promise<Usuario | null> {
    const { value } = await Preferences.get({ key: USER_KEY });
    return value ? JSON.parse(value) as Usuario : null;
  }

  async estaLogueado(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Observable helper por si prefieres usarlo en un guard con async/await -> firstValueFrom
  getTokenObservable(): Observable<string | null> {
    return from(this.getToken());
  }
}
'@
Write-Host '  OK -> src/app/services/auth.ts' -ForegroundColor Green

New-Item -ItemType Directory -Force -Path 'src/app/services' | Out-Null
Set-Content -Path 'src/app/services/auth.interceptor.ts' -Encoding UTF8 -Value @'
import { HttpInterceptorFn } from '@angular/common/http';
import { from, switchMap } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

const TOKEN_KEY = 'auth_token';

// Interceptor funcional (standalone). Se registra en app.config.ts con withInterceptors([authInterceptor])
export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // No pegar el token en endpoints públicos (evita mandar headers innecesarios)
  const rutasPublicas = ['/captcha', '/login', '/verificar-mfa', '/registro'];
  const esPublica = rutasPublicas.some(ruta => req.url.includes(ruta));

  if (esPublica) {
    return next(req);
  }

  return from(Preferences.get({ key: TOKEN_KEY })).pipe(
    switchMap(({ value: token }) => {
      const authReq = token
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;
      return next(authReq);
    })
  );
};
'@
Write-Host '  OK -> src/app/services/auth.interceptor.ts' -ForegroundColor Green

New-Item -ItemType Directory -Force -Path 'src/app/pages/login' | Out-Null
Set-Content -Path 'src/app/pages/login/login.page.ts' -Encoding UTF8 -Value @'
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
  shieldCheckmarkOutline, chevronDownOutline, chevronUpOutline, refreshOutline,
  keyOutline, arrowBackOutline
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

  // Paso actual del flujo: 'credenciales' -> 'mfa'
  paso: 'credenciales' | 'mfa' = 'credenciales';

  // --- Paso 1: credenciales ---
  email = '';
  password = '';
  mostrarPassword = false;
  mostrarCaptcha = false;
  recuerdame = false;

  captchaNum1: number | null = null;
  captchaNum2: number | null = null;
  captchaRespuesta: number | null = null;
  captchaToken = '';
  cargandoCaptcha = false;

  // --- Paso 2: MFA ---
  userIdPendiente: number | null = null;
  codigoMfa = '';

  cargando = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    addIcons({
      mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline,
      shieldCheckmarkOutline, chevronDownOutline, chevronUpOutline, refreshOutline,
      keyOutline, arrowBackOutline
    });
  }

  ngOnInit() {
    this.generarCaptcha();
  }

  // Ahora el captcha viene del backend (ya no se genera en el front)
  generarCaptcha() {
    this.cargandoCaptcha = true;
    this.captchaRespuesta = null;
    this.authService.getCaptcha().subscribe({
      next: (res) => {
        this.captchaNum1 = res.numero1;
        this.captchaNum2 = res.numero2;
        this.captchaToken = res.captcha_token;
        this.cargandoCaptcha = false;
      },
      error: () => {
        this.errorMsg = 'No se pudo cargar la verificación humana. Intenta de nuevo.';
        this.cargandoCaptcha = false;
      }
    });
  }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleCaptcha() {
    this.mostrarCaptcha = !this.mostrarCaptcha;
  }

  // ===== PASO 1: enviar credenciales + captcha =====
  login() {
    this.errorMsg = '';

    if (!this.email || !this.password) {
      this.errorMsg = 'Por favor ingresa tu correo y contraseña';
      return;
    }

    if (!this.mostrarCaptcha || this.captchaRespuesta === null) {
      this.errorMsg = 'Por favor completa la verificación humana';
      this.mostrarCaptcha = true;
      return;
    }

    if (!this.captchaToken) {
      this.errorMsg = 'La verificación humana expiró, se generó una nueva';
      this.generarCaptcha();
      return;
    }

    this.cargando = true;

    this.authService.login(this.email, this.password, this.captchaRespuesta, this.captchaToken).subscribe({
      next: (res) => {
        this.cargando = false;
        this.userIdPendiente = res.user_id;
        this.paso = 'mfa';
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Credenciales incorrectas';
        this.generarCaptcha(); // captcha de un solo uso: pedimos uno nuevo tras el intento
      }
    });
  }

  // ===== PASO 2: verificar código MFA =====
  verificarMfa() {
    this.errorMsg = '';

    if (!this.codigoMfa || !this.userIdPendiente) {
      this.errorMsg = 'Ingresa el código que recibiste por correo';
      return;
    }

    this.cargando = true;

    this.authService.verificarMfa(this.userIdPendiente, this.codigoMfa).subscribe({
      next: (res) => {
        this.cargando = false;
        this.redirigirSegunRol(res.user.role);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Código inválido o expirado';
      }
    });
  }

  volverACredenciales() {
    this.paso = 'credenciales';
    this.codigoMfa = '';
    this.errorMsg = '';
    this.generarCaptcha();
  }

  private redirigirSegunRol(role: string) {
    switch (role) {
      case 'superadmin':
      case 'admin':
        this.router.navigate(['/admin']);
        break;
      case 'emprendedor':
        this.router.navigate(['/emprendedor']);
        break;
      default:
        this.router.navigate(['/home']);
    }
  }
}
'@
Write-Host '  OK -> src/app/pages/login/login.page.ts' -ForegroundColor Green

New-Item -ItemType Directory -Force -Path 'src/app/pages/login' | Out-Null
Set-Content -Path 'src/app/pages/login/login.page.html' -Encoding UTF8 -Value @'
<app-header></app-header>

<ion-content [fullscreen]="true">
  <div class="login-container">
    <div class="login-box">

      <!-- ===== PASO 1: CREDENCIALES + CAPTCHA ===== -->
      <ng-container *ngIf="paso === 'credenciales'">

        <h2>BIENVENIDO DE NUEVO</h2>
        <p class="subtitle">Ingresa tus credenciales para continuar</p>

        <div class="form-group">
          <div class="input-icon">
            <ion-icon name="mail-outline"></ion-icon>
            <input type="email" [(ngModel)]="email" placeholder="correo@ejemplo.com" class="custom-input">
          </div>
        </div>

        <div class="form-group">
          <div class="input-icon">
            <ion-icon name="lock-closed-outline"></ion-icon>
            <input [type]="mostrarPassword ? 'text' : 'password'" [(ngModel)]="password" placeholder="••••••••" class="custom-input">
            <ion-icon [name]="mostrarPassword ? 'eye-off-outline' : 'eye-outline'" (click)="togglePassword()" class="eye-icon"></ion-icon>
          </div>
        </div>

        <!-- Captcha real (del backend) -->
        <div class="form-group captcha-group">
          <div class="captcha-box" (click)="toggleCaptcha()">
            <ion-icon name="shield-checkmark-outline"></ion-icon>
            <span>Verificación humana *</span>
            <ion-icon [name]="mostrarCaptcha ? 'chevron-up-outline' : 'chevron-down-outline'" class="ml-auto"></ion-icon>
          </div>
          <div class="captcha-math" *ngIf="mostrarCaptcha">
            <ng-container *ngIf="!cargandoCaptcha; else cargandoCaptchaTpl">
              <span class="num-circle">{{ captchaNum1 }}</span>
              <span class="operador">x</span>
              <span class="num-circle">{{ captchaNum2 }}</span>
              <span class="operador">=</span>
              <input type="number" [(ngModel)]="captchaRespuesta" placeholder="Tu respuesta" class="captcha-input">
              <ion-icon name="refresh-outline" (click)="generarCaptcha()" class="refresh-icon"></ion-icon>
            </ng-container>
            <ng-template #cargandoCaptchaTpl>
              <span>Cargando...</span>
            </ng-template>
          </div>
        </div>

        <div class="form-options">
          <label class="remember">
            <input type="checkbox" [(ngModel)]="recuerdame">
            Recuérdame
          </label>
          <a class="forgot">¿Olvidaste tu contraseña?</a>
        </div>

        <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

        <button class="btn-login" (click)="login()" [disabled]="cargando">
          {{ cargando ? 'Verificando...' : '→ Iniciar Sesión' }}
        </button>

        <p class="register-link">
          ¿No tienes una cuenta? <a routerLink="/registro">¡Regístrate!</a>
        </p>

      </ng-container>

      <!-- ===== PASO 2: CÓDIGO MFA ===== -->
      <ng-container *ngIf="paso === 'mfa'">

        <button class="btn-back" (click)="volverACredenciales()">
          <ion-icon name="arrow-back-outline"></ion-icon> Volver
        </button>

        <h2>VERIFICA TU IDENTIDAD</h2>
        <p class="subtitle">Enviamos un código a {{ email }}</p>

        <div class="form-group">
          <div class="input-icon">
            <ion-icon name="key-outline"></ion-icon>
            <input type="text" [(ngModel)]="codigoMfa" placeholder="Código de 6 dígitos" class="custom-input" maxlength="6">
          </div>
        </div>

        <p class="error-msg" *ngIf="errorMsg">{{ errorMsg }}</p>

        <button class="btn-login" (click)="verificarMfa()" [disabled]="cargando">
          {{ cargando ? 'Verificando...' : '→ Verificar código' }}
        </button>

      </ng-container>

    </div>
  </div>

  <!-- Footer -->
  <footer>
    <div class="footer-content">
      <div class="footer-section">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <div>
          <p><strong>BOSQUE URBANO, 20180</strong></p>
          <p>AGUASCALIENTES, AGS.</p>
        </div>
      </div>
      <div class="footer-section">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="4" width="20" height="16" rx="2"/>
          <path d="m2 7 10 7 10-7"/>
        </svg>
        <div>
          <p><strong>MARKETNOCTURNOAGS&#64;GMAIL.COM</strong></p>
        </div>
      </div>
      <div class="copyright">
        <p><strong>© TODOS LOS DERECHOS RESERVADOS</strong></p>
        <p class="trademark">LAS MARCAS USADAS EN ESTA PÁGINA SON PROPIEDAD DE SUS TITULARES.</p>
      </div>
      <div class="footer-section">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
        <div>
          <p><strong>449 898 8849</strong></p>
        </div>
      </div>
      <div class="social-media">
        <p>NUESTRAS REDES SOCIALES</p>
        <div class="social-icons">
          <a href="https://www.facebook.com/people/Market-Nocturno-Ags/100083598896259/" target="_blank">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
          <a href="https://www.instagram.com/market_nocturno" target="_blank">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a href="https://www.tiktok.com/@marketnocturnoags" target="_blank">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>

</ion-content>
'@
Write-Host '  OK -> src/app/pages/login/login.page.html' -ForegroundColor Green

Write-Host ''
Write-Host 'Listo. Archivos creados/actualizados.' -ForegroundColor Cyan
Write-Host 'IMPORTANTE: revisa src/main.ts a mano para agregar provideHttpClient(withInterceptors([authInterceptor]))' -ForegroundColor Yellow
