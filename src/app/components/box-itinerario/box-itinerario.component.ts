import { Component, Input } from '@angular/core';
import { ItinerarioResponse } from '../../model/Itinerario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItinerarioService } from '../../services/itinerario.service';
@Component({
  selector: 'app-box-itinerario',
  imports: [CommonModule, FormsModule],
  templateUrl: './box-itinerario.component.html',
  styleUrl: './box-itinerario.component.scss'
})
export class BoxItinerarioComponent {
  @Input() itinerario: ItinerarioResponse | null = null;

  constructor(private itinerarioService: ItinerarioService){}

  get todasAsRuas() {
    return this.itinerario?.rota?.trechos
      ?.flatMap(t => t.ruas) || [];
  }

  excluir(){
    if(this.itinerario != null){
      this.itinerarioService.delete(this.itinerario?.id);
    }
  }

}
