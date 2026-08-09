import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Emprendimiento } from '../models/emprendimiento.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmprendimientoService {
  private apiUrl = environment.apiUrl;

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

  misEmprendimientos(): Observable<Emprendimiento[]> {
  return this.http.get<Emprendimiento[]>(`${this.apiUrl}/mis-emprendimientos`);
  }

  update(id: number, emprendimiento: Partial<Emprendimiento>): Observable<any> {
    return this.http.put(`${this.apiUrl}/emprendimientos/${id}`, emprendimiento);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/emprendimientos/${id}`);
  }

  subirImagen(id: number, archivo: File): Observable<any> {
  const formData = new FormData();
  formData.append('imagen', archivo);
  return this.http.post(`${this.apiUrl}/emprendimientos/${id}/imagen`, formData);
  }

  getAllAdmin(): Observable<Emprendimiento[]> {
  return this.http.get<Emprendimiento[]>(`${this.apiUrl}/admin/emprendimientos`);
  }
}