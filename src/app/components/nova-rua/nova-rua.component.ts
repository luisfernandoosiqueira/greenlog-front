import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BairroSimplesResponse } from '../../model/Bairro';
import { RuaRequest, RuaResponse } from '../../model/Rua';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BairroService } from '../../services/bairro.service';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-nova-rua',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nova-rua.component.html',
  styleUrl: './nova-rua.component.scss'
})
export class NovaRuaComponent implements OnInit {
  @Input() ruaParaEditar: RuaResponse | null = null;

  @Output() aoSalvar = new EventEmitter<RuaRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  listaBairros: BairroSimplesResponse[] = [];

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private bairroService: BairroService,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      origemId: [null, Validators.required],
      destinoId: [null, Validators.required],
      distanciaKm: ['', Validators.required]
    });

    this.bairroService.findAll().subscribe({
      next: (bairros) => {
        this.listaBairros = bairros;
        console.log('Bairros carregados:', bairros);
      },
      error: (err) => {
        console.error('Erro ao carregar bairros', err);
      }
    });
  }

  ngOnInit(): void {
    if (this.ruaParaEditar) {
      this.form.patchValue(
        {
          origemId: this.ruaParaEditar.origem.id,
          destinoId: this.ruaParaEditar.destino.id,
          distanciaKm: this.ruaParaEditar.distanciaKm
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

    const ruaSalvo: RuaRequest = this.form.value;
    this.aoSalvar.emit(ruaSalvo);
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
