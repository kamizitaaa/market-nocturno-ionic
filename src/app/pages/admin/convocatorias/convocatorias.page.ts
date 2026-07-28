import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addOutline, createOutline, trashOutline, closeOutline,
  saveOutline, searchOutline, refreshOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';

interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
  activa: boolean;
}

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
export class ConvocatoriasPage implements OnInit {

  textoBusqueda = '';

  convocatorias: Convocatoria[] = [
    {
      id: 1,
      titulo: 'Convocatoria Edición Agosto 2026',
      descripcion: 'Abrimos convocatoria para nuevos emprendedores que quieran participar en la edición de agosto del Market Nocturno.',
      fechaInicio: '2026-07-25',
      fechaFin: '2026-08-10',
      imagen: 'https://via.placeholder.com/400x250',
      activa: true
    },
    {
      id: 2,
      titulo: 'Convocatoria Zona de Artesanías',
      descripcion: 'Buscamos artesanos locales para ampliar la zona de artesanías del mercado.',
      fechaInicio: '2026-06-01',
      fechaFin: '2026-06-30',
      imagen: 'https://via.placeholder.com/400x250',
      activa: false
    }
  ];

  modalAbierto = false;
  modoEdicion = false;
  convocatoriaActual: Convocatoria = this.convocatoriaVacia();

  constructor() {
    addIcons({
      addOutline, createOutline, trashOutline, closeOutline,
      saveOutline, searchOutline, refreshOutline
    });
  }

  ngOnInit() {}

  convocatoriaVacia(): Convocatoria {
    return {
      id: 0,
      titulo: '',
      descripcion: '',
      fechaInicio: '',
      fechaFin: '',
      imagen: '',
      activa: false
    };
  }

  get convocatoriasFiltradas(): Convocatoria[] {
    if (!this.textoBusqueda) return this.convocatorias;
    const texto = this.textoBusqueda.toLowerCase();
    return this.convocatorias.filter(c =>
      c.titulo.toLowerCase().includes(texto) ||
      c.descripcion.toLowerCase().includes(texto)
    );
  }

  abrirModalNueva() {
    this.modoEdicion = false;
    this.convocatoriaActual = this.convocatoriaVacia();
    this.modalAbierto = true;
  }

  abrirModalEditar(conv: Convocatoria) {
    this.modoEdicion = true;
    this.convocatoriaActual = { ...conv };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarConvocatoria() {
    if (!this.convocatoriaActual.titulo || !this.convocatoriaActual.fechaInicio || !this.convocatoriaActual.fechaFin) {
      return;
    }

    if (this.modoEdicion) {
      const index = this.convocatorias.findIndex(c => c.id === this.convocatoriaActual.id);
      if (index !== -1) this.convocatorias[index] = { ...this.convocatoriaActual };
    } else {
      const nuevoId = this.convocatorias.length > 0
        ? Math.max(...this.convocatorias.map(c => c.id)) + 1
        : 1;
      this.convocatorias.push({ ...this.convocatoriaActual, id: nuevoId });
    }

    this.cerrarModal();
  }

  eliminarConvocatoria(conv: Convocatoria) {
    const confirmar = confirm(`¿Eliminar la convocatoria "${conv.titulo}"?`);
    if (confirmar) {
      this.convocatorias = this.convocatorias.filter(c => c.id !== conv.id);
    }
  }

  toggleActiva(conv: Convocatoria) {
    conv.activa = !conv.activa;
    // Aquí luego llamas al backend para persistir el cambio
  }

  recargar() {
    console.log('Recargando convocatorias...');
  }
}