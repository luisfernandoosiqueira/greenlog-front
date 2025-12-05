import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxBairroComponent } from './box-bairro.component';

describe('BoxBairroComponent', () => {
  let component: BoxBairroComponent;
  let fixture: ComponentFixture<BoxBairroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoxBairroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoxBairroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
