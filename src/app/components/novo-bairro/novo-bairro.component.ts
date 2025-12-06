import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BairroRequest, BairroResponse } from '../../model/Bairro';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-novo-bairro',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './novo-bairro.component.html',
  styleUrl: './novo-bairro.component.scss'
})
export class NovoBairroComponent implements OnInit {
  @Input() bairroParaEditar: BairroResponse | null = null;

  @Output() aoSalvar = new EventEmitter<BairroRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    if (this.bairroParaEditar) {
      this.form.patchValue(
        {
          nome: this.bairroParaEditar.nome
        },
        { emitEvent: false }
      );
    }

    this.form.valueChanges.subscribe(() => {
      this.formAlterado = true;
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.alert.warn('Formulário inválido', 'Verifique os campos obrigatórios antes de salvar.');
      return;
    }

    const bairroSalvo: BairroRequest = this.form.value;
    this.aoSalvar.emit(bairroSalvo);
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
