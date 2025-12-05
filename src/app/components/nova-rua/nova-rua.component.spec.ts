import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovaRuaComponent } from './nova-rua.component';

describe('NovaRuaComponent', () => {
  let component: NovaRuaComponent;
  let fixture: ComponentFixture<NovaRuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovaRuaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovaRuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
