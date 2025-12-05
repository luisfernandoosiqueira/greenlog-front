import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { CaminhaoRequest, CaminhaoResponse } from "../model/Caminhao";

@Injectable({
  providedIn: 'root'
})

export class CaminhaoService{
    private apiUrl = 'http://localhost:8080/api/caminhoes';

    constructor(private http: HttpClient) {}

    findAll(): Observable<CaminhaoResponse[]> {
        return this.http.get<CaminhaoResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    findByPlaca(placa: string): Observable<CaminhaoResponse> {
        return this.http.get<CaminhaoResponse>(`${this.apiUrl}/${placa}`).pipe(catchError(this.handleError));
    }

    create(novoMotorista: CaminhaoRequest): Observable<CaminhaoResponse> {
        return this.http.post<CaminhaoResponse>(this.apiUrl, novoMotorista).pipe(catchError(this.handleError));
    }

    update(atualizarMotorista: CaminhaoRequest, placa: string): Observable<CaminhaoResponse> {
        return this.http.put<CaminhaoResponse>(`${this.apiUrl}/${placa}`, atualizarMotorista).pipe(catchError(this.handleError));
    }

    delete(placa: string): Observable<CaminhaoResponse> {
        return this.http.delete<CaminhaoResponse>(`${this.apiUrl}/${placa}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('Erro na API de Caminhão: ', error);
        return throwError(() => new Error('Erro ao consultar a API de caminhão.'));
    }
}