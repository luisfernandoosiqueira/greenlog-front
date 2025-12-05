import { StatusMotorista } from "./enums/StatusMotorista";

export interface MotoristaResponse{
    cpf: string,
    nome: string,
    data: string,
    telefone: string,
    status: StatusMotorista
}

export interface MotoristaRequest{
    cpf: string,
    nome: string,
    data: string,
    telefone: string,
    status: StatusMotorista
}