import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  refreshOutline, logOutOutline, searchOutline,
  desktopOutline, phonePortraitOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { SessionService, UserSession } from '../../../services/session';

@Component({
  selector: 'app-sesiones',
  templateUrl: './sesiones.page.html',
  styleUrls: ['./sesiones.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class SesionesPage implements OnInit, ViewWillEnter {

  sesiones: UserSession[] = [];
  cargando = true;
  textoBusqueda = '';

  constructor(private sessionService: SessionService) {
    addIcons({
      refreshOutline, logOutOutline, searchOutline,
      desktopOutline, phonePortraitOutline
    });
  }

  ngOnInit() {
    this.cargarSesiones();
  }

  ionViewWillEnter() {
    this.cargarSesiones();
  }

  cargarSesiones() {
    this.cargando = true;
    this.sessionService.getAll().subscribe({
      next: (data) => {
        this.sesiones = data;
        this.cargando = false;
      },
      error: () => {
        this.sesiones = [];
        this.cargando = false;
      }
    });
  }

  nombreUsuario(sesion: UserSession): string {
    const u = sesion.user;
    if (!u) return '—';
    return `${u.nombre} ${u.apellido_paterno} ${u.apellido_materno || ''}`.trim();
  }

  navegadorLegible(userAgent: string): string {
    if (!userAgent) return 'Desconocido';
    if (userAgent.includes('Edg')) return 'Microsoft Edge';
    if (userAgent.includes('Chrome')) return 'Google Chrome';
    if (userAgent.includes('Firefox')) return 'Mozilla Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    return 'Navegador desconocido';
  }

  esMovil(userAgent: string): boolean {
    return /Mobile|Android|iPhone/i.test(userAgent || '');
  }

  get sesionesFiltradas(): UserSession[] {
    if (!this.textoBusqueda) return this.sesiones;
    const texto = this.textoBusqueda.toLowerCase();
    return this.sesiones.filter(s =>
      this.nombreUsuario(s).toLowerCase().includes(texto) ||
      s.user?.email.toLowerCase().includes(texto)
    );
  }

  cerrarSesion(sesion: UserSession) {
    const confirmar = confirm(`¿Cerrar la sesión de "${this.nombreUsuario(sesion)}"? Esto lo desconectará inmediatamente.`);
    if (!confirmar) return;

    this.sessionService.cerrar(sesion.id).subscribe({
      next: () => this.cargarSesiones(),
      error: () => alert('No se pudo cerrar la sesión')
    });
  }

  recargar() {
    this.cargarSesiones();
  }
}