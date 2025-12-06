import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BoxBairroComponent } from '../../components/box-bairro/box-bairro.component';
import { NovoBairroComponent } from '../../components/novo-bairro/novo-bairro.component';

import { BairroRequest, BairroResponse } from '../../model/Bairro';
import { BairroService } from '../../services/bairro.service';
import { AlertService } from '../../alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-bairro-ponto',
  imports: [CommonModule, NavBar, FooterComponent, RouterLink, BoxBairroComponent, NovoBairroComponent],
  templateUrl: './bairro-ponto.page.html',
  styleUrl: './bairro-ponto.page.scss'
})
export class BairroPontoPage implements OnInit, CanComponentDeactivate {
  listaBairros: BairroResponse[] = [];

  exibirModalBairro = false;

  @ViewChild(NovoBairroComponent)
  novoBairroComponent?: NovoBairroComponent;

  constructor(
    private bairroService: BairroService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.carregarBairros();
  }

  private carregarBairros(): void {
    this.bairroService.findAll().subscribe({
      next: (bairros) => {
        this.listaBairros = bairros;
        console.log('Bairros carregados:', bairros);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar bairros', err);
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao carregar bairros', mensagem);
      }
    });
  }

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

  abrirModalNovoBairro(): void {
    this.exibirModalBairro = true;
  }

  abrirModalBairroEditar(): void {
    // edição de bairro pode ser integrada depois, mantendo a assinatura atual
    this.exibirModalBairro = true;
  }

  fecharModalBairro(): void {
    this.exibirModalBairro = false;
  }

  salvarBairro(bairroSalvo: BairroRequest): void {
    this.bairroService.create(bairroSalvo).subscribe({
      next: () => {
        this.alert.success('Sucesso', 'Bairro cadastrado com sucesso.');
        this.novoBairroComponent?.limparEstadoAlterado();
        this.carregarBairros();
        this.fecharModalBairro();
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erros ao cadastrar um bairro: ', erro);
        const mensagem = this.extrairMensagemErro(erro);
        this.alert.error('Erro ao cadastrar bairro', mensagem);
      }
    });
  }

  recarregarBairros(): void {
    this.carregarBairros();
  }

  podeSair(): boolean {
    if (this.exibirModalBairro && this.novoBairroComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
