import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmprendimientoDetallePage } from './emprendimiento-detalle.page';

describe('EmprendimientoDetallePage', () => {
  let component: EmprendimientoDetallePage;
  let fixture: ComponentFixture<EmprendimientoDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmprendimientoDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
