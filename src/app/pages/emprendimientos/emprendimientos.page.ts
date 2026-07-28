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

  filtros = {
    categoria: true,
    estado: true,
    precio: true
  };

  categorias = [
    { nombre: 'Comida', seleccionada: false },
    { nombre: 'Artesanías', seleccionada: false },
    { nombre: 'Bebidas', seleccionada: false },
    { nombre: 'Ropa', seleccionada: false },
    { nombre: 'Belleza', seleccionada: false },
    { nombre: 'Accesorios', seleccionada: false }
  ];

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
    this.emprendimientoService.getAll().subscribe({
      next: (data) => {
        this.emprendimientos = data;
        this.emprendimientosFiltrados = data;
      },
      error: () => {
        // Datos de prueba mientras no hay backend
        this.emprendimientos = [];
        this.emprendimientosFiltrados = [];
      }
    });
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
        e.categoria.toLowerCase().includes(texto) ||
        e.descripcion.toLowerCase().includes(texto)
      );
    }

    const categoriasSeleccionadas = this.categorias
      .filter(c => c.seleccionada)
      .map(c => c.nombre);

    if (categoriasSeleccionadas.length > 0) {
      resultado = resultado.filter(e =>
        categoriasSeleccionadas.includes(e.categoria)
      );
    }

    if (this.filtroActivo) {
      resultado = resultado.filter(e => e.activo);
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