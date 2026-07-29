import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:8000/api';

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
}