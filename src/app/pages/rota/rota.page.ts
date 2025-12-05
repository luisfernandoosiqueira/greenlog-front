import { Component } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { RotaRequest, RotaResponse } from '../../model/Rota';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NovaRotaComponent } from "../../components/nova-rota/nova-rota.component";
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { RotaService } from '../../services/rota.service';

@Component({
  selector: 'app-rota',
  imports: [CommonModule, FormsModule, RouterLink, NavBar, FooterComponent, NovaRotaComponent],
  templateUrl: './rota.page.html',
  styleUrl: './rota.page.scss'
})
export class RotaPage {

  listaRota: RotaResponse[] = []

  exibirModal: boolean = false;
  rotaSendoEditado: boolean = false;
  rotaParaAtualizar: RotaResponse | null = null;

  constructor(private rotaService: RotaService) {
    this.rotaService.findAll().subscribe({
      next: (dadosApi) => {
        this.listaRota = dadosApi;
      },
      error: (erro) => {
        console.error('Erros ao cadastrar uma rota: ', erro);
      }
    })
  }
  
  abrirModalNovo() {
    this.rotaParaAtualizar = null;
    this.exibirModal = true;
    this.rotaSendoEditado = false;
  }

  abrirModalEditar(rua: RotaResponse) {
    this.rotaParaAtualizar = rua;
    this.exibirModal = true;
    this.rotaSendoEditado = true;
  }

  fecharModel() {
    this.rotaParaAtualizar = null;
    this.exibirModal = false;
    this.rotaSendoEditado = false;
  }

  getTodosResiduos(tiposResiduo: TipoResiduo[]): string {
    if (!tiposResiduo || tiposResiduo.length === 0) return "";

    return tiposResiduo.map(r => r).join(", ");
  }

  salvar(ruaSalvo: RotaRequest){
    if(this.rotaSendoEditado){
      if(this.rotaParaAtualizar?.id == null) throw new Error('O id da rota não pode ser nulo ao tentar salvar.');
      this.rotaService.update(ruaSalvo, this.rotaParaAtualizar.id).subscribe({
        next: (resposta) => {
          console.log('Rota atualizar com sucesso!');
          this.rotaService.findAll().subscribe({
            next: (dadosApi) => this.listaRota = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao atualizar uma rota: ', erro);
        }
      })
    }else{
      this.rotaService.create(ruaSalvo).subscribe({
        next: (resposta) => {
          console.log('Rota cadastrado com sucesso!');
          this.rotaService.findAll().subscribe({
            next: (dadosApi) => this.listaRota = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao cadastrar uma rota: ', erro);
        }
      })
      this.fecharModel();
    }
  }
}
