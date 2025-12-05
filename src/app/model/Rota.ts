import { CaminhaoResponse } from "./Caminhao"
import { TipoResiduo } from "./enums/TipoResiduo"
import { PontoColetaResponse } from "./PontoColeta"
import { TrechoRota } from "./Trecho"

export interface RotaResponse{
    id: number,
    nome: string,
    pesoTotal: number,
    dataCriacao: string,
    tipoResiduo: TipoResiduo,
    caminhao: CaminhaoResponse,
    distanciaTotal: number,
    trechos: TrechoRota[],
    pontosColeta: PontoColetaResponse[]
}

export interface RotaRequest{
    nome: string,
    caminhaoPlaca: string,
    tipoResiduo: number,
    pontosColetaIds: number[]
}