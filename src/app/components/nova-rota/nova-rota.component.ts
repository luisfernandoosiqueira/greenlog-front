import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RotaRequest, RotaResponse } from '../../model/Rota';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaminhaoResponse } from '../../model/Caminhao';
import { PontoColetaResponse } from '../../model/PontoColeta';
import { CommonModule } from '@angular/common';
import { CaminhaoService } from '../../services/caminhao.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { PontoColetaService } from '../../services/pontoColeta.service';

@Component({
  selector: 'app-nova-rota',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nova-rota.component.html',
  styleUrl: './nova-rota.component.scss'
})
export class NovaRotaComponent implements OnInit {
  @Input() rotaParaEditar: RotaResponse | null = null;

  @Output() aoSalvar = new EventEmitter<RotaRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  caminhoesDisponiveis: CaminhaoResponse[] = [];
  tiposResiduosEnum = Object.keys(TipoResiduo);
  pontosDisponiveis: PontoColetaResponse[] = [];

  form: FormGroup;

  constructor(private fb: FormBuilder,private caminhaoService: CaminhaoService, private pontoColetaService: PontoColetaService) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      caminhaoPlaca: ['', Validators.required],
      tipoResiduo: ['', Validators.required],

      ponto1: ['', Validators.required],
      ponto2: [''],
      ponto3: [''],
    });

    caminhaoService.findAll().subscribe({
      next: (caminhao) => {
        this.caminhoesDisponiveis = caminhao;
        console.log("Caminhões carregados:", caminhao);
      },
      error: (err) => {
        console.error("Erro ao carregar caminhão", err);
        alert("Erro ao carregar registros.");
      }
    });

    pontoColetaService.findAll().subscribe({
      next: (pontos) => {
        this.pontosDisponiveis = pontos;
        console.log("Pontos carregados:", pontos);
      },
      error: (err) => {
        console.error("Erro ao carregar pontos", err);
        alert("Erro ao carregar registros.");
      }
    });
  }

  ngOnInit(): void {
    if (this.rotaParaEditar) {
      this.form.patchValue({
        nome: this.rotaParaEditar.nome,
        caminhaoPlaca: this.rotaParaEditar.caminhao.placa,
        tipoResiduo: this.rotaParaEditar.tipoResiduo,
      });

      // Preenche pontos se existir
      if (this.rotaParaEditar.pontosColeta?.length >= 3) {
        this.form.patchValue({
          ponto1: this.rotaParaEditar.pontosColeta[0].id,
          ponto2: this.rotaParaEditar.pontosColeta[1].id,
          ponto3: this.rotaParaEditar.pontosColeta[2].id,
        });
      }
    }
  }

  salvar() {
    if (this.form.invalid) return;

    const pontosIds = [
      this.form.value.ponto1,
      this.form.value.ponto2,
      this.form.value.ponto3
    ].filter(id => id); // remove valores vazios/null

    const rota: RotaRequest = {
      nome: this.form.value.nome,
      caminhaoPlaca: this.form.value.caminhaoPlaca,
      tipoResiduo: this.form.value.tipoResiduo,
      pontosColetaIds: pontosIds
    };

    this.aoSalvar.emit(rota);
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}


