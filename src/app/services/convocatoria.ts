import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Convocatoria {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  imagen: string | null;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConvocatoriaService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/convocatorias`);
  }

  getAllAdmin(): Observable<Convocatoria[]> {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/admin/convocatorias`);
  }

  getById(id: number): Observable<Convocatoria> {
    return this.http.get<Convocatoria>(`${this.apiUrl}/convocatorias/${id}`);
  }

  create(data: Partial<Convocatoria>): Observable<any> {
    return this.http.post(`${this.apiUrl}/convocatorias`, data);
  }

  update(id: number, data: Partial<Convocatoria>): Observable<any> {
    return this.http.put(`${this.apiUrl}/convocatorias/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/convocatorias/${id}`);
  }

  toggleActiva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/convocatorias/${id}/toggle`, {});
  }

  subirImagen(id: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post(`${this.apiUrl}/convocatorias/${id}/imagen`, formData);
  }
  inscribirse(convocatoriaId: number, data: { nombre: string; telefono: string; email?: string; tipo_negocio: string; mensaje?: string }): Observable<any> {
  return this.http.post(`${this.apiUrl}/convocatorias/${convocatoriaId}/inscribirse`, data);
    }

    getParticipantes(convocatoriaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/convocatorias/${convocatoriaId}/participantes`);
    }
}