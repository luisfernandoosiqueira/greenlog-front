import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BairroRequest, BairroResponse } from '../../model/Bairro';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder){
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
    })
  }

  ngOnInit(): void {
    if (this.bairroParaEditar) {
      this.form.patchValue({
        nome: this.bairroParaEditar.nome
      });
    }
  }

  salvar() {
    if (this.form.valid){
      const bairroSalvo: BairroRequest = this.form.value; 
      this.aoSalvar.emit(bairroSalvo);
    }
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}
