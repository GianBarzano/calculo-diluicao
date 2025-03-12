import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculoDiluicaoComponent } from './calculo-diluicao.component';

describe('CalculoDiluicaoComponent', () => {
  let component: CalculoDiluicaoComponent;
  let fixture: ComponentFixture<CalculoDiluicaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculoDiluicaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculoDiluicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
