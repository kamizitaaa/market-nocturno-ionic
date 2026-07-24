export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'superadmin' | 'emprendedor' | 'visitante';
  token?: string;
  mfa_activo?: boolean;
}