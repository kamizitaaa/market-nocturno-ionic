import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'auth_token';
const ROL_KEY = 'rol';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getCaptcha(): Observable<any> {
    return this.http.get(`${this.apiUrl}/captcha`);
  }

  login(email: string, password: string, captcha_token: string, captcha_respuesta: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password,
      captcha_token,
      captcha_respuesta
    });
  }

  verificarMfa(user_id: number, codigo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verificar-mfa`, { user_id, codigo });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  registro(usuario: Partial<Usuario>): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  async getToken(): Promise<string | null> {
    const { value } = await Preferences.get({ key: TOKEN_KEY });
    return value;
  }

  async setToken(token: string): Promise<void> {
    await Preferences.set({ key: TOKEN_KEY, value: token });
  }

  async removeToken(): Promise<void> {
    await Preferences.remove({ key: TOKEN_KEY });
    await Preferences.remove({ key: ROL_KEY });
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  async setRol(rol: string): Promise<void> {
    await Preferences.set({ key: ROL_KEY, value: rol });
  }

  async getRol(): Promise<string | null> {
    const { value } = await Preferences.get({ key: ROL_KEY });
    return value;
  }

  // Agregar en auth.ts, junto a setRol/getRol
async setNombre(nombre: string): Promise<void> {
  await Preferences.set({ key: 'nombre', value: nombre });
}

async getNombre(): Promise<string | null> {
  const { value } = await Preferences.get({ key: 'nombre' });
  return value;
}
}