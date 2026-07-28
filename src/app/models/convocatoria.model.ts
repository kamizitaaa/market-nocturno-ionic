export type EstadoConvocatoria = 'activa' | 'proxima' | 'cerrada';

export interface Convocatoria {
  id: string;
  titulo: string;
  descripcionCorta: string;
  descripcion: string;
  imagenUrl: string;          // URL o dataURL (base64) de la imagen
  categoria: string;          // ej: 'Emprendedores', 'Artesanos', 'Comida'
  estado: EstadoConvocatoria;
  fechaPublicacion: string;   // ISO string
  fechaCierre: string;        // ISO string
  requisitos: string[];
  beneficios: string[];
  cupoDisponible?: number;
  enlaceExterno?: string;     // link a formulario externo si aplica
  destacada: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

// Tipo usado por el formulario de admin (sin campos autogenerados)
export type ConvocatoriaFormData = Omit<Convocatoria, 'id' | 'creadoEn' | 'actualizadoEn'>;