import { Emprendimiento } from './emprendimiento.model';
import { Producto } from './producto.model';

export interface PedidoItem {
  id: number;
  pedido_emprendimiento_id: number;
  producto_id: number;
  cantidad: number;
  precio_unitario: string;
  producto?: Producto;
  created_at?: string;
  updated_at?: string;
}

export interface PedidoEmprendimiento {
  id: number;
  pedido_id: number;
  emprendimiento_id: number;
  estado: 'pendiente' | 'listo_para_entregar' | 'entregado' | 'cancelado';
  emprendimiento?: Emprendimiento;
  items: PedidoItem[];
  created_at?: string;
  updated_at?: string;
}

export interface Pedido {
  id: number;
  cliente_id: number;
  sub_pedidos: PedidoEmprendimiento[];
  created_at?: string;
  updated_at?: string;
}