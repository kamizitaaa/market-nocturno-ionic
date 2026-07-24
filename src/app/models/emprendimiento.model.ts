export interface Emprendimiento {
  id: number;
  nombre: string;
  descripcion: string;
  categoria: string;
  imagen?: string;
  usuario_id: number;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}