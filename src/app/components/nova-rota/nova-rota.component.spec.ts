import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaRotaComponent } from './nova-rota.component';

describe('NovaRotaComponent', () => {
  let component: NovaRotaComponent;
  let fixture: ComponentFixture<NovaRotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaRotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaRotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
