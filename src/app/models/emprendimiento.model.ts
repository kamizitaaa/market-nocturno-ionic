export interface Categoria {
  id: number;
  nombre: string;
  activa: boolean;
}

export interface Emprendedor {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
}

export interface Emprendimiento {
  id: number;
  user_id: number;
  categoria_id: number;
  nombre: string;
  precio_desde: string | null;
  precio_hasta: string | null;
  estado: 'activo' | 'inactivo';
  descripcion: string;
  imagen?: string | null;
  fecha?: string;
  categoria?: Categoria;
  emprendedor?: Emprendedor;
  created_at?: string;
  updated_at?: string;
}