import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { PontoColetaRequest, PontoColetaResponse } from "../model/PontoColeta";

@Injectable({
  providedIn: 'root'
})

export class PontoColetaService{
  private apiUrl = 'http://localhost:8080/api/pontos-coleta';

  constructor(private http: HttpClient) {}

  findAll(): Observable<PontoColetaResponse[]> {
    return this.http.get<PontoColetaResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<PontoColetaResponse> {
    return this.http.get<PontoColetaResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  create(novoPonto: PontoColetaRequest): Observable<PontoColetaResponse> {
    return this.http.post<PontoColetaResponse>(this.apiUrl, novoPonto).pipe(catchError(this.handleError));
  }

  update(atualizarPonto: PontoColetaRequest, id: number): Observable<PontoColetaResponse> {
    return this.http.put<PontoColetaResponse>(`${this.apiUrl}/${id}`, atualizarPonto).pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<PontoColetaResponse> {
    return this.http.delete<PontoColetaResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: any) {
    console.error('Erro na API bairros: ', error);
    return throwError(() => new Error('Erro ao consultar a API bairro.'));
  }
}