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

    // CARREGA MOTORISTAS
    motoristaService.findAll().subscribe({
      next: (motorista) => this.listaMotorista = motorista,
      error: (err) => console.error("Erro ao carregar motorista", err)
    });
  }

  ngOnInit(): void {
    this.initTiposResiduos();

    if (this.caminhaoParaEditar) {
      this.preencherFormulario();
    }
  }

  /** Inicializa checkboxes (sempre booleanos) */
  initTiposResiduos() {
    const array = this.form.get('tiposResiduos') as FormArray;

    // Limpa caso o modal seja reutilizado
    array.clear();

    this.tiposResiduosEnum.forEach(() =>
      array.push(new FormControl(false))
    );
  }

  /** Preenche os campos quando estiver editando */
  preencherFormulario() {
    const c = this.caminhaoParaEditar!;

    this.form.patchValue({
      placa: c.placa,
      motoristaCpf: c.motorista.cpf,
      capacidadeKg: c.capacidadeKg,
      status: c.status
    });

    // Agora marcar os checkboxes
    this.marcarTiposResiduos(c.tiposResiduos);
  }

  /** Marca os checkboxes do FormArray conforme os valores já existentes */
  marcarTiposResiduos(residuos: string[]) {
    const array = this.form.get('tiposResiduos') as FormArray;

    this.tiposResiduosEnum.forEach((nome, index) => {
      const marcado = residuos.includes(nome);
      array.at(index).setValue(marcado);
    });
  }

  salvar() {
    if (this.form.invalid) return;

    const selecionadosBoolean = this.form.value.tiposResiduos;

    const tiposResiduos = selecionadosBoolean
      .map((checked: boolean, i: number) => checked ? this.tiposResiduosEnum[i] : null)
      .filter((nome: string | null): nome is string => nome !== null);

    const caminhaoSalvo: CaminhaoRequest = {
      ...this.form.value,
      tiposResiduos: tiposResiduos
    };

    console.log("SALVANDO:", caminhaoSalvo);
    this.aoSalvar.emit(caminhaoSalvo);
  }

  cancelar() {
    this.aoCancelar.emit();
  }
}




