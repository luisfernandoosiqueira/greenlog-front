import { Component, OnInit } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MotoristaRequest, MotoristaResponse } from '../../model/Motorista';
import { StatusMotorista } from '../../model/enums/StatusMotorista';
import { NovoMotoristaComponent } from "../../components/novo-motorista/novo-motorista.component";
import { MotoristaService } from '../../services/motorista.service';

@Component({
  selector: 'app-motorista',
  imports: [CommonModule, RouterLink, NavBar, FooterComponent, DatePipe, NovoMotoristaComponent],
  templateUrl: './motorista.page.html',
  styleUrl: './motorista.page.scss'
})
export class MotoristaPage implements OnInit{
  //listaMotorista: MotoristaResponse[] = [];
  listaMotorista: MotoristaResponse[] = [];

  exibirModal: boolean = false;
  motoristaSendoEditado: boolean = false;
  motoristaParaAtualizar: MotoristaResponse | null = null;
  
  constructor(private motoristaService: MotoristaService) {}

  ngOnInit(): void {
    this.motoristaService.findAll().subscribe({
      next: (motorista) => {
        this.listaMotorista = motorista;
        console.log("Motorista carregados:", motorista);
      },
      error: (err) => {
        console.error("Erro ao carregar motorista", err);
      }
    });
  }

  abrirModalNovo() {
    this.motoristaParaAtualizar = null;
    this.exibirModal = true;
    this.motoristaSendoEditado = false;
  }

  abrirModalEditar(motorista: MotoristaResponse) {
    this.motoristaParaAtualizar = motorista;
    this.exibirModal = true;
    this.motoristaSendoEditado = true;
  }

  fecharModel() {
    this.motoristaParaAtualizar = null;
    this.exibirModal = false;
    this.motoristaSendoEditado = false;
  }

  formatarTelefone(numero: string): string {
    const apenasNumeros = numero.replace(/\D/g, "");

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
    const apenasNumeros = doc.replace(/\D/g, "");

    // CPF tem 11 dígitos
    if (apenasNumeros.length === 11) {
      return apenasNumeros.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
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

  salvarMotorista(motoristaSalvo: MotoristaRequest){
    if(this.motoristaSendoEditado){
      if(this.motoristaParaAtualizar?.cpf == null) throw new Error('O cpf do motorista não pode ser nulo ao tentar salvar.');
      this.motoristaService.update(motoristaSalvo, this.motoristaParaAtualizar.cpf).subscribe({
        next: (resposta) => {
          console.log('Motorista atualizar com sucesso!');
          this.motoristaService.findAll().subscribe({
            next: (dadosApi) => this.listaMotorista = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um motorista: ', erro);
        }
      })
    }else{
      this.motoristaService.create(motoristaSalvo).subscribe({
        next: (resposta) => {
          console.log('Motorista cadastrado com sucesso!');
          this.motoristaService.findAll().subscribe({
            next: (dadosApi) => this.listaMotorista = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao cadastrar um motorista: ', erro);
        }
      })
      this.fecharModel();
    }
  }

  removerMotorista(){

  }
}
