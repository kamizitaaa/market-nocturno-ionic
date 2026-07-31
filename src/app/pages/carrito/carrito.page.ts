import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline, addOutline, removeOutline,
  cartOutline, bagCheckOutline, storefrontOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { CarritoService } from '../../services/carrito';
import { PedidoService } from '../../services/pedido';

interface CarritoItem {
  id: number;
  producto_id: number;
  cantidad: number;
  producto: {
    nombre: string;
    precio: string;
    imagen: string | null;
    emprendimiento_id: number;
    emprendimiento?: {
      id: number;
      nombre: string;
    };
  };
}

interface Carrito {
  id: number;
  items: CarritoItem[];
}

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent]
})
export class CarritoPage implements OnInit {

  carrito: Carrito | null = null;
  cargando = true;
  confirmando = false;
  actualizandoId: number | null = null;

  constructor(
    private carritoService: CarritoService,
    private pedidoService: PedidoService,
    private router: Router
  ) {
    addIcons({
      trashOutline, addOutline, removeOutline,
      cartOutline, bagCheckOutline, storefrontOutline
    });
  }

  ngOnInit() {
    this.cargarCarrito();
  }

  cargarCarrito() {
    this.cargando = true;
    this.carritoService.ver().subscribe({
      next: (data) => {
        this.carrito = data;
        this.cargando = false;
      },
      error: () => {
        this.carrito = null;
        this.cargando = false;
      }
    });
  }

  subtotal(item: CarritoItem): number {
    return parseFloat(item.producto.precio) * item.cantidad;
  }

  get total(): number {
    if (!this.carrito) return 0;
    return this.carrito.items.reduce(
      (sum, item) => sum + this.subtotal(item),
      0
    );
  }

  get itemsAgrupados(): { emprendimientoNombre: string; items: CarritoItem[] }[] {
    if (!this.carrito) return [];

    const grupos = new Map<number, { emprendimientoNombre: string; items: CarritoItem[] }>();

    for (const item of this.carrito.items) {
      const empId = item.producto.emprendimiento_id;
      const empNombre = item.producto.emprendimiento?.nombre || 'Emprendimiento';

      if (!grupos.has(empId)) {
        grupos.set(empId, { emprendimientoNombre: empNombre, items: [] });
      }
      grupos.get(empId)!.items.push(item);
    }

    return Array.from(grupos.values());
  }

  cambiarCantidad(item: CarritoItem, delta: number) {
    const nuevaCantidad = item.cantidad + delta;
    if (nuevaCantidad < 1) return;

    this.actualizandoId = item.id;
    this.carritoService.actualizarCantidad(item.id, nuevaCantidad).subscribe({
      next: () => {
        item.cantidad = nuevaCantidad;
        this.actualizandoId = null;
      },
      error: () => {
        this.actualizandoId = null;
        alert('No se pudo actualizar la cantidad');
      }
    });
  }

  eliminarItem(item: CarritoItem) {
  const confirmar = confirm(`¿Seguro que quieres eliminar "${item.producto.nombre}" del carrito?`);
  if (!confirmar) return;

    this.carritoService.eliminarItem(item.id).subscribe({
      next: () => {
        this.cargarCarrito();
      },
      error: () => {
        alert('No se pudo eliminar el producto');
      }
    });
  }

  confirmarPedido() {
    if (!this.carrito || this.carrito.items.length === 0) return;

    this.confirmando = true;
    this.pedidoService.confirmar().subscribe({
      next: () => {
        this.confirmando = false;
        alert('¡Tu pedido fue confirmado! Puedes verlo en "Mis pedidos"');
        this.router.navigate(['/mis-pedidos']);
      },
      error: () => {
        this.confirmando = false;
        alert('No se pudo confirmar el pedido, intenta de nuevo');
      }
    });
  }
}