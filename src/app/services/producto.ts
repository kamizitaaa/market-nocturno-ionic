import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAll(emprendimientoId?: number): Observable<Producto[]> {
    let url = `${this.apiUrl}/productos`;
    if (emprendimientoId) {
      url += `?emprendimiento_id=${emprendimientoId}`;
    }
    return this.http.get<Producto[]>(url);
  }

  getById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/productos/${id}`);
  }

  create(producto: { emprendimiento_id: number; nombre: string; descripcion: string; precio: number; disponible?: boolean }): Observable<any> {
  return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  update(id: number, producto: Partial<{ nombre: string; descripcion: string; precio: number; disponible: boolean }>): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id}`, producto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id}`);
  }

  subirImagen(id: number, archivo: File): Observable<any> {
  const formData = new FormData();
  formData.append('imagen', archivo);
  return this.http.post(`${this.apiUrl}/productos/${id}/imagen`, formData);
  }
}