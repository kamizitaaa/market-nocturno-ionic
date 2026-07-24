export interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  created_at?: string;
  updated_at?: string;
}