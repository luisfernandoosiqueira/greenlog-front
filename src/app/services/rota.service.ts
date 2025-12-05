import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { RotaRequest, RotaResponse } from "../model/Rota";

@Injectable({
  providedIn: 'root'
})

export class RotaService{
    private apiUrl = 'http://localhost:8080/api/rotas';

    constructor(private http: HttpClient) {}

    findAll(): Observable<RotaResponse[]> {
        return this.http.get<RotaResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    findById(id: number): Observable<RotaResponse> {
        return this.http.get<RotaResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(novoMotorista: RotaRequest): Observable<RotaResponse> {
        return this.http.post<RotaResponse>(this.apiUrl, novoMotorista).pipe(catchError(this.handleError));
    }

    update(atualizarMotorista: RotaRequest, id: number): Observable<RotaResponse> {
        return this.http.put<RotaResponse>(`${this.apiUrl}/${id}`, atualizarMotorista).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<RotaResponse> {
        return this.http.delete<RotaResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('Erro na API rotas: ', error);
        return throwError(() => new Error('Erro ao consultar a API rota.'));
    }
}