import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';

import { NavBar } from '../../components/nav-bar/nav-bar.component';
import { FooterComponent } from '../../components/footer/footer.component';

import { MotoristaRequest, MotoristaResponse } from '../../model/Motorista';
import { StatusMotorista } from '../../model/enums/StatusMotorista';
import { NovoMotoristaComponent } from '../../components/novo-motorista/novo-motorista.component';
import { MotoristaService } from '../../services/motorista.service';
import { AlertService } from '../../alert/alert.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CanComponentDeactivate } from '../../auth/unsaved-changes.guard';

@Component({
  selector: 'app-motorista',
  imports: [CommonModule, RouterLink, NavBar, FooterComponent, DatePipe, NovoMotoristaComponent],
  templateUrl: './motorista.page.html',
  styleUrl: './motorista.page.scss'
})
export class MotoristaPage implements OnInit, CanComponentDeactivate {
  listaMotorista: MotoristaResponse[] = [];

  exibirModal = false;
  motoristaSendoEditado = false;
  motoristaParaAtualizar: MotoristaResponse | null = null;

  @ViewChild(NovoMotoristaComponent)
  novoMotoristaComponent?: NovoMotoristaComponent;

  constructor(
    private motoristaService: MotoristaService,
    private alert: AlertService
  ) {}

  ngOnInit(): void {
    this.carregarMotoristas();
  }

  private carregarMotoristas(): void {
    this.motoristaService.findAll().subscribe({
      next: (motoristas) => {
        this.listaMotorista = motoristas;
        console.log('Motoristas carregados:', motoristas);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar motoristas', err);
        const mensagem = this.extrairMensagemErro(err);
        this.alert.error('Erro ao carregar motoristas', mensagem);
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
    this.motoristaParaAtualizar = null;
    this.exibirModal = true;
    this.motoristaSendoEditado = false;
  }

  abrirModalEditar(motorista: MotoristaResponse): void {
    this.motoristaParaAtualizar = motorista;
    this.exibirModal = true;
    this.motoristaSendoEditado = true;
  }

  fecharModel(): void {
    this.motoristaParaAtualizar = null;
    this.exibirModal = false;
    this.motoristaSendoEditado = false;
  }

  formatarTelefone(numero: string): string {
    const apenasNumeros = numero.replace(/\D/g, '');

    if (apenasNumeros.length !== 11) {
      return numero;
    }

    const ddd = apenasNumeros.substring(0, 2);
    const nove = apenasNumeros.substring(2, 3);
    const parte1 = apenasNumeros.substring(3, 7);
    const parte2 = apenasNumeros.substring(7);

    return `(${ddd}) ${nove} ${parte1}-${parte2}`;
  }

  formatarCPF(doc: string): string {
    const apenasNumeros = doc.replace(/\D/g, '');

    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    }
    return doc;
  }

  getStatusClass(status: StatusMotorista): string {
    switch (status) {
      case StatusMotorista.ATIVO:
        return 'status-ativo';
      case StatusMotorista.INATIVO:
        return 'status-inativo';
      default:
        return '';
    }
  }

  salvarMotorista(motoristaSalvo: MotoristaRequest): void {
    if (this.motoristaSendoEditado) {
      if (this.motoristaParaAtualizar?.cpf == null) {
        throw new Error('O cpf do motorista não pode ser nulo ao tentar salvar.');
      }

      this.motoristaService.update(motoristaSalvo, this.motoristaParaAtualizar.cpf).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Motorista atualizado com sucesso.');
          this.novoMotoristaComponent?.limparEstadoAlterado();
          this.carregarMotoristas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao atualizar um motorista: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao atualizar motorista', mensagem);
        }
      });
    } else {
      this.motoristaService.create(motoristaSalvo).subscribe({
        next: () => {
          this.alert.success('Sucesso', 'Motorista cadastrado com sucesso.');
          this.novoMotoristaComponent?.limparEstadoAlterado();
          this.carregarMotoristas();
          this.fecharModel();
        },
        error: (erro: HttpErrorResponse) => {
          console.error('Erros ao cadastrar um motorista: ', erro);
          const mensagem = this.extrairMensagemErro(erro);
          this.alert.error('Erro ao cadastrar motorista', mensagem);
        }
      });
    }
  }

  removerMotorista(): void {
  }

  podeSair(): boolean {
    if (this.exibirModal && this.novoMotoristaComponent?.temAlteracoes()) {
      return false;
    }
    return true;
  }
}
