export interface Producto {
  id: number;
  emprendimiento_id: number;
  nombre: string;
  descripcion: string;
  precio: string;
  imagen?: string | null;
  disponible: boolean;
  created_at?: string;
  updated_at?: string;
}