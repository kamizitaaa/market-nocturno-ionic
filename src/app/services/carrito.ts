import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  ver(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carrito`);
  }

  agregar(productoId: number, cantidad: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/carrito/agregar`, {
      producto_id: productoId,
      cantidad
    });
  }

  actualizarCantidad(itemId: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/carrito/items/${itemId}`, { cantidad });
  }

  eliminarItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carrito/items/${itemId}`);
  }

  vaciar(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carrito/vaciar`);
  }
}