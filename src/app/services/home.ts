import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HomeSlide {
  id: number;
  imagen: string;
  titulo: string | null;
  orden: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getSlides(): Observable<HomeSlide[]> {
    return this.http.get<HomeSlide[]>(`${this.apiUrl}/home-slides`);
  }

  getSlidesAdmin(): Observable<HomeSlide[]> {
    return this.http.get<HomeSlide[]>(`${this.apiUrl}/admin/home-slides`);
  }

  agregarSlide(archivo: File, titulo: string): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', archivo);
    formData.append('titulo', titulo);
    return this.http.post(`${this.apiUrl}/home-slides`, formData);
  }

  eliminarSlide(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/home-slides/${id}`);
  }

  toggleActivo(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/home-slides/${id}/toggle`, {});
  }
}