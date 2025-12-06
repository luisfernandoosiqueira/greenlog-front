import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaminhaoRequest, CaminhaoResponse } from '../../model/Caminhao';
import { StatusCaminhao } from '../../model/enums/StatusCaminhao';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MotoristaResponse } from '../../model/Motorista';
import { NgxMaskDirective } from 'ngx-mask';
import { MotoristaService } from '../../services/motorista.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-novo-caminhao',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './novo-caminhao.component.html',
  styleUrl: './novo-caminhao.component.scss'
})
export class NovoCaminhaoComponent implements OnInit {
  @Input() caminhaoParaEditar: CaminhaoResponse | null = null;

  @Output() aoSalvar = new EventEmitter<CaminhaoRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  statusDisponiveis = Object.values(StatusCaminhao);
  listaMotorista: MotoristaResponse[] = [];
  tiposResiduosEnum = Object.keys(TipoResiduo);

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private motoristaService: MotoristaService,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/)]],
      motoristaCpf: [null, Validators.required],
      capacidadeKg: ['', [Validators.required, Validators.min(1)]],
      status: [null, Validators.required],
      tiposResiduos: this.fb.array([])
    });

    motoristaService.findAll().subscribe({
      next: (motorista) => this.listaMotorista = motorista,
      error: (err) => console.error('Erro ao carregar motorista', err)
    });
  }

  ngOnInit(): void {
    this.initTiposResiduos();

    if (this.caminhaoParaEditar) {
      this.preencherFormulario();
    }

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  initTiposResiduos(): void {
    const array = this.form.get('tiposResiduos') as FormArray;
    array.clear();

    this.tiposResiduosEnum.forEach(() =>
      array.push(new FormControl(false))
    );
  }

  preencherFormulario(): void {
    const c = this.caminhaoParaEditar!;
    this.form.patchValue({
      placa: c.placa,
      motoristaCpf: c.motorista.cpf,
      capacidadeKg: c.capacidadeKg,
      status: c.status
    });
    this.marcarTiposResiduos(c.tiposResiduos);
  }

  marcarTiposResiduos(residuos: string[]): void {
    const array = this.form.get('tiposResiduos') as FormArray;

    this.tiposResiduosEnum.forEach((nome, index) => {
      const marcado = residuos.includes(nome);
      array.at(index).setValue(marcado);
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warn('Formulário inválido', 'Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    const selecionadosBoolean = this.form.value.tiposResiduos;

    const tiposResiduos = selecionadosBoolean
      .map((checked: boolean, i: number) => checked ? this.tiposResiduosEnum[i] : null)
      .filter((nome: string | null): nome is string => nome !== null);

    const caminhaoSalvo: CaminhaoRequest = {
      ...this.form.value,
      tiposResiduos: tiposResiduos
    };

    this.aoSalvar.emit(caminhaoSalvo);
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
