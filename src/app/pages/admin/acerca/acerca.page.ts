import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  saveOutline, addOutline, createOutline, trashOutline,
  closeOutline, imageOutline, personOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';

interface MiembroEquipo {
  id: number;
  nombre: string;
  puesto: string;
  foto: string;
  descripcion: string;
}

interface ImagenGaleria {
  id: number;
  url: string;
  titulo: string;
}

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
export class AcercaPage implements OnInit {

  // ===== HISTORIA =====
  historia = {
    titulo: 'Nuestra Historia',
    texto: 'El Market Nocturno nació en 2023 con la idea de dar un espacio a los emprendedores locales de Aguascalientes...',
    imagen: 'https://via.placeholder.com/600x400'
  };

  // ===== MISIÓN Y VISIÓN =====
  mision = 'Impulsar el crecimiento de los emprendedores locales, brindando un espacio seguro y accesible para exponer sus productos.';
  vision = 'Ser el mercado nocturno más reconocido de la región, referente de apoyo al talento local.';

  // ===== EQUIPO =====
  equipo: MiembroEquipo[] = [
    {
      id: 1,
      nombre: 'Ana López',
      puesto: 'Fundadora y Directora',
      foto: 'https://via.placeholder.com/200x200',
      descripcion: 'Encargada de la organización general del evento.'
    },
    {
      id: 2,
      nombre: 'Carlos Ruiz',
      puesto: 'Coordinador de Logística',
      foto: 'https://via.placeholder.com/200x200',
      descripcion: 'Responsable del montaje y distribución de espacios.'
    }
  ];

  modalEquipoAbierto = false;
  modoEdicionEquipo = false;
  miembroActual: MiembroEquipo = this.miembroVacio();

  // ===== GALERÍA =====
  galeria: ImagenGaleria[] = [
    { id: 1, url: 'https://via.placeholder.com/300x300', titulo: 'Edición Enero 2026' },
    { id: 2, url: 'https://via.placeholder.com/300x300', titulo: 'Edición Febrero 2026' }
  ];

  modalGaleriaAbierto = false;
  imagenActual: ImagenGaleria = this.imagenVacia();

  constructor() {
    addIcons({
      saveOutline, addOutline, createOutline, trashOutline,
      closeOutline, imageOutline, personOutline
    });
  }

  ngOnInit() {}

  // ===== ACCIONES HISTORIA =====
  guardarHistoria() {
    console.log('Historia guardada:', this.historia);
    // Aquí luego llamas al backend
    alert('Historia guardada correctamente');
  }

  // ===== ACCIONES MISIÓN Y VISIÓN =====
  guardarMisionVision() {
    console.log('Misión y visión guardadas:', { mision: this.mision, vision: this.vision });
    alert('Misión y visión guardadas correctamente');
  }

  // ===== ACCIONES EQUIPO =====
  miembroVacio(): MiembroEquipo {
    return { id: 0, nombre: '', puesto: '', foto: '', descripcion: '' };
  }

  abrirModalNuevoMiembro() {
    this.modoEdicionEquipo = false;
    this.miembroActual = this.miembroVacio();
    this.modalEquipoAbierto = true;
  }

  abrirModalEditarMiembro(miembro: MiembroEquipo) {
    this.modoEdicionEquipo = true;
    this.miembroActual = { ...miembro };
    this.modalEquipoAbierto = true;
  }

  cerrarModalEquipo() {
    this.modalEquipoAbierto = false;
  }

  guardarMiembro() {
    if (!this.miembroActual.nombre || !this.miembroActual.puesto) return;

    if (this.modoEdicionEquipo) {
      const index = this.equipo.findIndex(m => m.id === this.miembroActual.id);
      if (index !== -1) this.equipo[index] = { ...this.miembroActual };
    } else {
      const nuevoId = this.equipo.length > 0 ? Math.max(...this.equipo.map(m => m.id)) + 1 : 1;
      this.equipo.push({ ...this.miembroActual, id: nuevoId });
    }
    this.cerrarModalEquipo();
  }

  eliminarMiembro(miembro: MiembroEquipo) {
    if (confirm(`¿Eliminar a "${miembro.nombre}" del equipo?`)) {
      this.equipo = this.equipo.filter(m => m.id !== miembro.id);
    }
  }

  // ===== ACCIONES GALERÍA =====
  imagenVacia(): ImagenGaleria {
    return { id: 0, url: '', titulo: '' };
  }

  abrirModalGaleria() {
    this.imagenActual = this.imagenVacia();
    this.modalGaleriaAbierto = true;
  }

  cerrarModalGaleria() {
    this.modalGaleriaAbierto = false;
  }

  agregarImagenGaleria() {
    if (!this.imagenActual.url) return;
    const nuevoId = this.galeria.length > 0 ? Math.max(...this.galeria.map(g => g.id)) + 1 : 1;
    this.galeria.push({ ...this.imagenActual, id: nuevoId });
    this.cerrarModalGaleria();
  }

  eliminarImagenGaleria(imagen: ImagenGaleria) {
    if (confirm('¿Eliminar esta imagen de la galería?')) {
      this.galeria = this.galeria.filter(g => g.id !== imagen.id);
    }
  }
}