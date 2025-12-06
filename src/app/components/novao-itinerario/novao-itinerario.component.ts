import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItinerarioRequest, ItinerarioResponse } from '../../model/Itinerario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RotaService } from '../../services/rota.service';
import { RotaResponse } from '../../model/Rota';
import { CommonModule } from '@angular/common';
import { AlertService } from '../../alert/alert.service';

@Component({
  selector: 'app-novao-itinerario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './novao-itinerario.component.html',
  styleUrl: './novao-itinerario.component.scss'
})
export class NovaoItinerarioComponent implements OnInit {
  @Input() itinerarioParaEditar: ItinerarioResponse | null = null;

  @Output() aoSalvar = new EventEmitter<ItinerarioRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  listaRotas: RotaResponse[] = [];

  form: FormGroup;
  formAlterado = false;

  constructor(
    private fb: FormBuilder,
    private rotaService: RotaService,
    private alert: AlertService
  ) {
    this.form = this.fb.group({
      rotaId: [null, Validators.required],
      data: [null, Validators.required]
    });

    this.rotaService.findAll().subscribe({
      next: (rotas) => {
        this.listaRotas = rotas;
        console.log('Rotas carregadas:', rotas);
      },
      error: (err) => {
        console.error('Erro ao carregar rotas', err);
        this.alert.error('Erro', 'Erro ao carregar rotas.');
      }
    });
  }

  ngOnInit(): void {
    if (this.itinerarioParaEditar) {
      this.form.patchValue(
        {
          rotaId: this.itinerarioParaEditar.rota,
          data: this.itinerarioParaEditar.data
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

    const itinerarioSalvo: ItinerarioRequest = this.form.value;
    this.aoSalvar.emit(itinerarioSalvo);
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
