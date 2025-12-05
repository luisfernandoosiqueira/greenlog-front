import { Component } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BoxItinerarioComponent } from "../../components/box-itinerario/box-itinerario.component";
import { ItinerarioRequest, ItinerarioResponse } from '../../model/Itinerario';
import { NovaoItinerarioComponent } from "../../components/novao-itinerario/novao-itinerario.component";
import { ItinerarioService } from '../../services/itinerario.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-itinerario',
  imports: [CommonModule, RouterLink, NavBar, FooterComponent, BoxItinerarioComponent, NovaoItinerarioComponent, FormsModule],
  templateUrl: './itinerario.page.html',
  styleUrl: './itinerario.page.scss'
})
export class ItinerarioPage {
  listaItinerarioData: ItinerarioResponse[] = []

  exibirModal: boolean = false;
  itinerarioSendoEditado: boolean = false;
  itinerarioParaAtualizar: ItinerarioResponse | null = null;

  dataSelecionada: string = "";
  dataAtiva: boolean = false;

  constructor(private itinerarioService: ItinerarioService) {}

  abrirModalNovo() {
    this.itinerarioParaAtualizar = null;
    this.exibirModal = true;
    this.itinerarioSendoEditado = false;
  }

  abrirModalEditar(itinerario: ItinerarioResponse) {
    this.itinerarioParaAtualizar = itinerario;
    this.exibirModal = true;
    this.itinerarioSendoEditado = true;
  }

  fecharModel() {
    this.itinerarioParaAtualizar = null;
    this.exibirModal = false;
    this.itinerarioSendoEditado = false;
  }

  pesquisarItinerario(data: string){
    this.dataAtiva = true;
    this.itinerarioService.findAll().subscribe({
      next: (resposta) => {
        this.listaItinerarioData = resposta;
        console.log(resposta);
        this.fecharModel();
      },
      error: (erro) => {
        console.error('Erros ao cadastrar um itinerario: ', erro);
      }
    })
  }

  converterParaBR(data: string): string {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  salvarItinerario(itinerarioSalvo: ItinerarioRequest){
    if(this.itinerarioSendoEditado){
      if(this.itinerarioParaAtualizar?.id == null) throw new Error('O cpf do itinerario não pode ser nulo ao tentar salvar.');
      this.itinerarioService.update(itinerarioSalvo, this.itinerarioParaAtualizar.id).subscribe({
        next: (resposta) => {
          console.log('Itinerario atualizar com sucesso!');
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um itinerario: ', erro);
        }
      })
    }else{
      this.itinerarioService.create(itinerarioSalvo).subscribe({
        next: (resposta) => {
          console.log('Itinerario cadastrado com sucesso!');
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao cadastrar um itinerario: ', erro);
        }
      })
      this.fecharModel();
    }
  }
  
}
