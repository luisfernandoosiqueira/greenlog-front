import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoCaminhaoComponent } from './novo-caminhao.component';

describe('NovoCaminhaoComponent', () => {
  let component: NovoCaminhaoComponent;
  let fixture: ComponentFixture<NovoCaminhaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoCaminhaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoCaminhaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
