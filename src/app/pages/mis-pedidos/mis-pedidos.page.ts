import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  receiptOutline, storefrontOutline, closeCircleOutline,
  timeOutline, checkmarkCircleOutline, banOutline
} from 'ionicons/icons';
import { HeaderComponent } from '../../shared/headers/public-header/header.component';
import { PedidoService } from '../../services/pedido';
import { Pedido, PedidoEmprendimiento } from '../../models/pedido.model';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent]
})
export class MisPedidosPage implements OnInit {

  pedidos: Pedido[] = [];
  cargando = true;
  cancelandoId: number | null = null;

  constructor(private pedidoService: PedidoService) {
    addIcons({
      receiptOutline, storefrontOutline, closeCircleOutline,
      timeOutline, checkmarkCircleOutline, banOutline
    });
  }

  ngOnInit() {
    this.cargarPedidos();
  }

  cargarPedidos() {
    this.cargando = true;
    this.pedidoService.misPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.cargando = false;
      },
      error: () => {
        this.pedidos = [];
        this.cargando = false;
      }
    });
  }

  subtotalSubPedido(subPedido: PedidoEmprendimiento): number {
    return subPedido.items.reduce(
      (sum, item) => sum + (parseFloat(item.precio_unitario) * item.cantidad),
      0
    );
  }

  puedeCancelar(subPedido: PedidoEmprendimiento): boolean {
    return subPedido.estado !== 'cancelado' && subPedido.estado !== 'entregado';
  }

  cancelar(subPedido: PedidoEmprendimiento) {
    if (!confirm('¿Seguro que quieres cancelar este pedido?')) return;

    this.cancelandoId = subPedido.id;
    this.pedidoService.cancelarSubPedido(subPedido.id).subscribe({
      next: () => {
        subPedido.estado = 'cancelado';
        this.cancelandoId = null;
      },
      error: () => {
        this.cancelandoId = null;
        alert('No se pudo cancelar el pedido');
      }
    });
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
}