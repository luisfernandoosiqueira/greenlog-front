import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, Observable, throwError } from "rxjs";
import { MotoristaRequest, MotoristaResponse } from "../model/Motorista";

@Injectable({
  providedIn: 'root'
})

export class MotoristaService {
    private apiUrl = 'http://localhost:8080/api/motoristas';

    constructor(private http: HttpClient) {}

    findAll(): Observable<MotoristaResponse[]> {
        return this.http.get<MotoristaResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    findByCpf(cpf: string): Observable<MotoristaResponse> {
        return this.http.get<MotoristaResponse>(`${this.apiUrl}/${cpf}`).pipe(catchError(this.handleError));
    }

    create(novoMotorista: MotoristaRequest): Observable<MotoristaResponse> {
        return this.http.post<MotoristaResponse>(this.apiUrl, novoMotorista).pipe(catchError(this.handleError));
    }

    update(atualizarMotorista: MotoristaRequest, cpf: string): Observable<MotoristaResponse> {
        return this.http.put<MotoristaResponse>(`${this.apiUrl}/${cpf}`, atualizarMotorista).pipe(catchError(this.handleError));
    }

    delete(cpf: string): Observable<MotoristaResponse> {
        return this.http.delete<MotoristaResponse>(`${this.apiUrl}/${cpf}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('Erro na API de Puxadores de Produto: ', error);
        return throwError(() => new Error('Erro ao consultar a API de puxadores de produto.'));
    }
}