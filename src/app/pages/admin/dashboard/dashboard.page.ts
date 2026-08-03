import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  peopleOutline, pulseOutline, addCircleOutline, starOutline,
  searchOutline, downloadOutline, createOutline, trashOutline,
  personOutline, refreshOutline, closeOutline, saveOutline,
  pricetagOutline, checkmarkOutline, addOutline,
  briefcaseOutline, personAddOutline, peopleCircleOutline, megaphoneOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { AdminService, Stats, Emprendedor } from '../../../services/admin';
import { AuthService } from '../../../services/auth';
import { CategoriaService, Categoria } from '../../../services/categoria';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    AdminHeaderComponent
  ]
})
export class DashboardPage implements OnInit, ViewWillEnter {

  textoBusqueda = '';
  cargando = true;
  rolActual = '';
  cargandoRecarga = false;

  stats: Stats = {
    total: 0,
    activos: 0,
    nuevos: 0,
    destacados: 0,
    total_emprendedores: 0,
    nuevos_emprendedores: 0,
    total_clientes: 0,
    convocatorias_activas: 0
  };

  emprendedores: Emprendedor[] = [];

  // Modal emprendedor
  modalAbierto = false;
  modoEdicion = false;
  guardando = false;
  emprendedorActualId: number | null = null;

  form = {
    nombre: '',
    apellido_paterno: '',
    apellido_materno: '',
    telefono: '',
    email: '',
    password: '',
    role: 'emprendedor'
  };

