import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserSession {
  id: number;
  user_id: number;
  ip_address: string;
  navegador: string;
  fecha_inicio: string;
  activa: boolean;
  user: {
    id: number;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UserSession[]> {
    return this.http.get<UserSession[]>(`${this.apiUrl}/admin/sesiones`);
  }

  cerrar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/admin/sesiones/${id}/cerrar`, {});
  }
}