import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { BairroRequest, BairroResponse } from "../model/Bairro";

@Injectable({
  providedIn: 'root'
})
export class BairroService {
  private apiUrl = 'http://localhost:8080/api/bairros';

  constructor(private http: HttpClient) {}

  findAll(): Observable<BairroResponse[]> {
    return this.http
      .get<BairroResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  findById(id: number): Observable<BairroResponse> {
    return this.http
      .get<BairroResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  create(novoMotorista: BairroRequest): Observable<BairroResponse> {
    return this.http
      .post<BairroResponse>(this.apiUrl, novoMotorista)
      .pipe(catchError(this.handleError));
  }

  update(atualizarMotorista: BairroRequest, id: number): Observable<BairroResponse> {
    return this.http
      .put<BairroResponse>(`${this.apiUrl}/${id}`, atualizarMotorista)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<BairroResponse> {
    return this.http
      .delete<BairroResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // preserva o erro original para que o componente leia a mensagem do backend
  private handleError(error: HttpErrorResponse) {
    console.error('Erro na API bairros: ', error);
    return throwError(() => error);
  }
}
