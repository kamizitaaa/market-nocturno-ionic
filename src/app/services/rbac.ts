import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RbacService {

  private permisos: Record<string, string[]> = {
    superadmin: ['ver_todo', 'crear', 'editar', 'eliminar', 'gestionar_usuarios', 'gestionar_convocatorias'],
    admin: ['ver_todo', 'crear', 'editar', 'gestionar_convocatorias'],
    emprendedor: ['ver_emprendimientos', 'crear', 'editar_propio'],
    visitante: ['ver_emprendimientos']
  };

  tienePermiso(permiso: string): boolean {
    const rol = localStorage.getItem('rol') || 'visitante';
    return this.permisos[rol]?.includes(permiso) ?? false;
  }

  esAdmin(): boolean {
    const rol = localStorage.getItem('rol');
    return rol === 'admin' || rol === 'superadmin';
  }

  esEmprendedor(): boolean {
    return localStorage.getItem('rol') === 'emprendedor';
  }

  getRol(): string {
    return localStorage.getItem('rol') || 'visitante';
  }
}