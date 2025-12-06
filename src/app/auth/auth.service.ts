import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

export type PerfilUsuario = 'ADMIN' | 'OPERADOR';

export interface LoginResponse {
  id: number;
  username: string;
  perfil: string;
}

export interface UsuarioLogado {
  id: number;
  username: string;
  perfil: PerfilUsuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private readonly STORAGE_KEY = 'usuarioLogado';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; senha: string }): Observable<UsuarioLogado> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, credentials)
      .pipe(
        map((res) => {
          const usuario: UsuarioLogado = {
            id: res.id,
            username: res.username,
            perfil: res.perfil as PerfilUsuario
          };
          this.salvarUsuario(usuario);
          return usuario;
        })
      );
  }

  register(credentials: { username: string; senha: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, credentials);
  }

  private salvarUsuario(usuario: UsuarioLogado): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usuario));
  }

  getUsuario(): UsuarioLogado | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UsuarioLogado;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getUsuario() !== null;
  }

  getUserNome(): string | null {
    return this.getUsuario()?.username ?? null;
  }

  getUserPerfil(): PerfilUsuario | null {
    const perfil = this.getUsuario()?.perfil;
    return perfil ?? null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
