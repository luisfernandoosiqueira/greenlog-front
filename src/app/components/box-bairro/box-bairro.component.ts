import { Component, Input, OnInit } from '@angular/core';
import { NovoPontoComponent } from "../novo-ponto/novo-ponto.component";
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BairroRequest, BairroResponse } from '../../model/Bairro';
import { PontoColetaRequest, PontoColetaResponse } from '../../model/PontoColeta';
import { NovoBairroComponent } from "../novo-bairro/novo-bairro.component";
import { PontoColetaService } from '../../services/pontoColeta.service';
import { BairroService } from '../../services/bairro.service';

@Component({
  selector: 'app-box-bairro',
  imports: [CommonModule, ReactiveFormsModule, NovoPontoComponent, NovoBairroComponent],
  templateUrl: './box-bairro.component.html',
  styleUrl: './box-bairro.component.scss'
})
export class BoxBairroComponent implements OnInit {
  @Input() bairro: BairroResponse | null = null;

  exibirModalPonto: boolean = false;
  pontoSendoEditado: boolean = false;
  pontoParaAtualizar: PontoColetaResponse | null = null;

  exibirModalBairro: boolean = false;
  bairroSendoEditado: boolean = false;
  bairroParaAtualizar: BairroResponse | null = null;

  constructor(private pontoColetaService: PontoColetaService, private bairroService: BairroService) {}

  ngOnInit(): void {
  }

  abrirModalNovoBairro() {
    this.bairroParaAtualizar = null;
    this.exibirModalBairro = true;
    this.bairroSendoEditado = false;
  }

  abrirModalEditarBairro(bairro: BairroResponse) {
    this.bairroParaAtualizar = bairro;
    this.exibirModalBairro = true;
    this.bairroSendoEditado = true;
  }

  fecharModalBairro() {
    this.bairroParaAtualizar = null;
    this.exibirModalBairro = false;
    this.bairroSendoEditado = false;
  }

  abrirModalNovoPonto() {
    this.pontoParaAtualizar = null;
    this.exibirModalPonto = true;
    this.pontoSendoEditado = false;
  }

  abrirModalEditarPonto(ponto: PontoColetaResponse) {
    this.pontoParaAtualizar = ponto;
    this.exibirModalPonto = true;
    this.pontoSendoEditado = true;
  }

  fecharModalPonto() {
    this.pontoParaAtualizar = null;
    this.exibirModalPonto = false;
    this.pontoSendoEditado = false;
  }

  getTiposResiduos(ponto: PontoColetaResponse): string {
    return ponto.tiposResiduos?.join(", ") || "";
  }

  salvarPonto(pontoColetaSalvo: PontoColetaRequest) {
    if(this.pontoSendoEditado){
      if(this.pontoParaAtualizar?.id == null) throw new Error('O id do ponto de coleta não pode ser nulo ao tentar salvar.');
      this.pontoColetaService.update(pontoColetaSalvo, this.pontoParaAtualizar.id).subscribe({
        next: (resposta) => {
          console.log('Ponto de coleta atualizar com sucesso!' + resposta);
          this.fecharModalPonto();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um ponto de coleta: ', erro);
        }
      })
    }else{
      this.pontoColetaService.create(pontoColetaSalvo).subscribe({
        next: (resposta) => {
          console.log('Ponto de coleta cadastrado com sucesso!' + resposta);
          this.fecharModalPonto();
        },
        error: (erro) => {
          console.error('Erros ao cadastrar um ponto de coleta: ', erro);
        }
      })
      this.fecharModalPonto();
    }
  }

  salvarBairro(bairroSalvo: BairroRequest) {
    if(this.bairroSendoEditado){
      if(this.bairroParaAtualizar?.id == null) throw new Error('O id de bairro não pode ser nulo ao tentar salvar.');
      this.bairroService.update(bairroSalvo, this.bairroParaAtualizar.id).subscribe({
        next: (resposta) => {
          console.log('Bairro atualizar com sucesso!');
          this.fecharModalBairro();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um bairro: ', erro);
        }
      })
    }
  }

}
