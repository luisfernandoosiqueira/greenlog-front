import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BairroSimplesResponse } from '../../model/Bairro';
import { RuaRequest, RuaResponse } from '../../model/Rua';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BairroService } from '../../services/bairro.service';
import { ConexaoService } from '../../services/conexao.service';

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

  constructor(private fb: FormBuilder, private bairroService: BairroService){
    this.form = this.fb.group({
      origemId: [null, Validators.required],
      destinoId: [null, Validators.required],
      distanciaKm: ['', Validators.required],
    })

    this.bairroService.findAll().subscribe({
      next: (bairros) => {
        this.listaBairros = bairros;
        console.log("Bairros carregados:", bairros);
      },
      error: (err) => {
        console.error("Erro ao carregar bairros", err);
      }
    });
  }

  ngOnInit(): void {
    if (this.ruaParaEditar) {
      this.form.patchValue({
        origemId: this.ruaParaEditar.origem.id,
        destinoId: this.ruaParaEditar.destino.id,
        distanciaKm: this.ruaParaEditar.distanciaKm,
      });
    }
  }

  salvar() {
    if (this.form.valid){
      const ruaSalvo: RuaRequest = this.form.value;
      this.aoSalvar.emit(ruaSalvo);
    }
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}
