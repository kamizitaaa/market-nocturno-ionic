import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmprendimientosPage } from './emprendimientos.page';

describe('EmprendimientosPage', () => {
  let component: EmprendimientosPage;
  let fixture: ComponentFixture<EmprendimientosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmprendimientosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
