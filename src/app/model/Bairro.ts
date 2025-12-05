import { PontoColetaResponse } from "./PontoColeta"
import { RuaResponse } from "./Rua"

export interface BairroResponse{
    id: number,
    nome: string,
    ruas: RuaResponse[],
    pontosColetas: PontoColetaResponse[],
}

export interface BairroSimplesResponse{
    id: number,
    nome: string,
}

export interface BairroRequest{
    nome: string
}
