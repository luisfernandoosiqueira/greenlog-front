import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItinerarioRequest, ItinerarioResponse } from '../../model/Itinerario';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RotaService } from '../../services/rota.service';
import { RotaResponse } from '../../model/Rota';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-novao-itinerario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './novao-itinerario.component.html',
  styleUrl: './novao-itinerario.component.scss'
})
export class NovaoItinerarioComponent {
  @Input() itinerarioParaEditar: ItinerarioResponse | null = null;

  @Output() aoSalvar = new EventEmitter<ItinerarioRequest>();
  @Output() aoCancelar = new EventEmitter<void>();

  listaRotas: RotaResponse[] = [];

  form: FormGroup;

  constructor(private fb: FormBuilder, private rotaService: RotaService){
    this.form = this.fb.group({
      rotaId: [null, Validators.required],
      data: [null, Validators.required],
    })

    this.rotaService.findAll().subscribe({
      next: (rotas) => {
        this.listaRotas = rotas;
        console.log("Rotas carregados:", rotas);
      },
      error: (err) => {
        console.error("Erro ao carregar rtoas", err);
      }
    });
  }

  ngOnInit(): void {
    if (this.itinerarioParaEditar) {
      this.form.patchValue({
        rotaId: this.itinerarioParaEditar.rota,
        data: this.itinerarioParaEditar.data,
      });
    }
  }

  salvar() {
    if (this.form.valid){
      const itinerarioSalvo: ItinerarioRequest = this.form.value;
      this.aoSalvar.emit(itinerarioSalvo);
    }
  }

  cancelar() {
    this.aoCancelar.emit();
  }

}
