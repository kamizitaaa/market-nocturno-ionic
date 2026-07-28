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

  solicitudes: SolicitudContacto[] = [
    {
      id: 1,
      nombre: 'Jorge Hernández',
      email: 'jorge.hdz@gmail.com',
      asunto: '¿Cómo puedo registrar mi emprendimiento?',
      mensaje: 'Hola, tengo un negocio de postres y me gustaría participar en el próximo Market Nocturno. ¿Qué requisitos necesito?',
      fecha: '2026-07-20'
    },
    {
      id: 2,
      nombre: 'Paola Sánchez',
      email: 'paola.sanchez@hotmail.com',
      asunto: 'Duda sobre horarios',
      mensaje: '¿A qué hora abre el evento este fin de semana? Vi que cambió respecto al mes pasado.',
      fecha: '2026-07-22'
    }
  ];

  // Modal detalle
  modalAbierto = false;
  solicitudSeleccionada: SolicitudContacto | null = null;

  constructor() {
    addIcons({
      searchOutline, trashOutline, refreshOutline, eyeOutline,
      closeOutline, mailOutline
    });
  }

  ngOnInit() {}

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
    if (confirmar) {
      this.solicitudes = this.solicitudes.filter(s => s.id !== solicitud.id);
      if (this.solicitudSeleccionada?.id === solicitud.id) {
        this.cerrarModal();
      }
    }
  }

  recargar() {
    // Aquí luego conectas la llamada real al backend
    console.log('Recargando solicitudes de contacto...');
  }
}