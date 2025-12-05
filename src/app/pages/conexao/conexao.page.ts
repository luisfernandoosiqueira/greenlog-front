import { Component } from '@angular/core';
import { NavBar } from "../../components/nav-bar/nav-bar.component";
import { FooterComponent } from "../../components/footer/footer.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RuaRequest, RuaResponse } from '../../model/Rua';
import { BairroSimplesResponse } from '../../model/Bairro';
import { NovaRuaComponent } from "../../components/nova-rua/nova-rua.component";
import { BairroService } from '../../services/bairro.service';
import { ConexaoService } from '../../services/conexao.service';

@Component({
  selector: 'app-conexao',
  imports: [CommonModule, RouterLink, NavBar, FooterComponent, NovaRuaComponent],
  templateUrl: './conexao.page.html',
  styleUrl: './conexao.page.scss'
})
export class ConexaoPage {

  listaRuas: RuaResponse[] = [];
  listaBairros: BairroSimplesResponse [] = [];

  exibirModal: boolean = false;
  ruaSendoEditado: boolean = false;
  ruaParaAtualizar: RuaResponse | null = null;

  constructor(private bairroService: BairroService, private ruaConexaoService: ConexaoService) {
    this.bairroService.findAll().subscribe({
      next: (bairros) => {
        this.listaBairros = bairros;
        console.log("Bairros carregados:", bairros);
      },
      error: (err) => {
        console.error("Erro ao carregar bairros", err);
      }
    });

    this.ruaConexaoService.findAll().subscribe({
      next: (ruas) => {
        this.listaRuas = ruas;
        console.log("Ruas carregados:", ruas);
      },
      error: (err) => {
        console.error("Erro ao carregar ruas", err);
      }
    });
  }

  ngOnInit(): void {
  }

  abrirModalNovo() {
    this.ruaParaAtualizar = null;
    this.exibirModal = true;
    this.ruaSendoEditado = false;
  }

  abrirModalEditar(rua: RuaResponse) {
    this.ruaParaAtualizar = rua;
    this.exibirModal = true;
    this.ruaSendoEditado = true;
  }

  fecharModel() {
    this.ruaParaAtualizar = null;
    this.exibirModal = false;
    this.ruaSendoEditado = false;
  }

  getBairroNome(bairroId: number): string {
    console.log("Passando: " + bairroId);
    const bairro = this.listaBairros.find(b => b.id === bairroId);
    return bairro ? bairro.nome : "Desconhecido";
  }

  salvar(ruaSalvo: RuaRequest){
    if(this.ruaSendoEditado){
      if(this.ruaParaAtualizar?.id == null) throw new Error('O cpf do motorista não pode ser nulo ao tentar salvar.');
      this.ruaConexaoService.update(ruaSalvo, this.ruaParaAtualizar.id).subscribe({
        next: (resposta) => {
          console.log('Motorista atualizar com sucesso!');
          this.ruaConexaoService.findAll().subscribe({
            next: (dadosApi) => this.listaRuas = dadosApi
          });
          this.fecharModel();
        },
        error: (erro) => {
          console.error('Erros ao atualizar um motorista: ', erro);
        }
      })
    }else{
      this.ruaConexaoService.create(ruaSalvo).subscribe({
        next: (resposta) => {
          console.log('Motorista cadastrado com sucesso!');
          this.ruaConexaoService.findAll().subscribe({
            next: (dadosApi) => this.listaRuas = dadosApi
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
}
