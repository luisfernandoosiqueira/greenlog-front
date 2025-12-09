import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { CaminhaoRequest, CaminhaoResponse } from '../../model/Caminhao';
import { StatusCaminhao } from '../../model/enums/StatusCaminhao';
import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NovoCaminhaoComponent } from '../../components/novo-caminhao/novo-caminhao.component';
import { CaminhaoService } from '../../services/caminhao.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { AlertService } from '../../alert/alert.service';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-caminhao',
  imports: [NavBar, FooterComponent, RouterLink, CommonModule, NovoCaminhaoComponent],
  templateUrl: './caminhao.page.html',
  styleUrl: './caminhao.page.scss'
})
export class CaminhaoPage implements OnInit, CanComponentDeactivate {
  listaCaminhao: CaminhaoResponse[] = [];

  exibirModal = false;
  caminhaoSendoEditado = false;
  caminhaoParaAtualizar: CaminhaoResponse | null = null;

  @ViewChild(NovoCaminhaoComponent)
  novoCaminhaoComponent?: NovoCaminhaoComponent;

  constructor(
    private caminhaoService: CaminhaoService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.carregarCaminhoes();
  }

  private carregarCaminhoes(): void {
    this.caminhaoService.findAll().subscribe({
      next: (caminhao) => {
        this.listaCaminhao = caminhao;
        console.log('Caminhões carregados:', caminhao);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar caminhão', err);
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao carregar caminhões', mensagem);
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
    this.caminhaoParaAtualizar = null;
    this.exibirModal = true;
    this.caminhaoSendoEditado = false;
  }

  abrirModalEditar(caminhao: CaminhaoResponse): void {
    this.caminhaoParaAtualizar = caminhao;
    this.exibirModal = true;
    this.caminhaoSendoEditado = true;
  }

  fecharModel(): void {
    this.caminhaoParaAtualizar = null;
    this.exibirModal = false;
    this.caminhaoSendoEditado = false;
  }

  getStatusClass(status: StatusCaminhao): string {
    switch (status) {
      case StatusCaminhao.ATIVO:
        return 'status-ativo';
      case StatusCaminhao.INATIVO:
        return 'status-inativo';
      default:
        return '';
    }
  }

  getTiposTexto(tipos: TipoResiduo[]): string {
    if (!tipos || tipos.length === 0) return '—';
    return tipos.map(t => t).join(', ');
  }

  salvarCaminhao(caminhaoSalvo: CaminhaoRequest): void {
    if (this.caminhaoSendoEditado) {
      if (this.caminhaoParaAtualizar?.placa == null) {
        throw new Error('A placa do caminhão não pode ser nula ao tentar salvar.');
      }

      this.caminhaoService.update(caminhaoSalvo, this.caminhaoParaAtualizar.placa).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Caminhão atualizado com sucesso.');
          this.novoCaminhaoComponent?.limparEstadoAlterado();
          this.carregarCaminhoes();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar um caminhão: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar caminhão', mensagem);
        }
      });
    } else {
      this.caminhaoService.create(caminhaoSalvo).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Caminhão cadastrado com sucesso.');
          this.novoCaminhaoComponent?.limparEstadoAlterado();
          this.carregarCaminhoes();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar um caminhão: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar caminhão', mensagem);
        }
      });
    }
  }

  recarregarMotorista(): void {
  }

  removerMotorista(): void {
  }

  podeSair(): boolean {
    if (this.exibirModal && this.novoCaminhaoComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
