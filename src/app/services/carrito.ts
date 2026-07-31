import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private apiUrl = 'http://localhost:8000/api';

  // Contador reactivo: cualquier componente puede suscribirse para ver cuántos items hay
  private cantidadSubject = new BehaviorSubject<number>(0);
  cantidad$ = this.cantidadSubject.asObservable();

  constructor(private http: HttpClient) {}

  ver(): Observable<any> {
    return this.http.get(`${this.apiUrl}/carrito`).pipe(
      tap((data: any) => this.actualizarContadorDesde(data))
    );
  }

  agregar(productoId: number, cantidad: number = 1): Observable<any> {
    return this.http.post(`${this.apiUrl}/carrito/agregar`, {
      producto_id: productoId,
      cantidad
    }).pipe(
      tap(() => this.refrescarContador())
    );
  }

  actualizarCantidad(itemId: number, cantidad: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/carrito/items/${itemId}`, { cantidad }).pipe(
      tap(() => this.refrescarContador())
    );
  }

  eliminarItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carrito/items/${itemId}`).pipe(
      tap(() => this.refrescarContador())
    );
  }

  vaciar(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/carrito/vaciar`).pipe(
      tap(() => this.cantidadSubject.next(0))
    );
  }

  // Vuelve a consultar el carrito solo para actualizar el contador (sin necesidad de usarlo en pantalla)
  refrescarContador() {
    this.http.get(`${this.apiUrl}/carrito`).subscribe({
      next: (data) => this.actualizarContadorDesde(data),
      error: () => this.cantidadSubject.next(0)
    });
  }

  private actualizarContadorDesde(data: any) {
    if (data && Array.isArray(data.items)) {
      const total = data.items.reduce((sum: number, item: any) => sum + item.cantidad, 0);
      this.cantidadSubject.next(total);
    } else {
      this.cantidadSubject.next(0);
    }
  }

  resetContador() {
    this.cantidadSubject.next(0);
  }
}