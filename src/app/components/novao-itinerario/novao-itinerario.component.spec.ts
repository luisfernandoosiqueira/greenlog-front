import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaoItinerarioComponent } from './novao-itinerario.component';

describe('NovaoItinerarioComponent', () => {
  let component: NovaoItinerarioComponent;
  let fixture: ComponentFixture<NovaoItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaoItinerarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaoItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
