import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CaminhaoRequest, CaminhaoResponse } from '../../model/Caminhao';
import { StatusCaminhao } from '../../model/enums/StatusCaminhao';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MotoristaResponse } from '../../model/Motorista';
import { NgxMaskDirective } from 'ngx-mask';
import { MotoristaService } from '../../services/motorista.service';
import { TipoResiduo } from '../../model/enums/TipoResiduo';

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

  constructor(private fb: FormBuilder, private motoristaService: MotoristaService) {

    this.form = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/)]],
      motoristaCpf: [null, Validators.required],
      capacidadeKg: ['', [Validators.required, Validators.min(1)]],
      status: [null, Validators.required],
      tiposResiduos: this.fb.array([])
    });

    // MOTORISTA
    motoristaService.findAll().subscribe({
      next: (motorista) => this.listaMotorista = motorista,
      error: (err) => console.error("Erro ao carregar motorista", err)
    });
  }

  ngOnInit(): void {
  }

  salvar() {
    if (this.form.valid) {

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
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}

