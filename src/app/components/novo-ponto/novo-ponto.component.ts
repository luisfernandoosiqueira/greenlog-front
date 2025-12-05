import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PontoColetaRequest, PontoColetaResponse } from '../../model/PontoColeta';
import { FormArray, FormBuilder, FormControl, FormGroup, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TipoResiduo } from '../../model/enums/TipoResiduo';

@Component({
  selector: 'app-novo-ponto',
  imports: [CommonModule, ReactiveFormsModule],
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

  constructor(private fb: FormBuilder){
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
    })
  }

  ngOnInit(): void {
  }

  salvar() {
    if (this.form.valid) {

      const selecionadosBoolean = this.form.value.tiposResiduos;

      const tiposResiduoNomes = selecionadosBoolean
        .map((checked: boolean, i: number) => checked ? this.tiposResiduosEnum[i] : null)
        .filter((nome: string | null): nome is string => nome !== null);

      const pontoSalvo: PontoColetaRequest = {
        ...this.form.value,
        bairroId: this.bairroId,
        tiposResiduos: tiposResiduoNomes
      };

      this.aoSalvar.emit(pontoSalvo);
    }
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}
