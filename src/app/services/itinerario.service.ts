import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ItinerarioRequest, ItinerarioResponse } from "../model/Itinerario";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ItinerarioService{
    private apiUrl = 'http://localhost:8080/api/itinerarios';

    constructor(private http: HttpClient) {}

    findAll(): Observable<ItinerarioResponse[]> {
        return this.http.get<ItinerarioResponse[]>(this.apiUrl).pipe(catchError(this.handleError));
    }

    findByData(id: number): Observable<ItinerarioResponse> {
        return this.http.get<ItinerarioResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    create(novoItinerario: ItinerarioRequest): Observable<ItinerarioResponse> {
        return this.http.post<ItinerarioResponse>(this.apiUrl, novoItinerario).pipe(catchError(this.handleError));
    }

    update(atualizarItinerario: ItinerarioRequest, id: number): Observable<ItinerarioResponse> {
        return this.http.put<ItinerarioResponse>(`${this.apiUrl}/${id}`, atualizarItinerario).pipe(catchError(this.handleError));
    }

    delete(id: number): Observable<ItinerarioResponse> {
        return this.http.delete<ItinerarioResponse>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {
        console.error('Erro na API bairros: ', error);
        return throwError(() => new Error('Erro ao consultar a API bairro.'));
    }
}