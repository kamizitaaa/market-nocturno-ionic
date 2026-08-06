import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ContactoMensaje {
  id: number;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  created_at: string;
  updated_at?: string;
}

export interface ContactoPayload {
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = `${environment.apiUrl}/contacto`;
  private adminUrl = `${environment.apiUrl}/admin/contactos`;
  private deleteUrl = `${environment.apiUrl}/contactos`;

  constructor(private http: HttpClient) {}

  // Público — envía el formulario de contacto
  enviar(datos: ContactoPayload): Observable<{ message: string; data: ContactoMensaje }> {
    return this.http.post<{ message: string; data: ContactoMensaje }>(this.apiUrl, datos);
  }

  // Admin — lista todos los mensajes
  getAllAdmin(): Observable<ContactoMensaje[]> {
    return this.http.get<ContactoMensaje[]>(this.adminUrl);
  }

  // Admin — elimina un mensaje
  eliminar(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.deleteUrl}/${id}`);
  }
}