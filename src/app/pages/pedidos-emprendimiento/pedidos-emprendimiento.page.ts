import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  storefrontOutline, receiptOutline, timeOutline,
  checkmarkCircleOutline, closeCircleOutline, banOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { PedidoService } from '../../services/pedido';

interface SubPedidoConCliente {
  id: number;
  emprendimiento_id: number;
  estado: string;
  pedido: {
    id: number;
    cliente: {
      nombre: string;
      apellido_paterno: string;
    };
  };
  items: {
    id: number;
    cantidad: number;
    precio_unitario: string;
    producto: { nombre: string };
  }[];
  emprendimiento?: {
    id: number;
    nombre: string;
  };
}

@Component({
  selector: 'app-pedidos-emprendimiento',
  templateUrl: './pedidos-emprendimiento.page.html',
  styleUrls: ['./pedidos-emprendimiento.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent]
})
export class PedidosEmprendimientoPage implements OnInit {

  subPedidos: SubPedidoConCliente[] = [];
  cargando = true;
  actualizandoId: number | null = null;

  constructor(private pedidoService: PedidoService) {
    addIcons({
      storefrontOutline, receiptOutline, timeOutline,
      checkmarkCircleOutline, closeCircleOutline, banOutline
    });
  }

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.pedidosDeMiEmprendimiento().subscribe({
      next: (data) => {
        this.subPedidos = data;
        this.cargando = false;
      },
      error: () => {
        this.subPedidos = [];
        this.cargando = false;
      }
    });
  }

  subtotal(sub: SubPedidoConCliente): number {
    return sub.items.reduce(
      (sum, item) => sum + (parseFloat(item.precio_unitario) * item.cantidad),
      0
    );
  }

  etiquetaEstado(estado: string): string {
    const mapa: Record<string, string> = {
      pendiente: 'Pendiente',
      listo_para_entregar: 'Listo para recoger',
      entregado: 'Entregado',
      cancelado: 'Cancelado'
    };
    return mapa[estado] || estado;
  }

  cambiarEstado(sub: SubPedidoConCliente, nuevoEstado: string) {
    this.actualizandoId = sub.id;
    this.pedidoService.actualizarEstadoSubPedido(sub.id, nuevoEstado).subscribe({
      next: () => {
        sub.estado = nuevoEstado;
        this.actualizandoId = null;
      },
      error: () => {
        this.actualizandoId = null;
        alert('No se pudo actualizar el estado');
      }
    });
  }
}