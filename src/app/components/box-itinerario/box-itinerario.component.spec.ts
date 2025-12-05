import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxItinerarioComponent } from './box-itinerario.component';

describe('BoxItinerarioComponent', () => {
  let component: BoxItinerarioComponent;
  let fixture: ComponentFixture<BoxItinerarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxItinerarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxItinerarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
