import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NovaRotaComponent } from '../../components/nova-rota/nova-rota.component';

import { RotaRequest, RotaResponse } from '../../model/Rota';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { RotaService } from '../../services/rota.service';
import { AlertService } from '../../alert/alert.service';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-rota',
  imports: [CommonModule, FormsModule, RouterLink, NavBar, FooterComponent, NovaRotaComponent],
  templateUrl: './rota.page.html',
  styleUrl: './rota.page.scss'
})
export class RotaPage implements OnInit, CanComponentDeactivate {

  listaRota: RotaResponse[] = [];

  exibirModal = false;
  rotaSendoEditado = false;
  rotaParaAtualizar: RotaResponse | null = null;

  @ViewChild(NovaRotaComponent)
  novaRotaComponent?: NovaRotaComponent;

  constructor(
    private rotaService: RotaService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.carregarRotas();
  }

  private carregarRotas(): void {
    this.rotaService.findAll().subscribe({
      next: (dadosApi) => {
        this.listaRota = dadosApi;
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao carregar rotas: ', erro);
        const mensagem = this.extrairMensagemErro(erro);
        this.alert.error('Erro ao carregar rotas', mensagem);
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

  abrirModalNovo(): void {
    this.rotaParaAtualizar = null;
    this.exibirModal = true;
    this.rotaSendoEditado = false;
  }

  abrirModalEditar(rota: RotaResponse): void {
    this.rotaParaAtualizar = rota;
    this.exibirModal = true;
    this.rotaSendoEditado = true;
  }

  fecharModel(): void {
    this.rotaParaAtualizar = null;
    this.exibirModal = false;
    this.rotaSendoEditado = false;
  }

  getTodosResiduos(tiposResiduo: TipoResiduo[]): string {
    if (!tiposResiduo || tiposResiduo.length === 0) return '';
    return tiposResiduo.map(r => r).join(', ');
  }

  salvar(rotaSalva: RotaRequest): void {
    if (this.rotaSendoEditado) {
      if (this.rotaParaAtualizar?.id == null) {
        throw new Error('O id da rota não pode ser nulo ao tentar salvar.');
      }

      this.rotaService.update(rotaSalva, this.rotaParaAtualizar.id).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Rota atualizada com sucesso.');
          this.novaRotaComponent?.limparEstadoAlterado();
          this.carregarRotas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar uma rota: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar rota', mensagem);
        }
      });
    } else {
      this.rotaService.create(rotaSalva).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Rota cadastrada com sucesso.');
          this.novaRotaComponent?.limparEstadoAlterado();
          this.carregarRotas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar uma rota: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar rota', mensagem);
        }
      });
    }
  }

  podeSair(): boolean {
    if (this.exibirModal && this.novaRotaComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
