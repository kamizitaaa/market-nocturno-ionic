import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  addOutline, createOutline, trashOutline, closeOutline,
  saveOutline, searchOutline, refreshOutline, peopleOutline, 
  callOutline, mailOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { ConvocatoriaService, Convocatoria } from '../../../services/convocatoria';

@Component({
  selector: 'app-convocatorias',
  templateUrl: './convocatorias.page.html',
  styleUrls: ['./convocatorias.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class ConvocatoriasPage implements OnInit, ViewWillEnter {

  textoBusqueda = '';
  cargando = true;

  convocatorias: Convocatoria[] = [];

  modalAbierto = false;
  modoEdicion = false;
  guardando = false;
  convocatoriaActual: any = this.convocatoriaVacia();

  // Imagen
  archivoSeleccionado: File | null = null;
  subiendoImagen = false;

  // Participantes
  modalParticipantesAbierto = false;
  participantes: any[] = [];
  cargandoParticipantes = false;
  convocatoriaParticipantesTitulo = '';

  constructor(private convocatoriaService: ConvocatoriaService) {
    addIcons({
      addOutline, createOutline, trashOutline, closeOutline,
      saveOutline, searchOutline, refreshOutline, peopleOutline, 
      callOutline, mailOutline
    });
  }

  ngOnInit() {
    this.cargarConvocatorias();
  }

  ionViewWillEnter() {
    this.cargarConvocatorias();
  }

  cargarConvocatorias() {
    this.cargando = true;
    this.convocatoriaService.getAllAdmin().subscribe({
      next: (data) => {
        this.convocatorias = data;
        this.cargando = false;
      },
      error: () => {
        this.convocatorias = [];
        this.cargando = false;
      }
    });
  }

  convocatoriaVacia() {
    return {
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      imagen: '',
      activa: false
    };
  }

  get convocatoriasFiltradas(): Convocatoria[] {
    if (!this.textoBusqueda) return this.convocatorias;
    const texto = this.textoBusqueda.toLowerCase();
    return this.convocatorias.filter(c =>
      c.titulo.toLowerCase().includes(texto) ||
      (c.descripcion?.toLowerCase().includes(texto) ?? false)
    );
  }

  abrirModalNueva() {
    this.modoEdicion = false;
    this.convocatoriaActual = this.convocatoriaVacia();
    this.archivoSeleccionado = null;
    this.modalAbierto = true;
  }

  abrirModalEditar(conv: Convocatoria) {
    this.modoEdicion = true;
    this.convocatoriaActual = {
      id: conv.id,
      titulo: conv.titulo,
      descripcion: conv.descripcion,
      fecha_inicio: conv.fecha_inicio,
      fecha_fin: conv.fecha_fin,
      imagen: conv.imagen,
      activa: conv.activa
    };
    this.archivoSeleccionado = null;
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarConvocatoria() {
    if (!this.convocatoriaActual.titulo || !this.convocatoriaActual.fecha_inicio || !this.convocatoriaActual.fecha_fin) {
      alert('Título, fecha inicio y fecha fin son obligatorios');
      return;
    }

    this.guardando = true;

    if (this.modoEdicion) {
      const { id, imagen, ...datos } = this.convocatoriaActual;
      this.convocatoriaService.update(id, datos).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarConvocatorias();
        },
        error: () => {
          this.guardando = false;
          alert('No se pudo actualizar la convocatoria');
        }
      });
    } else {
      const { imagen, ...datos } = this.convocatoriaActual;
      this.convocatoriaService.create(datos).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarConvocatorias();
        },
        error: () => {
          this.guardando = false;
          alert('No se pudo crear la convocatoria');
        }
      });
    }
  }

  eliminarConvocatoria(conv: Convocatoria) {
    const confirmar = confirm(`¿Eliminar la convocatoria "${conv.titulo}"?`);
    if (confirmar) {
      this.convocatoriaService.delete(conv.id).subscribe({
        next: () => this.cargarConvocatorias(),
        error: () => alert('No se pudo eliminar la convocatoria')
      });
    }
  }

  toggleActiva(conv: Convocatoria) {
    this.convocatoriaService.toggleActiva(conv.id).subscribe({
      next: () => this.cargarConvocatorias(),
      error: () => alert('No se pudo actualizar el estado')
    });
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subirImagen() {
    if (!this.archivoSeleccionado || !this.convocatoriaActual.id) {
      alert('Selecciona una imagen primero');
      return;
    }

    this.subiendoImagen = true;
    this.convocatoriaService.subirImagen(this.convocatoriaActual.id, this.archivoSeleccionado).subscribe({
      next: (res) => {
        this.subiendoImagen = false;
        this.archivoSeleccionado = null;
        this.convocatoriaActual.imagen = res.convocatoria.imagen;
        this.cargarConvocatorias();
      },
      error: () => {
        this.subiendoImagen = false;
        alert('No se pudo subir la imagen');
      }
    });
  }

  verParticipantes(conv: Convocatoria) {
    this.convocatoriaParticipantesTitulo = conv.titulo;
    this.modalParticipantesAbierto = true;
    this.cargandoParticipantes = true;

    this.convocatoriaService.getParticipantes(conv.id).subscribe({
      next: (data) => {
        this.participantes = data;
        this.cargandoParticipantes = false;
      },
      error: () => {
        this.participantes = [];
        this.cargandoParticipantes = false;
      }
    });
  }

  cerrarModalParticipantes() {
    this.modalParticipantesAbierto = false;
    this.participantes = [];
  }

  recargar() {
    this.cargarConvocatorias();
  }
}