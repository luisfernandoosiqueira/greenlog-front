import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { RuaRequest, RuaResponse } from "../model/Rua";

@Injectable({
  providedIn: 'root'
})

export class ConexaoService {
  private apiUrl = 'http://localhost:8080/api/ruas-conexoes';

  constructor(private http: HttpClient) {}

    findAll(): Observable<RuaResponse[]> {
        return this.http.get<RuaResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    findById(id: number): Observable<RuaResponse[]> {
        return this.http.get<RuaResponse[]>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    findByOrigemId(origemId: number): Observable<RuaResponse[]> {
        return this.http.get<RuaResponse[]>(`${this.apiUrl}/origem/${origemId}`).pipe(catchError(this.handleError));
    }

    findByDestinoId(destinoId: number): Observable<RuaResponse[]> {
        return this.http.get<RuaResponse[]>(`${this.apiUrl}/origem/${destinoId}`).pipe(catchError(this.handleError));
    }

    create(novaConexao: RuaRequest): Observable<RuaResponse> {
        return this.http.post<RuaResponse>(this.apiUrl, novaConexao).pipe(catchError(this.handleError));
    }

    update(atualizarConexao: RuaRequest, id: number): Observable<RuaResponse> {
        return this.http.put<RuaResponse>(`${this.apiUrl}/${id}`, atualizarConexao).pipe(catchError(this.handleError));
    }

    
    private handleError(error: any) {
        console.error('Erro na API de ruas-conexao: ', error);
        return throwError(() => new Error('Erro ao consultar a API das ruas-conexão.'));
    }
}