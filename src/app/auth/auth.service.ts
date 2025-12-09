import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError, throwError } from 'rxjs';

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

export interface UsuarioRequest {
  username: string;
  senha: string;
  perfil: PerfilUsuario;
}

export interface UsuarioResponse {
  id: number;
  username: string;
  perfil: PerfilUsuario;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // AuthController
  private readonly AUTH_BASE_URL = 'http://localhost:8080/api';
  // UsuarioController
  private readonly USUARIO_BASE_URL = 'http://localhost:8080/api/usuarios';

  private readonly STORAGE_KEY = 'usuarioLogado';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; senha: string }): Observable<UsuarioLogado> {
    return this.http
      .post<LoginResponse>(`${this.AUTH_BASE_URL}/login`, credentials)
      .pipe(
        map((res) => {
          const usuario: UsuarioLogado = {
            id: res.id,
            username: res.username,
            perfil: res.perfil as PerfilUsuario
          };
          this.salvarUsuario(usuario);
          return usuario;
        }),
        catchError(this.handleError)
      );
  }

  register(usuario: UsuarioRequest): Observable<UsuarioResponse> {
    return this.http
      .post<UsuarioResponse>(this.USUARIO_BASE_URL, usuario)
      .pipe(catchError(this.handleError));
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

  // mantém o HttpErrorResponse original para o componente extrair message do backend
  private handleError(error: any) {
    console.error('Erro na API de autenticação/usuário: ', error);
    return throwError(() => error);
  }
}
