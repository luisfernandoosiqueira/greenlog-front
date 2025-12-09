import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';
import { MotoristaRequest, MotoristaResponse } from '../../model/Motorista';
import { AuthService } from '../../auth/auth.service';
import { StatusMotorista } from '../../model/enums/StatusMotorista';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-novo-motorista',
  imports: [CommonModule, ReactiveFormsModule, NgxMaskDirective],
  templateUrl: './novo-motorista.component.html',
  styleUrl: './novo-motorista.component.scss'
})
export class NovoMotoristaComponent implements OnInit {
  @Input() motoristaParaEditar: MotoristaResponse | null = null;

  @Output() aoSalvar = new EventEmitter<MotoristaRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  statusDisponiveis = Object.values(StatusMotorista);

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cpf: ['', [Validators.required, this.validaCpf]],
      data: ['', [Validators.required, this.validaData]],
      telefone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(10)]],
      status: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.motoristaParaEditar) {
      this.form.patchValue(
        {
          nome: this.motoristaParaEditar.nome,
          cpf: this.motoristaParaEditar.cpf,
          data: this.motoristaParaEditar.data,
          telefone: this.motoristaParaEditar.telefone,
          status: this.motoristaParaEditar.status
        },
        { emitEvent: false }
      );
      this.form.get('cpf')?.disable();
    }

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  validaCpf(control: AbstractControl): ValidationErrors | null {
    const v = control.value?.replace(/\D/g, '');
    if (!v) return { documentoInvalido: true };
    if (v.length === 11 || v.length === 14) return null;
    return { documentoInvalido: true };
  }

  validaData(control: AbstractControl): ValidationErrors | null {
    const dataString = control.value;
    if (!dataString) return null;

    const dataNascimento = new Date(dataString);

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (dataNascimento.getTime() > hoje.getTime()) {
      return { dataFutura: true };
    }
    return null;
  }

  formatarDataParaBR(dataISO: string): string {
    return dataISO ? dataISO.replace(/^(\d{4})-(\d{2})-(\d{2})$/, '$3/$2/$1') : '';
  }

  formatarDataParaISO(dataBR: string): string {
    return dataBR ? dataBR.replace(/^(\d{2})\/(\d{2})\/(\d{4})$/, '$3-$2-$1') : '';
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warn('Formulário inválido', 'Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    this.form.get('cpf')?.enable();
    const motoristaSalvo: MotoristaRequest = this.form.value;
    this.aoSalvar.emit(motoristaSalvo);
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
