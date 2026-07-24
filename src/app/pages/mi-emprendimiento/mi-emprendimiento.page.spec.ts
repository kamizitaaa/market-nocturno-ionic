import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MiEmprendimientoPage } from './mi-emprendimiento.page';

describe('MiEmprendimientoPage', () => {
  let component: MiEmprendimientoPage;
  let fixture: ComponentFixture<MiEmprendimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MiEmprendimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
