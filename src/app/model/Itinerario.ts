import { RotaResponse } from "./Rota";

export interface ItinerarioResponse{
    id: number,
    data: string,
    distanciaTotal: string,
    ativo: boolean,
    rota: RotaResponse
}

export interface ItinerarioRequest{
    rotaId: number,
    data: string
}