import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categoria {
  id: number;
  nombre: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.apiUrl}/categorias`);
  }

  getById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/categorias/${id}`);
  }

  create(categoria: { nombre: string; activa?: boolean }): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias`, categoria);
  }

  update(id: number, categoria: { nombre?: string; activa?: boolean }): Observable<any> {
    return this.http.put(`${this.apiUrl}/categorias/${id}`, categoria);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`);
  }
}