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

  // listas visíveis por select
  pontosDisponiveisL1: PontoColetaResponse[] = [];
  pontosDisponiveisL2: PontoColetaResponse[] = [];
  pontosDisponiveisL3: PontoColetaResponse[] = [];

  // flags de controle
  pontosCarregados = false;
  inicializandoEdicao = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private caminhaoService: CaminhaoService,
    private pontoColetaService: PontoColetaService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      caminhaoPlaca: ['', Validators.required],
      tipoResiduo: ['', Validators.required],

      // iniciam desabilitados
      ponto1: [{ value: '', disabled: true }, Validators.required],
      ponto2: [{ value: '', disabled: true }],
      ponto3: [{ value: '', disabled: true }],
    });

    // carrega caminhões (sem relação direta aqui)
    caminhaoService.findAll().subscribe({
      next: (caminhao) => this.caminhoesDisponiveis = caminhao,
      error: (err) => {
        console.error('Erro ao carregar caminhão', err);
        alert('Erro ao carregar registros.');
      }
    });

    // carrega pontos e marca que podemos começar a filtrar
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
        alert('Erro ao carregar registros.');
      }
    });
  }

  ngOnInit(): void {
    // WATCHER: tipoResiduo
    this.form.get('tipoResiduo')?.valueChanges.subscribe(tipoSelecionado => {
      console.log('tipoResiduo selecionado:', tipoSelecionado);

      if (!this.pontosCarregados) {
        console.log('Ainda não carregou pontos — abortando filtro.');
        return;
      }
      if (!tipoSelecionado) {
        console.log('Nenhum tipo selecionado — limpando listas e desabilitando pontos.');
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

      console.log('pontosDisponiveisL1 resultante:', this.pontosDisponiveisL1);

      this.form.get('ponto1')?.enable();
      this.form.patchValue({ ponto1: '', ponto2: '', ponto3: '' }, { emitEvent: false });
      this.form.get('ponto2')?.disable();
      this.form.get('ponto3')?.disable();

      this.pontosDisponiveisL2 = [];
      this.pontosDisponiveisL3 = [];
    });

    // WATCHER: ponto1
    this.form.get('ponto1')?.valueChanges.subscribe(idSelecionado => {
      console.log('ponto1 selecionado:', idSelecionado);

      idSelecionado = Number(idSelecionado); // <--- CONVERSÃO AQUI

      const tipoAtual = this.form.get('tipoResiduo')?.value;

      this.pontosDisponiveisL2 = this.pontosDisponiveis
        .filter(p => p.tiposResiduos.includes(tipoAtual))
        .filter(p => p.id !== idSelecionado);

      console.log('pontosDisponiveisL2 FILTRADA:', this.pontosDisponiveisL2);

      this.form.get('ponto2')?.enable();
    });


    // WATCHER: ponto2
    this.form.get('ponto2')?.valueChanges.subscribe(idSelecionado => {
      idSelecionado = Number(idSelecionado);

      const tipoAtual = this.form.get('tipoResiduo')?.value;
      const idP1 = Number(this.form.get('ponto1')?.value);

      this.pontosDisponiveisL3 = this.pontosDisponiveis
        .filter(p => p.tiposResiduos.includes(tipoAtual))
        .filter(p => p.id !== idP1 && p.id !== idSelecionado);

      this.form.get('ponto3')?.enable();
    });
  }

  private filtrarPorTipo(tipo: string): PontoColetaResponse[] {
    if (!tipo) return [];
    return this.pontosDisponiveis.filter(p =>
      Array.isArray(p.tiposResiduos) && p.tiposResiduos.includes(tipo as TipoResiduo)
    );
  }

  private preencherEdicao() {
    if (!this.rotaParaEditar) return;
    if (!this.pontosCarregados) return;

    this.inicializandoEdicao = true;
    const r = this.rotaParaEditar;

    // 🔹 CARREGA NOME
    this.form.get('nome')?.setValue(r.nome, { emitEvent: false });

    // 🔹 CARREGA CAMINHÃO
    this.form.get('caminhaoPlaca')?.setValue(r.caminhao.placa, { emitEvent: false });

    // 🔹 CARREGA TIPO DE RESÍDUO
    this.form.get('tipoResiduo')?.setValue(r.tipoResiduo, { emitEvent: false });

    // preencher ponto1
    if (r.pontosColeta?.length > 0) {
      const p1 = r.pontosColeta[0].id;

      // habilita ponto1
      this.form.get('ponto1')?.enable({ emitEvent: false });
      this.form.get('ponto1')?.setValue(p1, { emitEvent: false });

      // L2 = filtrados exceto p1
      this.pontosDisponiveisL2 = this.filtrarPorTipo(r.tipoResiduo)
        .filter(p => p.id !== p1);

      // habilita ponto2
      this.form.get('ponto2')?.enable({ emitEvent: false });
    }

    // preencher ponto2
    if (r.pontosColeta?.length > 1) {
      const p2 = r.pontosColeta[1].id;
      const p1id = r.pontosColeta[0].id;

      this.form.get('ponto2')?.enable({ emitEvent: false });
      this.form.get('ponto2')?.setValue(p2, { emitEvent: false });

      // L3 = filtrados exc p1 e p2
      this.pontosDisponiveisL3 = this.filtrarPorTipo(r.tipoResiduo)
        .filter(p => p.id !== p1id && p.id !== p2);

      // habilita ponto3
      this.form.get('ponto3')?.enable({ emitEvent: false });
    }

    // preencher ponto3
    if (r.pontosColeta?.length > 2) {
      const p3 = r.pontosColeta[2].id;

      this.form.get('ponto3')?.enable({ emitEvent: false });
      this.form.get('ponto3')?.setValue(p3, { emitEvent: false });
    }
    
    this.inicializandoEdicao = false;
  }

  salvar() {
    if (this.form.invalid) return;

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

  cancelar() {
    this.aoCancelar.emit();
  }
}



