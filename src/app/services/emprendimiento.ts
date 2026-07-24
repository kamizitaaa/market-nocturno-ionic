import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emprendimiento } from '../models/emprendimiento.model';

@Injectable({
  providedIn: 'root'
})
export class EmprendimientoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Emprendimiento[]> {
    return this.http.get<Emprendimiento[]>(`${this.apiUrl}/emprendimientos`);
  }

  getById(id: number): Observable<Emprendimiento> {
    return this.http.get<Emprendimiento>(`${this.apiUrl}/emprendimientos/${id}`);
  }

  create(emprendimiento: Partial<Emprendimiento>): Observable<any> {
    return this.http.post(`${this.apiUrl}/emprendimientos`, emprendimiento);
  }

  update(id: number, emprendimiento: Partial<Emprendimiento>): Observable<any> {
    return this.http.put(`${this.apiUrl}/emprendimientos/${id}`, emprendimiento);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emprendimientos/${id}`);
  }
}