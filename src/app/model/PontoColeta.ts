import { BairroResponse } from "./Bairro";
import { TipoResiduo } from "./enums/TipoResiduo";

export interface PontoColetaResponse{
    id: number,
    bairro: BairroResponse,
    nome: string,
    responsavel: string,
    telefone: string,
    email: string,
    endereco: string,
    horaEntrada: string;
    horaSaida: string;
    quantidadeResiduosKg: number,
    tiposResiduos: TipoResiduo[]
}

export interface PontoColetaRequest{
    bairroId: number,
    nome: string,
    responsavel: string,
    telefone: string,
    email: string,
    endereco: string,
    horaEntrada: string,
    horaSaida: string,
    quantidadeResiduosKg: number,
    tiposResiduos: TipoResiduo[]
}