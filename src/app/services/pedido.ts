import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  confirmar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/pedidos/confirmar`, {});
  }

  misPedidos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/mis-pedidos`);
  }

  cancelarSubPedido(subPedidoId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}/pedidos/${subPedidoId}/cancelar`, {});
    }
}