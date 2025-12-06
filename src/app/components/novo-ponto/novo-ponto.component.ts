import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PontoColetaRequest, PontoColetaResponse } from '../../model/PontoColeta';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { NgxMaskDirective } from 'ngx-mask';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-novo-ponto',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './novo-ponto.component.html',
  styleUrl: './novo-ponto.component.scss'
})
export class NovoPontoComponent implements OnInit {
  @Input() pontoParaEditar: PontoColetaResponse | null = null;
  @Input() bairroId: number = 0;

  @Output() aoSalvar = new EventEmitter<PontoColetaRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  tiposResiduosEnum = Object.keys(TipoResiduo);

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      bairroId: [''],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      responsavel: ['', [Validators.required, Validators.minLength(3)]],
      telefone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
      endereco: ['', [Validators.required, Validators.minLength(3)]],
      horaEntrada: ['', [Validators.required]],
      horaSaida: ['', [Validators.required]],
      quantidadeResiduosKg: ['', [Validators.required]],
      tiposResiduos: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.initTiposResiduos();

    if (this.pontoParaEditar) {
      this.preencherFormularioEdicao();
    }

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  initTiposResiduos(): void {
    const array = this.form.get('tiposResiduos') as FormArray;
    array.clear();

    this.tiposResiduosEnum.forEach(() => {
      array.push(new FormControl(false));
    });
  }

  preencherFormularioEdicao(): void {
    this.form.patchValue({
      bairroId: this.pontoParaEditar?.bairro,
      nome: this.pontoParaEditar?.nome,
      responsavel: this.pontoParaEditar?.responsavel,
      telefone: this.pontoParaEditar?.telefone,
      email: this.pontoParaEditar?.email,
      endereco: this.pontoParaEditar?.endereco,
      horaEntrada: this.pontoParaEditar?.horaEntrada,
      horaSaida: this.pontoParaEditar?.horaSaida,
      quantidadeResiduosKg: this.pontoParaEditar?.quantidadeResiduosKg
    });

    const array = this.form.get('tiposResiduos') as FormArray;

    this.tiposResiduosEnum.forEach((tipo, index) => {
      const selecionado = this.pontoParaEditar!.tiposResiduos.includes(tipo as any);
      array.at(index).setValue(selecionado);
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warn('Formulário inválido', 'Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    const selecionadosBoolean = this.form.value.tiposResiduos;

    const tiposResiduoNomes = selecionadosBoolean
      .map((checked: boolean, i: number) => (checked ? this.tiposResiduosEnum[i] : null))
      .filter((nome: string | null): nome is string => nome !== null);

    const pontoSalvo: PontoColetaRequest = {
      ...this.form.value,
      bairroId: this.bairroId,
      tiposResiduos: tiposResiduoNomes
    };

    this.aoSalvar.emit(pontoSalvo);
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
