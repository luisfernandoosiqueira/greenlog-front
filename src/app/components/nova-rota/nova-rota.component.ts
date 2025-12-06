import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RotaRequest, RotaResponse } from '../../model/Rota';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaminhaoResponse } from '../../model/Caminhao';
import { PontoColetaResponse } from '../../model/PontoColeta';
import { CommonModule } from '@angular/common';
import { CaminhaoService } from '../../services/caminhao.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { PontoColetaService } from '../../services/pontoColeta.service';
import { AlertService } from '../../alert/alert.service';

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

  pontosDisponiveisL1: PontoColetaResponse[] = [];
  pontosDisponiveisL2: PontoColetaResponse[] = [];
  pontosDisponiveisL3: PontoColetaResponse[] = [];

  pontosCarregados = false;
  inicializandoEdicao = false;

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private caminhaoService: CaminhaoService,
    private pontoColetaService: PontoColetaService,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      caminhaoPlaca: ['', Validators.required],
      tipoResiduo: ['', Validators.required],
      ponto1: [{ value: '', disabled: true }, Validators.required],
      ponto2: [{ value: '', disabled: true }],
      ponto3: [{ value: '', disabled: true }]
    });

    caminhaoService.findAll().subscribe({
      next: (caminhao) => (this.caminhoesDisponiveis = caminhao),
      error: (err) => {
        console.error('Erro ao carregar caminhão', err);
        this.alert.error('Erro', 'Erro ao carregar caminhões.');
      }
    });

    pontoColetaService.findAll().subscribe({
      next: (pontos) => {
        this.pontosDisponiveis = pontos || [];

        this.pontosDisponiveisL1 = [...this.pontosDisponiveis];
        this.pontosDisponiveisL2 = [...this.pontosDisponiveis];
        this.pontosDisponiveisL3 = [...this.pontosDisponiveis];

        this.pontosCarregados = true;

        if (this.rotaParaEditar) {
          this.preencherEdicao();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar pontos', err);
        this.alert.error('Erro', 'Erro ao carregar pontos de coleta.');
      }
    });
  }

  ngOnInit(): void {
    this.form.get('tipoResiduo')?.valueChanges.subscribe(tipoSelecionado => {
      if (!this.pontosCarregados) {
        return;
      }
      if (!tipoSelecionado) {
        this.pontosDisponiveisL1 = [];
        this.pontosDisponiveisL2 = [];
        this.pontosDisponiveisL3 = [];
        this.form.get('ponto1')?.disable();
        this.form.get('ponto2')?.disable();
        this.form.get('ponto3')?.disable();
        return;
      }

      this.pontosDisponiveisL1 = this.pontosDisponiveis.filter(p => {
        return Array.isArray(p.tiposResiduos) && p.tiposResiduos.includes(tipoSelecionado);
      });

      this.form.get('ponto1')?.enable();
      this.form.patchValue({ ponto1: '', ponto2: '', ponto3: '' }, { emitEvent: false });
      this.form.get('ponto2')?.disable();
      this.form.get('ponto3')?.disable();

      this.pontosDisponiveisL2 = [];
      this.pontosDisponiveisL3 = [];
    });

    this.form.get('ponto1')?.valueChanges.subscribe(idSelecionado => {
      idSelecionado = Number(idSelecionado);
      const tipoAtual = this.form.get('tipoResiduo')?.value;

      this.pontosDisponiveisL2 = this.pontosDisponiveis
        .filter(p => p.tiposResiduos.includes(tipoAtual))
        .filter(p => p.id !== idSelecionado);

      this.form.get('ponto2')?.enable();
    });

    this.form.get('ponto2')?.valueChanges.subscribe(idSelecionado => {
      idSelecionado = Number(idSelecionado);

      const tipoAtual = this.form.get('tipoResiduo')?.value;
      const idP1 = Number(this.form.get('ponto1')?.value);

      this.pontosDisponiveisL3 = this.pontosDisponiveis
        .filter(p => p.tiposResiduos.includes(tipoAtual))
        .filter(p => p.id !== idP1 && p.id !== idSelecionado);

      this.form.get('ponto3')?.enable();
    });

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  private filtrarPorTipo(tipo: string): PontoColetaResponse[] {
    if (!tipo) return [];
    return this.pontosDisponiveis.filter(p =>
      Array.isArray(p.tiposResiduos) && p.tiposResiduos.includes(tipo as TipoResiduo)
    );
  }

  private preencherEdicao(): void {
    if (!this.rotaParaEditar) return;
    if (!this.pontosCarregados) return;

    this.inicializandoEdicao = true;
    const r = this.rotaParaEditar;

    this.form.get('nome')?.setValue(r.nome, { emitEvent: false });
    this.form.get('caminhaoPlaca')?.setValue(r.caminhao.placa, { emitEvent: false });
    this.form.get('tipoResiduo')?.setValue(r.tipoResiduo, { emitEvent: false });

    if (r.pontosColeta?.length > 0) {
      const p1 = r.pontosColeta[0].id;

      this.form.get('ponto1')?.enable({ emitEvent: false });
      this.form.get('ponto1')?.setValue(p1, { emitEvent: false });

      this.pontosDisponiveisL2 = this.filtrarPorTipo(r.tipoResiduo)
        .filter(p => p.id !== p1);

      this.form.get('ponto2')?.enable({ emitEvent: false });
    }

    if (r.pontosColeta?.length > 1) {
      const p2 = r.pontosColeta[1].id;
      const p1id = r.pontosColeta[0].id;

      this.form.get('ponto2')?.enable({ emitEvent: false });
      this.form.get('ponto2')?.setValue(p2, { emitEvent: false });

      this.pontosDisponiveisL3 = this.filtrarPorTipo(r.tipoResiduo)
        .filter(p => p.id !== p1id && p.id !== p2);

      this.form.get('ponto3')?.enable({ emitEvent: false });
    }

    if (r.pontosColeta?.length > 2) {
      const p3 = r.pontosColeta[2].id;

      this.form.get('ponto3')?.enable({ emitEvent: false });
      this.form.get('ponto3')?.setValue(p3, { emitEvent: false });
    }

    this.inicializandoEdicao = false;
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warn('Formulário inválido', 'Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    const pontosIds = [
      this.form.value.ponto1,
      this.form.value.ponto2,
      this.form.value.ponto3
    ].filter(id => id);

    const rota: RotaRequest = {
      nome: this.form.value.nome,
      caminhaoPlaca: this.form.value.caminhaoPlaca,
      tipoResiduo: this.form.value.tipoResiduo,
      pontosColetaIds: pontosIds
    };

    this.aoSalvar.emit(rota);
  }

  cancelar(): void {
    if (this.form.dirty || this.formAlterado) {
      this.alert
        .confirm('Cancelar cadastro', 'Existem alterações não salvas. Deseja cancelar mesmo assim?')
        .then(result => {
          if (result.isConfirmed) {
            this.aoCancelar.emit();
          }
        });
    } else {
      this.aoCancelar.emit();
    }
  }

  limparEstadoAlterado(): void {
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.formAlterado = false;
  }

  temAlteracoes(): boolean {
    return !!this.form && (this.formAlterado || this.form.dirty);
  }
}
