import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline, trashOutline, refreshOutline, eyeOutline,
  closeOutline, mailOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { ContactoService, ContactoMensaje } from '../../../services/contacto';

interface SolicitudContacto {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  fecha: string;
}

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  styleUrls: ['./contacto.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class ContactoPage implements OnInit {

  textoBusqueda = '';
  cargando = false;
  cargandoRecarga = false;

  solicitudes: SolicitudContacto[] = [];

  // Modal detalle
  modalAbierto = false;
  solicitudSeleccionada: SolicitudContacto | null = null;

  constructor(private contactoService: ContactoService) {
    addIcons({
      searchOutline, trashOutline, refreshOutline, eyeOutline,
      closeOutline, mailOutline
    });
  }

  ngOnInit() {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.cargando = true;
    this.cargandoRecarga = true;

    this.contactoService.getAllAdmin().subscribe({
      next: (mensajes: ContactoMensaje[]) => {
        this.solicitudes = mensajes.map(m => ({
          id: m.id,
          nombre: m.nombre,
          email: m.email,
          asunto: m.asunto,
          mensaje: m.mensaje,
          fecha: m.created_at
        }));
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      },
      error: (err) => {
        console.error('Error al cargar solicitudes de contacto:', err);
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      }
    });
  }

  get solicitudesFiltradas(): SolicitudContacto[] {
    if (!this.textoBusqueda) return this.solicitudes;
    const texto = this.textoBusqueda.toLowerCase();
    return this.solicitudes.filter(s =>
      s.nombre.toLowerCase().includes(texto) ||
      s.email.toLowerCase().includes(texto) ||
      s.asunto.toLowerCase().includes(texto)
    );
  }

  verDetalle(solicitud: SolicitudContacto) {
    this.solicitudSeleccionada = solicitud;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.solicitudSeleccionada = null;
  }

  eliminarSolicitud(solicitud: SolicitudContacto) {
    const confirmar = confirm(`¿Eliminar el mensaje de "${solicitud.nombre}"?`);
    if (!confirmar) return;

    this.contactoService.eliminar(solicitud.id).subscribe({
      next: () => {
        this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
        if (this.solicitudSeleccionada?.id === solicitud.id) {
          this.cerrarModal();
        }
      },
      error: (err) => {
        console.error('Error al eliminar mensaje de contacto:', err);
        alert('No se pudo eliminar el mensaje. Intenta de nuevo.');
      }
    });
  }

  recargar() {
    this.cargarSolicitudes();
  }
}