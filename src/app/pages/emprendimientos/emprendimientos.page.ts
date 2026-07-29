import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline, chevronUpOutline, chevronDownOutline,
  searchOutline, gridOutline, listOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { EmprendimientoService } from '../../services/emprendimiento';
import { Emprendimiento } from '../../models/emprendimiento.model';

@Component({
  selector: 'app-emprendimientos',
  templateUrl: './emprendimientos.page.html',
  styleUrls: ['./emprendimientos.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    IonContent, IonIcon,
    HeaderComponent
  ]
})
export class EmprendimientosPage implements OnInit {

  emprendimientos: Emprendimiento[] = [];
  emprendimientosFiltrados: Emprendimiento[] = [];
  textoBusqueda = '';
  vistaGrid = true;
  filtroActivo = false;
  filtroDestacado = false;
  filtroPrecio = '';
  cargando = false;

  filtros = {
    categoria: true,
    estado: true,
    precio: true
  };

  // Ahora se llenan dinámicamente desde el backend, no hardcodeadas
  categorias: { id: number; nombre: string; seleccionada: boolean }[] = [];

  constructor(private emprendimientoService: EmprendimientoService) {
    addIcons({
      menuOutline, chevronUpOutline, chevronDownOutline,
      searchOutline, gridOutline, listOutline
    });
  }

  ngOnInit() {
    this.cargarEmprendimientos();
  }

  cargarEmprendimientos() {
    this.cargando = true;
    this.emprendimientoService.getAll().subscribe({
      next: (data) => {
        this.emprendimientos = data;
        this.emprendimientosFiltrados = data;
        this.extraerCategorias(data);
        this.cargando = false;
      },
      error: () => {
        this.emprendimientos = [];
        this.emprendimientosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  // Construye la lista de categorías a partir de los emprendimientos que sí existen,
  // en vez de tener una lista fija que podría no coincidir con tu backend
  extraerCategorias(data: Emprendimiento[]) {
    const nombresUnicos = new Map<number, string>();
    data.forEach(e => {
      if (e.categoria) {
        nombresUnicos.set(e.categoria.id, e.categoria.nombre);
      }
    });
    this.categorias = Array.from(nombresUnicos, ([id, nombre]) => ({
      id, nombre, seleccionada: false
    }));
  }

  toggleFiltro(filtro: string) {
    this.filtros[filtro as keyof typeof this.filtros] = !this.filtros[filtro as keyof typeof this.filtros];
  }

  aplicarFiltros() {
    let resultado = [...this.emprendimientos];

    if (this.textoBusqueda) {
      const texto = this.textoBusqueda.toLowerCase();
      resultado = resultado.filter(e =>
        e.nombre.toLowerCase().includes(texto) ||
        (e.categoria?.nombre.toLowerCase().includes(texto) ?? false) ||
        e.descripcion.toLowerCase().includes(texto)
      );
    }

    const categoriaIdsSeleccionadas = this.categorias
      .filter(c => c.seleccionada)
      .map(c => c.id);

    if (categoriaIdsSeleccionadas.length > 0) {
      resultado = resultado.filter(e =>
        categoriaIdsSeleccionadas.includes(e.categoria_id)
      );
    }

    if (this.filtroActivo) {
      resultado = resultado.filter(e => e.estado === 'activo');
    }

    this.emprendimientosFiltrados = resultado;
  }

  limpiarFiltros() {
    this.textoBusqueda = '';
    this.filtroActivo = false;
    this.filtroDestacado = false;
    this.filtroPrecio = '';
    this.categorias.forEach(c => c.seleccionada = false);
    this.emprendimientosFiltrados = [...this.emprendimientos];
  }
}