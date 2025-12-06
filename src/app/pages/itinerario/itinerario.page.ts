import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { BoxItinerarioComponent } from '../../components/box-itinerario/box-itinerario.component';
import { NovaoItinerarioComponent } from '../../components/novao-itinerario/novao-itinerario.component';

import { ItinerarioRequest, ItinerarioResponse } from '../../model/Itinerario';
import { ItinerarioService } from '../../services/itinerario.service';
import { AlertService } from '../../alert/alert.service';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-itinerario',
  imports: [
    CommonModule,
    RouterLink,
    NavBar,
    FooterComponent,
    BoxItinerarioComponent,
    NovaoItinerarioComponent,
    FormsModule
  ],
  templateUrl: './itinerario.page.html',
  styleUrl: './itinerario.page.scss'
})
export class ItinerarioPage implements OnInit, CanComponentDeactivate {
  listaItinerarioData: ItinerarioResponse[] = [];

  exibirModal = false;
  itinerarioSendoEditado = false;
  itinerarioParaAtualizar: ItinerarioResponse | null = null;

  dataSelecionada = '';
  dataAtiva = false;

  @ViewChild(NovaoItinerarioComponent)
  novaoItinerarioComponent?: NovaoItinerarioComponent;

  constructor(
    private itinerarioService: ItinerarioService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
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
    this.itinerarioParaAtualizar = null;
    this.exibirModal = true;
    this.itinerarioSendoEditado = false;
  }

  abrirModalEditar(itinerario: ItinerarioResponse): void {
    this.itinerarioParaAtualizar = itinerario;
    this.exibirModal = true;
    this.itinerarioSendoEditado = true;
  }

  fecharModel(): void {
    this.itinerarioParaAtualizar = null;
    this.exibirModal = false;
    this.itinerarioSendoEditado = false;
  }

  pesquisarItinerario(data: string): void {
    this.dataAtiva = true;
    this.dataSelecionada = data;

    this.itinerarioService.findAll().subscribe({
      next: (resposta) => {
        this.listaItinerarioData = resposta;
        this.fecharModel();
      },
      error: (erro: HttpErrorResponse) => {
        console.error('Erro ao pesquisar itinerário: ', erro);
        const mensagem = this.extrairMensagemErro(erro);
        this.alert.error('Erro ao buscar itinerários', mensagem);
      }
    });
  }

  converterParaBR(data: string): string {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  salvarItinerario(itinerarioSalvo: ItinerarioRequest): void {
    if (this.itinerarioSendoEditado) {
      if (this.itinerarioParaAtualizar?.id == null) {
        throw new Error('O id do itinerário não pode ser nulo ao tentar salvar.');
      }

      this.itinerarioService.update(itinerarioSalvo, this.itinerarioParaAtualizar.id).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Itinerário atualizado com sucesso.');
          this.novaoItinerarioComponent?.limparEstadoAlterado();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar um itinerário: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar itinerário', mensagem);
        }
      });
    } else {
      this.itinerarioService.create(itinerarioSalvo).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Itinerário cadastrado com sucesso.');
          this.novaoItinerarioComponent?.limparEstadoAlterado();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar um itinerário: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar itinerário', mensagem);
        }
      });
    }
  }

  podeSair(): boolean {
    if (this.exibirModal && this.novaoItinerarioComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
