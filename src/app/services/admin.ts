import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stats {
  total: number;
  activos: number;
  nuevos: number;
  destacados: number;
  total_emprendedores: number;
  nuevos_emprendedores: number;
  total_clientes: number;
  convocatorias_activas: number;
}

export interface Emprendedor {
  id: number;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  telefono: string;
  mfa_enabled: boolean;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/admin/stats`);
  }

  getEmprendedores(): Observable<Emprendedor[]> {
    return this.http.get<Emprendedor[]>(`${this.apiUrl}/admin/emprendedores`);
  }

  crearEmprendedor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/emprendedores`, data);
  }

  actualizarEmprendedor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/emprendedores/${id}`, data);
  }

  eliminarEmprendedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/admin/emprendedores/${id}`);
  }

  toggleMfa(id: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/admin/emprendedores/${id}/mfa`, {});
    }   
}