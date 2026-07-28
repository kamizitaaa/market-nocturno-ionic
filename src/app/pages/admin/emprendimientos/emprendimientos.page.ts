import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline, createOutline, trashOutline, refreshOutline,
  personOutline, closeOutline, saveOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';

interface Emprendedor {
  id: number;
  nombre: string;
}

interface Emprendimiento {
  id: number;
  nombre: string;
  emprendedorId: number;
  emprendedorNombre: string;
  categoria: string;
  precio: string;
  estado: 'activo' | 'inactivo' | 'destacado';
  fecha: string;
  descripcion: string;
}

@Component({
  selector: 'app-emprendimientos',
  templateUrl: './emprendimientos.page.html',
  styleUrls: ['./emprendimientos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class EmprendimientosPage implements OnInit {

  textoBusqueda = '';
  categoriaFiltro = 'todas';
  estadoFiltro = 'todos';

  categorias = ['Comida', 'Artesanías', 'Ropa', 'Belleza', 'Accesorios'];

  emprendedores: Emprendedor[] = [
    { id: 1, nombre: 'María García' },
    { id: 2, nombre: 'Lupita Martínez' }
  ];

  emprendimientos: Emprendimiento[] = [
    {
      id: 1,
      nombre: 'Tacos El Güero',
      emprendedorId: 1,
      emprendedorNombre: 'María García',
      categoria: 'Comida',
      precio: '$50-100',
      estado: 'activo',
      fecha: '2026-01-15',
      descripcion: 'Los mejores tacos de la noche.'
    },
    {
      id: 2,
      nombre: 'Artesanías Lupita',
      emprendedorId: 2,
      emprendedorNombre: 'Lupita Martínez',
      categoria: 'Artesanías',
      precio: '$100-500',
      estado: 'destacado',
      fecha: '2026-02-20',
      descripcion: 'Artesanías hechas a mano.'
    }
  ];

  // Modal
  modalAbierto = false;
  modoEdicion = false;
  emprendimientoActual: Emprendimiento = this.emprendimientoVacio();

  constructor() {
    addIcons({
      searchOutline, createOutline, trashOutline, refreshOutline,
      personOutline, closeOutline, saveOutline
    });
  }

  ngOnInit() {}

  emprendimientoVacio(): Emprendimiento {
    return {
      id: 0,
      nombre: '',
      emprendedorId: 0,
      emprendedorNombre: '',
      categoria: '',
      precio: '',
      estado: 'activo',
      fecha: new Date().toISOString().split('T')[0],
      descripcion: ''
    };
  }

  get emprendimientosFiltrados(): Emprendimiento[] {
    return this.emprendimientos.filter(emp => {
      const coincideTexto = !this.textoBusqueda ||
        emp.nombre.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        emp.categoria.toLowerCase().includes(this.textoBusqueda.toLowerCase()) ||
        emp.descripcion.toLowerCase().includes(this.textoBusqueda.toLowerCase());

      const coincideCategoria = this.categoriaFiltro === 'todas' ||
        emp.categoria === this.categoriaFiltro;

      const coincideEstado = this.estadoFiltro === 'todos' ||
        emp.estado === this.estadoFiltro;

      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.emprendimientoActual = this.emprendimientoVacio();
    this.modalAbierto = true;
  }

  abrirModalEditar(emp: Emprendimiento) {
    this.modoEdicion = true;
    this.emprendimientoActual = { ...emp };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  onEmprendedorChange() {
    const seleccionado = this.emprendedores.find(
      e => e.id === Number(this.emprendimientoActual.emprendedorId)
    );
    this.emprendimientoActual.emprendedorNombre = seleccionado ? seleccionado.nombre : '';
  }

  guardarEmprendimiento() {
    if (!this.emprendimientoActual.nombre || !this.emprendimientoActual.emprendedorId) {
      return;
    }

    if (this.modoEdicion) {
      const index = this.emprendimientos.findIndex(e => e.id === this.emprendimientoActual.id);
      if (index !== -1) {
        this.emprendimientos[index] = { ...this.emprendimientoActual };
      }
    } else {
      const nuevoId = this.emprendimientos.length > 0
        ? Math.max(...this.emprendimientos.map(e => e.id)) + 1
        : 1;
      this.emprendimientos.push({ ...this.emprendimientoActual, id: nuevoId });
    }

    this.cerrarModal();
  }

  eliminarEmprendimiento(emp: Emprendimiento) {
    const confirmar = confirm(`¿Seguro que deseas eliminar "${emp.nombre}"?`);
    if (confirmar) {
      this.emprendimientos = this.emprendimientos.filter(e => e.id !== emp.id);
    }
  }

  recargar() {
    // Aquí luego conectas la llamada real al backend
    console.log('Recargando emprendimientos...');
  }
}