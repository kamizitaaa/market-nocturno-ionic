import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  saveOutline, addOutline, createOutline, trashOutline,
  closeOutline, imageOutline, personOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { AcercaService, AcercaInfo, MiembroEquipo, ImagenGaleria } from '../../../services/acerca';

@Component({
  selector: 'app-acerca',
  templateUrl: './acerca.page.html',
  styleUrls: ['./acerca.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class AcercaPage implements OnInit, ViewWillEnter {

  cargando = true;

  // ===== HISTORIA / MISIÓN / VISIÓN =====
  info: AcercaInfo | null = null;
  form = {
    historia_titulo: '',
    historia_texto: '',
    mision: '',
    vision: ''
  };
  guardandoInfo = false;

  archivoHistoria: File | null = null;
  subiendoImagenHistoria = false;

  // ===== EQUIPO =====
  equipo: MiembroEquipo[] = [];
  modalEquipoAbierto = false;
  modoEdicionEquipo = false;
  guardandoMiembro = false;
  miembroActual: any = this.miembroVacio();
  archivoFoto: File | null = null;
  subiendoFoto = false;

  // ===== GALERÍA =====
  galeria: ImagenGaleria[] = [];
  modalGaleriaAbierto = false;
  guardandoImagen = false;
  archivoGaleria: File | null = null;
  tituloGaleria = '';

  constructor(private acercaService: AcercaService) {
    addIcons({
      saveOutline, addOutline, createOutline, trashOutline,
      closeOutline, imageOutline, personOutline
    });
  }

  ngOnInit() {
    this.cargarTodo();
  }

  ionViewWillEnter() {
    this.cargarTodo();
  }

  cargarTodo() {
    this.cargarInfo();
    this.cargarEquipo();
    this.cargarGaleria();
  }

  cargarInfo() {
    this.cargando = true;
    this.acercaService.getInfo().subscribe({
      next: (data) => {
        this.info = data;
        this.form = {
          historia_titulo: data.historia_titulo || '',
          historia_texto: data.historia_texto || '',
          mision: data.mision || '',
          vision: data.vision || ''
        };
        this.cargando = false;
      },
      error: () => { this.cargando = false; }
    });
  }

  cargarEquipo() {
    this.acercaService.getEquipo().subscribe({
      next: (data) => { this.equipo = data; },
      error: () => { this.equipo = []; }
    });
  }

  cargarGaleria() {
    this.acercaService.getGaleria().subscribe({
      next: (data) => { this.galeria = data; },
      error: () => { this.galeria = []; }
    });
  }

  // ===== HISTORIA =====
  guardarHistoria() {
    this.guardandoInfo = true;
    this.acercaService.updateInfo({
      historia_titulo: this.form.historia_titulo,
      historia_texto: this.form.historia_texto
    }).subscribe({
      next: () => {
        this.guardandoInfo = false;
        alert('Historia guardada correctamente');
        this.cargarInfo();
      },
      error: () => {
        this.guardandoInfo = false;
        alert('No se pudo guardar la historia');
      }
    });
  }

  onArchivoHistoria(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoHistoria = input.files[0];
    }
  }

  subirImagenHistoria() {
    if (!this.archivoHistoria) {
      alert('Selecciona una imagen primero');
      return;
    }

    this.subiendoImagenHistoria = true;
    this.acercaService.subirImagenHistoria(this.archivoHistoria).subscribe({
      next: () => {
        this.subiendoImagenHistoria = false;
        this.archivoHistoria = null;
        this.cargarInfo();
      },
      error: () => {
        this.subiendoImagenHistoria = false;
        alert('No se pudo subir la imagen');
      }
    });
  }

  // ===== MISIÓN Y VISIÓN =====
  guardarMisionVision() {
    this.guardandoInfo = true;
    this.acercaService.updateInfo({
      mision: this.form.mision,
      vision: this.form.vision
    }).subscribe({
      next: () => {
        this.guardandoInfo = false;
        alert('Misión y visión guardadas correctamente');
        this.cargarInfo();
      },
      error: () => {
        this.guardandoInfo = false;
        alert('No se pudo guardar');
      }
    });
  }

  // ===== EQUIPO =====
  miembroVacio() {
    return { nombre: '', puesto: '', descripcion: '', orden: 0 };
  }

  abrirModalNuevoMiembro() {
    this.modoEdicionEquipo = false;
    this.miembroActual = this.miembroVacio();
    this.archivoFoto = null;
    this.modalEquipoAbierto = true;
  }

  abrirModalEditarMiembro(miembro: MiembroEquipo) {
    this.modoEdicionEquipo = true;
    this.miembroActual = {
      id: miembro.id,
      nombre: miembro.nombre,
      puesto: miembro.puesto,
      descripcion: miembro.descripcion,
      orden: miembro.orden,
      foto: miembro.foto
    };
    this.archivoFoto = null;
    this.modalEquipoAbierto = true;
  }

  cerrarModalEquipo() {
    this.modalEquipoAbierto = false;
  }

  guardarMiembro() {
    if (!this.miembroActual.nombre || !this.miembroActual.puesto) {
      alert('Nombre y puesto son obligatorios');
      return;
    }

    this.guardandoMiembro = true;

    if (this.modoEdicionEquipo) {
      const { id, foto, ...datos } = this.miembroActual;
      this.acercaService.actualizarMiembro(id, datos).subscribe({
        next: () => {
          this.guardandoMiembro = false;
          this.cerrarModalEquipo();
          this.cargarEquipo();
        },
        error: () => {
          this.guardandoMiembro = false;
          alert('No se pudo actualizar el integrante');
        }
      });
    } else {
      this.acercaService.crearMiembro(this.miembroActual).subscribe({
        next: () => {
          this.guardandoMiembro = false;
          this.cerrarModalEquipo();
          this.cargarEquipo();
        },
        error: () => {
          this.guardandoMiembro = false;
          alert('No se pudo crear el integrante');
        }
      });
    }
  }

  eliminarMiembro(miembro: MiembroEquipo) {
    if (confirm(`¿Eliminar a "${miembro.nombre}" del equipo?`)) {
      this.acercaService.eliminarMiembro(miembro.id).subscribe({
        next: () => this.cargarEquipo(),
        error: () => alert('No se pudo eliminar el integrante')
      });
    }
  }

  onArchivoFoto(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoFoto = input.files[0];
    }
  }

  subirFoto() {
    if (!this.archivoFoto || !this.miembroActual.id) {
      alert('Selecciona una foto primero');
      return;
    }

    this.subiendoFoto = true;
    this.acercaService.subirFotoMiembro(this.miembroActual.id, this.archivoFoto).subscribe({
      next: (res) => {
        this.subiendoFoto = false;
        this.archivoFoto = null;
        this.miembroActual.foto = res.miembro.foto;
        this.cargarEquipo();
      },
      error: () => {
        this.subiendoFoto = false;
        alert('No se pudo subir la foto');
      }
    });
  }

  // ===== GALERÍA =====
  abrirModalGaleria() {
    this.archivoGaleria = null;
    this.tituloGaleria = '';
    this.modalGaleriaAbierto = true;
  }

  cerrarModalGaleria() {
    this.modalGaleriaAbierto = false;
  }

  onArchivoGaleria(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoGaleria = input.files[0];
    }
  }

  agregarImagenGaleria() {
    if (!this.archivoGaleria) {
      alert('Selecciona una imagen');
      return;
    }

    this.guardandoImagen = true;
    this.acercaService.agregarImagenGaleria(this.archivoGaleria, this.tituloGaleria).subscribe({
      next: () => {
        this.guardandoImagen = false;
        this.cerrarModalGaleria();
        this.cargarGaleria();
      },
      error: () => {
        this.guardandoImagen = false;
        alert('No se pudo agregar la imagen');
      }
    });
  }

  eliminarImagenGaleria(imagen: ImagenGaleria) {
    if (confirm('¿Eliminar esta imagen de la galería?')) {
      this.acercaService.eliminarImagenGaleria(imagen.id).subscribe({
        next: () => this.cargarGaleria(),
        error: () => alert('No se pudo eliminar la imagen')
      });
    }
  }
}