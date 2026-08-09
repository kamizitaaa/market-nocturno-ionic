import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private apiUrl = environment.apiUrl;

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

    pedidosDeMiEmprendimiento(): Observable<any> {
  return this.http.get(`${this.apiUrl}/pedidos-emprendimiento`);
    }

    actualizarEstadoSubPedido(subPedidoId: number, estado: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/pedidos-emprendimiento/${subPedidoId}/estado`, { estado });
    }
}