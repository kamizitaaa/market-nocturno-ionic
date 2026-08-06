import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AcercaInfo {
  id: number;
  historia_titulo: string;
  historia_texto: string;
  historia_imagen: string | null;
  mision: string;
  vision: string;
}

export interface MiembroEquipo {
  id: number;
  nombre: string;
  puesto: string;
  foto: string | null;
  descripcion: string;
  orden: number;
}

export interface ImagenGaleria {
  id: number;
  url: string;
  titulo: string | null;
  orden: number;
}

@Injectable({
  providedIn: 'root'
})
export class AcercaService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ===== INFO =====
  getInfo(): Observable<AcercaInfo> {
    return this.http.get<AcercaInfo>(`${this.apiUrl}/acerca`);
  }

  updateInfo(data: Partial<AcercaInfo>): Observable<any> {
    return this.http.put(`${this.apiUrl}/acerca`, data);
  }

  subirImagenHistoria(archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    return this.http.post(`${this.apiUrl}/acerca/imagen`, formData);
  }

  // ===== EQUIPO =====
  getEquipo(): Observable<MiembroEquipo[]> {
    return this.http.get<MiembroEquipo[]>(`${this.apiUrl}/equipo`);
  }

  crearMiembro(data: Partial<MiembroEquipo>): Observable<any> {
    return this.http.post(`${this.apiUrl}/equipo`, data);
  }

  actualizarMiembro(id: number, data: Partial<MiembroEquipo>): Observable<any> {
    return this.http.put(`${this.apiUrl}/equipo/${id}`, data);
  }

  eliminarMiembro(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/equipo/${id}`);
  }

  subirFotoMiembro(id: number, archivo: File): Observable<any> {
    const formData = new FormData();
    formData.append('foto', archivo);
    return this.http.post(`${this.apiUrl}/equipo/${id}/foto`, formData);
  }

  // ===== GALERÍA =====
  getGaleria(): Observable<ImagenGaleria[]> {
    return this.http.get<ImagenGaleria[]>(`${this.apiUrl}/galeria`);
  }

  agregarImagenGaleria(archivo: File, titulo: string): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('titulo', titulo);
    return this.http.post(`${this.apiUrl}/galeria`, formData);
  }

  eliminarImagenGaleria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/galeria/${id}`);
  }
}