  // Modal categorías
  modalCategoriasAbierto = false;
  categorias: Categoria[] = [];
  cargandoCategorias = false;
  nuevaCategoriaNombre = '';
  guardandoCategoria = false;
  editandoCategoriaId: number | null = null;
  editandoCategoriaNombre = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private categoriaService: CategoriaService
  ) {
    addIcons({
      peopleOutline, pulseOutline, addCircleOutline, starOutline,
      searchOutline, downloadOutline, createOutline, trashOutline,
      personOutline, refreshOutline, closeOutline, saveOutline,
      pricetagOutline, checkmarkOutline, addOutline,
      briefcaseOutline, personAddOutline, peopleCircleOutline, megaphoneOutline
    });
  }

  async ngOnInit() {
    this.rolActual = await this.authService.getRol() || '';
    this.cargarStats();
    this.cargarEmprendedores();
  }

  ionViewWillEnter() {
    this.cargarStats();
    this.cargarEmprendedores();
  }

  cargarStats() {
    this.adminService.getStats().subscribe({
      next: (data) => { this.stats = data; },
      error: () => { console.error('No se pudieron cargar las estadísticas'); }
    });
  }

  cargarEmprendedores() {
    this.cargando = true;
    this.cargandoRecarga = true;

    this.adminService.getEmprendedores().subscribe({
      next: (data) => {
        this.emprendedores = data;
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      },
      error: () => {
        this.emprendedores = [];
        this.cargando = false;
        setTimeout(() => this.cargandoRecarga = false, 400);
      }
    });
  }

  nombreCompleto(e: Emprendedor): string {
    return `${e.nombre} ${e.apellido_paterno} ${e.apellido_materno || ''}`.trim();
  }

  get emprendedoresFiltrados() {
    if (!this.textoBusqueda) return this.emprendedores;
    const texto = this.textoBusqueda.toLowerCase();
    return this.emprendedores.filter(e =>
      this.nombreCompleto(e).toLowerCase().includes(texto) ||
      e.email.toLowerCase().includes(texto)
    );
  }

  formVacio() {
    return {
      nombre: '', apellido_paterno: '', apellido_materno: '',
      telefono: '', email: '', password: '', role: 'emprendedor'
    };
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.emprendedorActualId = null;
    this.form = this.formVacio();
    this.form.role = 'emprendedor';
    this.modalAbierto = true;
  }

  abrirModalEditar(e: Emprendedor) {
    this.modoEdicion = true;
    this.emprendedorActualId = e.id;
    this.form = {
      nombre: e.nombre,
      apellido_paterno: e.apellido_paterno,
      apellido_materno: e.apellido_materno || '',
      telefono: e.telefono,
      email: e.email,
      password: '',
      role: 'emprendedor'
    };
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  guardar() {
    if (!this.form.nombre || !this.form.apellido_paterno || !this.form.email || !this.form.telefono) {
      alert('Nombre, apellido paterno, correo y teléfono son obligatorios');
      return;
    }

    if (!this.modoEdicion && (!this.form.password || this.form.password.length < 8)) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.guardando = true;

    if (this.modoEdicion && this.emprendedorActualId) {
      const { password, role, ...datosEdicion } = this.form;
      this.adminService.actualizarEmprendedor(this.emprendedorActualId, datosEdicion).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarEmprendedores();
          this.cargarStats();
        },
        error: (err) => {
          this.guardando = false;
          this.mostrarError(err);
        }
      });
    } else {
      this.adminService.crearEmprendedor(this.form).subscribe({
        next: () => {
          this.guardando = false;
          this.cerrarModal();
          this.cargarEmprendedores();
          this.cargarStats();
        },
        error: (err) => {
          this.guardando = false;
          this.mostrarError(err);
        }
      });
    }
  }

  mostrarError(err: any) {
    if (err.status === 422 && err.error?.errors) {
      const mensajes = ([] as string[]).concat(...Object.values(err.error.errors) as string[][]).join('\n');
      alert(mensajes);
    } else if (err.status === 403 && err.error?.message) {
      alert(err.error.message);
    } else {
      alert('No se pudo completar la acción');
    }
  }

  eliminarEmprendedor(e: Emprendedor) {
    if (!confirm(`¿Eliminar a "${this.nombreCompleto(e)}"? Esto también eliminará su cuenta de acceso.`)) return;

    this.adminService.eliminarEmprendedor(e.id).subscribe({
      next: () => {
        this.cargarEmprendedores();
        this.cargarStats();
      },
      error: () => alert('No se pudo eliminar el emprendedor')
    });
  }

  toggleMfa(e: Emprendedor) {
    this.adminService.toggleMfa(e.id).subscribe({
      next: (res) => {
        e.mfa_enabled = res.usuario.mfa_enabled;
      },
      error: () => alert('No se pudo actualizar el MFA')
    });
  }

  // ===== CATEGORÍAS =====

  abrirModalCategorias() {
    this.modalCategoriasAbierto = true;
    this.cargarCategorias();
  }

  cerrarModalCategorias() {
    this.modalCategoriasAbierto = false;
    this.nuevaCategoriaNombre = '';
    this.editandoCategoriaId = null;
  }

  cargarCategorias() {
    this.cargandoCategorias = true;
    this.categoriaService.getAll().subscribe({
      next: (data) => {
        this.categorias = data;
        this.cargandoCategorias = false;
      },
      error: () => {
        this.categorias = [];
        this.cargandoCategorias = false;
      }
    });
  }

  crearCategoria() {
    if (!this.nuevaCategoriaNombre.trim()) {
      alert('Escribe un nombre para la categoría');
      return;
    }

    this.guardandoCategoria = true;
    this.categoriaService.create({ nombre: this.nuevaCategoriaNombre.trim() }).subscribe({
      next: () => {
        this.guardandoCategoria = false;
        this.nuevaCategoriaNombre = '';
        this.cargarCategorias();
      },
      error: (err) => {
        this.guardandoCategoria = false;
        this.mostrarError(err);
      }
    });
  }

  iniciarEdicionCategoria(cat: Categoria) {
    this.editandoCategoriaId = cat.id;
    this.editandoCategoriaNombre = cat.nombre;
  }

  cancelarEdicionCategoria() {
    this.editandoCategoriaId = null;
    this.editandoCategoriaNombre = '';
  }

  guardarEdicionCategoria(cat: Categoria) {
    if (!this.editandoCategoriaNombre.trim()) {
      alert('El nombre no puede estar vacío');
      return;
    }

    this.categoriaService.update(cat.id, { nombre: this.editandoCategoriaNombre.trim() }).subscribe({
      next: () => {
        this.cancelarEdicionCategoria();
        this.cargarCategorias();
      },
      error: (err) => this.mostrarError(err)
    });
  }

  toggleActivaCategoria(cat: Categoria) {
    this.categoriaService.update(cat.id, { activa: !cat.activa }).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => this.mostrarError(err)
    });
  }

  eliminarCategoria(cat: Categoria) {
    if (!confirm(`¿Eliminar la categoría "${cat.nombre}"? Los emprendimientos que la usan quedarán sin categoría.`)) return;

    this.categoriaService.delete(cat.id).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => this.mostrarError(err)
    });
  }
}