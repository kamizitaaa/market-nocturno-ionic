import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  storefrontOutline, saveOutline, addCircleOutline,
  fastFoodOutline, createOutline, trashOutline, closeOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { EmprendimientoService } from '../../services/emprendimiento';
import { CategoriaService } from '../../services/categoria';
import { ProductoService } from '../../services/producto';
import { Emprendimiento } from '../../models/emprendimiento.model';
import { Producto } from '../../models/producto.model';

@Component({
  selector: 'app-mi-emprendimiento',
  templateUrl: './mi-emprendimiento.page.html',
  styleUrls: ['./mi-emprendimiento.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonContent, IonIcon, HeaderComponent]
})
export class MiEmprendimientoPage implements OnInit {

  emprendimiento: Emprendimiento | null = null;
  categorias: { id: number; nombre: string }[] = [];
  cargando = true;
  guardando = false;
  tieneEmprendimiento = false;

  archivoSeleccionado: File | null = null;
  subiendoImagen = false;

  form = {
    categoria_id: null as number | null,
    nombre: '',
    descripcion: '',
    precio_desde: null as number | null,
    precio_hasta: null as number | null,
  };

  // --- Productos --- Propiedades
  productos: Producto[] = [];
  cargandoProductos = false;
  guardandoProducto = false;
  editandoProductoId: number | null = null;
  archivoProductoSeleccionado: File | null = null;
  subiendoImagenProducto: number | null = null; // guarda el id del producto que se está subiendo

  formProducto = {
    nombre: '',
    descripcion: '',
    precio: null as number | null,
  };

  constructor(
    private emprendimientoService: EmprendimientoService,
    private categoriaService: CategoriaService,
    private productoService: ProductoService
  ) {
    addIcons({
      storefrontOutline, saveOutline, addCircleOutline,
      fastFoodOutline, createOutline, trashOutline, closeOutline
    });
  }

  ngOnInit() {
    this.cargarCategorias();
    this.cargarMiEmprendimiento();
  }

  cargarCategorias() {
    this.categoriaService.getAll().subscribe({
      next: (data) => { this.categorias = data; },
      error: () => { this.categorias = []; }
    });
  }

  cargarMiEmprendimiento() {
    this.cargando = true;
    this.emprendimientoService.misEmprendimientos().subscribe({
      next: (data) => {
        if (data.length > 0) {
          this.emprendimiento = data[0];
          this.tieneEmprendimiento = true;
          this.form = {
            categoria_id: data[0].categoria_id,
            nombre: data[0].nombre,
            descripcion: data[0].descripcion,
            precio_desde: data[0].precio_desde ? Number(data[0].precio_desde) : null,
            precio_hasta: data[0].precio_hasta ? Number(data[0].precio_hasta) : null,
          };
          this.cargarProductos();
        } else {
          this.tieneEmprendimiento = false;
        }
        this.cargando = false;
      },
      error: () => {
        this.tieneEmprendimiento = false;
        this.cargando = false;
      }
    });
  }

  guardar() {
    if (!this.form.nombre || !this.form.categoria_id) {
      alert('Nombre y categoría son obligatorios');
      return;
    }

    this.guardando = true;

    if (this.tieneEmprendimiento && this.emprendimiento) {
      this.emprendimientoService.update(this.emprendimiento.id, this.form as any).subscribe({
        next: () => {
          this.guardando = false;
          alert('Emprendimiento actualizado correctamente');
          this.cargarMiEmprendimiento();
        },
        error: () => {
          this.guardando = false;
          alert('No se pudo actualizar el emprendimiento');
        }
      });
    } else {
      this.emprendimientoService.create(this.form as any).subscribe({
        next: () => {
          this.guardando = false;
          alert('Emprendimiento creado correctamente');
          this.cargarMiEmprendimiento();
        },
        error: () => {
          this.guardando = false;
          alert('No se pudo crear el emprendimiento');
        }
      });
    }
  }

  onArchivoSeleccionado(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.archivoSeleccionado = input.files[0];
    }
  }

  subirImagen() {
    if (!this.archivoSeleccionado || !this.emprendimiento) {
      alert('Selecciona una imagen primero');
      return;
    }

    this.subiendoImagen = true;
    this.emprendimientoService.subirImagen(this.emprendimiento.id, this.archivoSeleccionado).subscribe({
      next: () => {
        this.subiendoImagen = false;
        this.archivoSeleccionado = null;
        alert('Imagen actualizada correctamente');
        this.cargarMiEmprendimiento();
      },
      error: () => {
        this.subiendoImagen = false;
        alert('No se pudo subir la imagen');
      }
    });
  }

  // --- Métodos de productos ---

  cargarProductos() {
    if (!this.emprendimiento) return;
    this.cargandoProductos = true;
    this.productoService.getAll(this.emprendimiento.id).subscribe({
      next: (data) => {
        this.productos = data;
        this.cargandoProductos = false;
      },
      error: () => {
        this.productos = [];
        this.cargandoProductos = false;
      }
    });
  }

  editarProducto(producto: Producto) {
    this.editandoProductoId = producto.id;
    this.formProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
    };
  }

  cancelarEdicion() {
    this.editandoProductoId = null;
    this.formProducto = { nombre: '', descripcion: '', precio: null };
  }

  guardarProducto() {
    if (!this.formProducto.nombre || !this.formProducto.precio) {
      alert('Nombre y precio son obligatorios');
      return;
    }

    if (!this.emprendimiento) return;

    this.guardandoProducto = true;

    if (this.editandoProductoId) {
      this.productoService.update(this.editandoProductoId, this.formProducto as any).subscribe({
        next: () => {
          this.guardandoProducto = false;
          this.cancelarEdicion();
          this.cargarProductos();
        },
        error: () => {
          this.guardandoProducto = false;
          alert('No se pudo actualizar el producto');
        }
      });
    } else {
      const nuevoProducto = {
        emprendimiento_id: this.emprendimiento.id,
        ...this.formProducto
      };
      this.productoService.create(nuevoProducto as any).subscribe({
        next: () => {
          this.guardandoProducto = false;
          this.cancelarEdicion();
          this.cargarProductos();
        },
        error: () => {
          this.guardandoProducto = false;
          alert('No se pudo crear el producto');
        }
      });
    }
  }

  eliminarProducto(producto: Producto) {
    if (!confirm(`¿Eliminar "${producto.nombre}"?`)) return;

    this.productoService.delete(producto.id).subscribe({
      next: () => {
        this.cargarProductos();
      },
      error: () => {
        alert('No se pudo eliminar el producto');
      }
    });
  }

  onArchivoProductoSeleccionado(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.archivoProductoSeleccionado = input.files[0];
  }
}

subirImagenProducto(producto: Producto) {
  if (!this.archivoProductoSeleccionado) {
    alert('Selecciona una imagen primero');
    return;
  }

  this.subiendoImagenProducto = producto.id;
  this.productoService.subirImagen(producto.id, this.archivoProductoSeleccionado).subscribe({
    next: () => {
      this.subiendoImagenProducto = null;
      this.archivoProductoSeleccionado = null;
      this.cargarProductos();
    },
    error: () => {
      this.subiendoImagenProducto = null;
      alert('No se pudo subir la imagen del producto');
    }
  });
  }
}