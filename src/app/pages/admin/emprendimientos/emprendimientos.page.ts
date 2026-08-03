import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  searchOutline, createOutline, trashOutline, refreshOutline,
  personOutline, closeOutline, saveOutline, star, starOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { EmprendimientoService } from '../../../services/emprendimiento';
import { CategoriaService, Categoria } from '../../../services/categoria';
import { Emprendimiento } from '../../../models/emprendimiento.model';

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
  cargando = true;

  emprendimientos: Emprendimiento[] = [];
  categorias: Categoria[] = [];

  // Modal (solo edición)
  modalAbierto = false;
  guardando = false;
  emprendimientoActual: any = {};

  constructor(
    private emprendimientoService: EmprendimientoService,
    private categoriaService: CategoriaService
  ) {
    addIcons({
      searchOutline, createOutline, trashOutline, refreshOutline,
      personOutline, closeOutline, saveOutline, star, starOutline
    });
  }

  ngOnInit() {
    this.cargarEmprendimientos();
    this.cargarCategorias();
  }

  cargarEmprendimientos() {
    this.cargando = true;
    this.emprendimientoService.getAllAdmin().subscribe({
      next: (data) => {
        this.emprendimientos = data;
        this.cargando = false;
      },
      error: () => {
        this.emprendimientos = [];
        this.cargando = false;
      }
    });
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (data) => { this.categorias = data; },
      error: () => { this.categorias = []; }
    });
  }

  nombreEmprendedor(emp: Emprendimiento): string {
    const e: any = emp.emprendedor;
    if (!e) return '—';
    return `${e.nombre} ${e.apellido_paterno || ''}`.trim();
  }

  get emprendimientosFiltrados(): Emprendimiento[] {
    return this.emprendimientos.filter(emp => {
      const texto = this.textoBusqueda.toLowerCase();
      const coincideTexto = !this.textoBusqueda ||
        emp.nombre.toLowerCase().includes(texto) ||
        (emp.categoria?.nombre.toLowerCase().includes(texto) ?? false) ||
        (emp.descripcion?.toLowerCase().includes(texto) ?? false);

      const coincideCategoria = this.categoriaFiltro === 'todas' ||
        (emp.categoria?.nombre === this.categoriaFiltro);

      const coincideEstado = this.estadoFiltro === 'todos' ||
        emp.estado === this.estadoFiltro;

      return coincideTexto && coincideCategoria && coincideEstado;
    });
  }

  abrirModalEditar(emp: Emprendimiento) {
    this.emprendimientoActual = {
      id: emp.id,
      nombre: emp.nombre,
      categoria_id: emp.categoria_id,
      precio_desde: emp.precio_desde,
      precio_hasta: emp.precio_hasta,
      estado: emp.estado,
      destacado: emp.destacado,
      descripcion: emp.descripcion
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardarEmprendimiento() {
    if (!this.emprendimientoActual.nombre) {
      alert('El nombre es obligatorio');
      return;
    }

    this.guardando = true;
    const { id, ...datos } = this.emprendimientoActual;

    this.emprendimientoService.update(id, datos).subscribe({
      next: () => {
        this.guardando = false;
        this.cerrarModal();
        this.cargarEmprendimientos();
      },
      error: () => {
        this.guardando = false;
        alert('No se pudo actualizar el emprendimiento');
      }
    });
  }

  eliminarEmprendimiento(emp: Emprendimiento) {
    const confirmar = confirm(`¿Seguro que deseas eliminar "${emp.nombre}"?`);
    if (confirmar) {
      this.emprendimientoService.delete(emp.id).subscribe({
        next: () => this.cargarEmprendimientos(),
        error: () => alert('No se pudo eliminar el emprendimiento')
      });
    }
  }

  toggleDestacado(emp: Emprendimiento) {
    this.emprendimientoService.update(emp.id, { destacado: !emp.destacado } as any).subscribe({
      next: () => this.cargarEmprendimientos(),
      error: () => alert('No se pudo actualizar el destacado')
    });
  }

  recargar() {
    this.cargarEmprendimientos();
  }
}