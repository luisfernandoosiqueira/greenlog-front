import { BairroResponse } from "./Bairro"

export interface RuaResponse{
    id: number,
    origem: BairroResponse,
    destino: BairroResponse,
    distanciaKm: number
}

export interface RuaRequest{
    origemId: number,
    destinoId: number,
    distanciaKm: number
}

