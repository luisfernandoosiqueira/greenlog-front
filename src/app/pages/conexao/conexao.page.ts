import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { NovaRuaComponent } from '../../components/nova-rua/nova-rua.component';

import { RuaRequest, RuaResponse } from '../../model/Rua';
import { BairroSimplesResponse } from '../../model/Bairro';
import { BairroService } from '../../services/bairro.service';
import { ConexaoService } from '../../services/conexao.service';
import { AlertService } from '../../alert/alert.service';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-conexao',
  imports: [CommonModule, RouterLink, NavBar, FooterComponent, NovaRuaComponent],
  templateUrl: './conexao.page.html',
  styleUrl: './conexao.page.scss'
})
export class ConexaoPage implements OnInit, CanComponentDeactivate {

  listaRuas: RuaResponse[] = [];
  listaBairros: BairroSimplesResponse[] = [];

  exibirModal = false;
  ruaSendoEditado = false;
  ruaParaAtualizar: RuaResponse | null = null;

  @ViewChild(NovaRuaComponent)
  novaRuaComponent?: NovaRuaComponent;

  constructor(
    private bairroService: BairroService,
    private ruaConexaoService: ConexaoService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.carregarBairros();
    this.carregarRuas();
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

  private carregarRuas(): void {
    this.ruaConexaoService.findAll().subscribe({
      next: (ruas) => {
        this.listaRuas = ruas;
        console.log('Ruas carregadas:', ruas);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar ruas', err);
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao carregar conexões entre bairros', mensagem);
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
    this.ruaParaAtualizar = null;
    this.exibirModal = true;
    this.ruaSendoEditado = false;
  }

  abrirModalEditar(rua: RuaResponse): void {
    this.ruaParaAtualizar = rua;
    this.exibirModal = true;
    this.ruaSendoEditado = true;
  }

  fecharModel(): void {
    this.ruaParaAtualizar = null;
    this.exibirModal = false;
    this.ruaSendoEditado = false;
  }

  getBairroNome(bairroId: number): string {
    const bairro = this.listaBairros.find(b => b.id === bairroId);
    return bairro ? bairro.nome : 'Desconhecido';
  }

  salvar(ruaSalvo: RuaRequest): void {
    if (this.ruaSendoEditado) {
      if (this.ruaParaAtualizar?.id == null) {
        throw new Error('O id da rua não pode ser nulo ao tentar salvar.');
      }

      this.ruaConexaoService.update(ruaSalvo, this.ruaParaAtualizar.id).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Conexão atualizada com sucesso.');
          this.novaRuaComponent?.limparEstadoAlterado();
          this.carregarRuas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar uma rua: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar conexão', mensagem);
        }
      });
    } else {
      this.ruaConexaoService.create(ruaSalvo).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Conexão cadastrada com sucesso.');
          this.novaRuaComponent?.limparEstadoAlterado();
          this.carregarRuas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar uma rua: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar conexão', mensagem);
        }
      });
    }
  }

  podeSair(): boolean {
    if (this.exibirModal && this.novaRuaComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
