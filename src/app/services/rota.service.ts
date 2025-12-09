import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { RotaRequest, RotaResponse } from "../model/Rota";

@Injectable({
  providedIn: 'root'
})
export class RotaService {
  private apiUrl = 'http://localhost:8080/api/rotas';

  constructor(private http: HttpClient) {}

  findAll(): Observable<RotaResponse[]> {
    return this.http
      .get<RotaResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<RotaResponse> {
    return this.http
      .get<RotaResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(novaRota: RotaRequest): Observable<RotaResponse> {
    return this.http
      .post<RotaResponse>(this.apiUrl, novaRota)
      .pipe(catchError(this.handleError));
  }

  update(atualizarRota: RotaRequest, id: number): Observable<RotaResponse> {
    return this.http
      .put<RotaResponse>(`${this.apiUrl}/${id}`, atualizarRota)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<RotaResponse> {
    return this.http
      .delete<RotaResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // repassa o erro original para permitir ler a mensagem do backend no componente
  private handleError(error: HttpErrorResponse) {
    console.error('Erro na API rotas: ', error);
    return throwError(() => error);
  }
}
