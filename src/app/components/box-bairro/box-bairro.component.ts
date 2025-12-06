import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { NovoPontoComponent } from '../novo-ponto/novo-ponto.component';
import { NovoBairroComponent } from '../novo-bairro/novo-bairro.component';

import { BairroRequest, BairroResponse } from '../../model/Bairro';
import { PontoColetaRequest, PontoColetaResponse } from '../../model/PontoColeta';
import { PontoColetaService } from '../../services/pontoColeta.service';
import { BairroService } from '../../services/bairro.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-box-bairro',
  imports: [CommonModule, ReactiveFormsModule, NovoPontoComponent, NovoBairroComponent],
  templateUrl: './box-bairro.component.html',
  styleUrl: './box-bairro.component.scss'
})
export class BoxBairroComponent implements OnInit {
  @Input() bairro: BairroResponse | null = null;

  exibirModalPonto = false;
  pontoSendoEditado = false;
  pontoParaAtualizar: PontoColetaResponse | null = null;

  exibirModalBairro = false;
  bairroSendoEditado = false;
  bairroParaAtualizar: BairroResponse | null = null;

  @ViewChild(NovoPontoComponent)
  novoPontoComp?: NovoPontoComponent;

  @ViewChild(NovoBairroComponent)
  novoBairroComp?: NovoBairroComponent;

  constructor(
    private pontoColetaService: PontoColetaService,
    private bairroService: BairroService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {}

  private extrairMensagemErro(err: HttpErrorResponse): string {
    if (err.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (err.error.message) {
        return err.error.message;
      }
      if (err.error.fieldErrors) {
        const fieldErrors = err.error.fieldErrors as Record<string, string>;
        const mensagens = Object.values(fieldErrors);
        if (mensagens.length > 0) {
          return mensagens[0];
        }
      }
    }
    if (err.status === 0) {
      return 'Não foi possível conectar ao servidor.';
    }
    return 'Erro ao processar a requisição.';
  }

  private recarregarBairroAtual(): void {
    if (!this.bairro?.id) {
      return;
    }

    this.bairroService.findAll().subscribe({
      next: (bairros) => {
        const encontrado = bairros.find(b => b.id === this.bairro?.id);
        if (encontrado) {
          this.bairro = encontrado;
        }
      },
      error: (err: HttpErrorResponse) => {
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao recarregar bairro', mensagem);
      }
    });
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
    return ponto.tiposResiduos?.join(', ') || '';
  }

  salvarPonto(pontoColetaSalvo: PontoColetaRequest) {
    if (this.pontoSendoEditado) {
      if (this.pontoParaAtualizar?.id == null) {
        throw new Error('O id do ponto de coleta não pode ser nulo ao tentar salvar.');
      }

      this.pontoColetaService.update(pontoColetaSalvo, this.pontoParaAtualizar.id).subscribe({
        next: () => {
          this.alert
            .success('Sucesso', 'Ponto de coleta atualizado com sucesso.')
            .then(() => {
              this.novoPontoComp?.limparEstadoAlterado();
              this.recarregarBairroAtual();
              this.fecharModalPonto();
            });
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar um ponto de coleta: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar ponto de coleta', mensagem);
        }
      });
    } else {
      this.pontoColetaService.create(pontoColetaSalvo).subscribe({
        next: () => {
          this.alert
            .success('Sucesso', 'Ponto de coleta cadastrado com sucesso.')
            .then(() => {
              this.novoPontoComp?.limparEstadoAlterado();
              this.recarregarBairroAtual();
              this.fecharModalPonto();
            });
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar um ponto de coleta: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar ponto de coleta', mensagem);
        }
      });
    }
  }

  salvarBairro(bairroSalvo: BairroRequest) {
    if (this.bairroSendoEditado) {
      if (this.bairroParaAtualizar?.id == null) {
        throw new Error('O id de bairro não pode ser nulo ao tentar salvar.');
      }

      this.bairroService.update(bairroSalvo, this.bairroParaAtualizar.id).subscribe({
        next: () => {
          this.alert
            .success('Sucesso', 'Bairro atualizado com sucesso.')
            .then(() => {
              this.novoBairroComp?.limparEstadoAlterado();
              this.recarregarBairroAtual();
              this.fecharModalBairro();
            });
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar um bairro: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar bairro', mensagem);
        }
      });
    }
  }
}
