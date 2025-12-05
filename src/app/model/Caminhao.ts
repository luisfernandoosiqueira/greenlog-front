import { StatusCaminhao } from "./enums/StatusCaminhao";
import { TipoResiduo } from "./enums/TipoResiduo";
import { MotoristaResponse } from "./Motorista";

export interface CaminhaoResponse{
    placa: string,
    motorista: MotoristaResponse,
    capacidadeKg: number,
    status: StatusCaminhao,
    tiposResiduos: TipoResiduo[]
}

export interface CaminhaoRequest{
    placa: string,
    motoristaCpf: string,
    capacidadeKg: number,
    status: StatusCaminhao,
    tiposResiduos: TipoResiduo[]
}