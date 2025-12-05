import { Component, OnInit } from '@angular/core';
import { CaminhaoRequest, CaminhaoResponse } from '../../model/Caminhao';
import { StatusCaminhao } from '../../model/enums/StatusCaminhao';
import { StatusMotorista } from '../../model/enums/StatusMotorista';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NovoCaminhaoComponent } from "../../components/novo-caminhao/novo-caminhao.component";
import { CaminhaoService } from '../../services/caminhao.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';

@Component({
  selector: 'app-caminhao',
  imports: [NavBar, FooterComponent, RouterLink, CommonModule, NovoCaminhaoComponent],
  templateUrl: './caminhao.page.html',
  styleUrl: './caminhao.page.scss'
})
export class CaminhaoPage implements OnInit{
  listaCaminhao: CaminhaoResponse[] = [];

  exibirModal: boolean = false;
  caminhaoSendoEditado: boolean = false;
  caminhaoParaAtualizar: CaminhaoResponse | null = null;

  constructor(private caminhaoService: CaminhaoService) {}

  ngOnInit(): void {
    this.caminhaoService.findAll().subscribe({
      next: (caminhao) => {
        this.listaCaminhao = caminhao;
        console.log("Caminhões carregados:", caminhao);
      },
      error: (err) => {
        console.error("Erro ao carregar caminhão", err);
        alert("Erro ao carregar registros.");
      }
    });
  }

  abrirModalNovo() {
    this.caminhaoParaAtualizar = null;
    this.exibirModal = true;
    this.caminhaoSendoEditado = false;
  }

  abrirModalEditar(caminhao: CaminhaoResponse) {
    this.caminhaoParaAtualizar = caminhao;
    this.exibirModal = true;
    this.caminhaoSendoEditado = true;
  }

  fecharModel() {
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

  salvarCaminhao(caminhaoSalvo: CaminhaoRequest){
    if(this.caminhaoSendoEditado){
      if(this.caminhaoParaAtualizar?.placa == null) throw new Error('A placa do caminhão não pode ser nulo ao tentar salvar.');
      this.caminhaoService.update(caminhaoSalvo, this.caminhaoParaAtualizar.placa).subscribe({
        next: (resposta) => {
          console.log('Caminhão atualizar com sucesso!');
          this.caminhaoService.findAll().subscribe({
            next: (dadosApi) => this.listaCaminhao = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um caminhão: ', erro);
        }
      })
    }else{
      this.caminhaoService.create(caminhaoSalvo).subscribe({
        next: (resposta) => {
          console.log('Caminhão cadastrado com sucesso!');
          this.caminhaoService.findAll().subscribe({
            next: (dadosApi) => this.listaCaminhao = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao cadastrar um caminhão: ', erro);
        }
      })
      this.fecharModel();
    }
  }


  recarregarMotorista(){

  }

  removerMotorista(){

  }
}
