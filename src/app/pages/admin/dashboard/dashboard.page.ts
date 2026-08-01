import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  peopleOutline, pulseOutline, addCircleOutline, starOutline,
  searchOutline, downloadOutline, createOutline, trashOutline,
  personOutline, refreshOutline, closeOutline, saveOutline
} from 'ionicons/icons';
import { AdminHeaderComponent } from '../../../shared/headers/admin-header/admin-header.component';
import { AdminService, Stats, Emprendedor } from '../../../services/admin';
import { AuthService } from '../../../services/auth';

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
export class DashboardPage implements OnInit {

  textoBusqueda = '';
  cargando = true;
  rolActual = '';

  stats: Stats = {
    total: 0,
    activos: 0,
    nuevos: 0,
    destacados: 0
  };

  emprendedores: Emprendedor[] = [];

  // Modal
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

  constructor(
    private adminService: AdminService,
    private authService: AuthService
  ) {
    addIcons({
      peopleOutline, pulseOutline, addCircleOutline, starOutline,
      searchOutline, downloadOutline, createOutline, trashOutline,
      personOutline, refreshOutline, closeOutline, saveOutline
    });
  }

  async ngOnInit() {
    this.rolActual = await this.authService.getRol() || '';
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
    this.adminService.getEmprendedores().subscribe({
      next: (data) => {
        this.emprendedores = data;
        this.cargando = false;
      },
      error: () => {
        this.emprendedores = [];
        this.cargando = false;
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
    this.form.role = 'emprendedor'; // por defecto siempre emprendedor
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
      alert('No se pudo guardar el emprendedor');
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
}