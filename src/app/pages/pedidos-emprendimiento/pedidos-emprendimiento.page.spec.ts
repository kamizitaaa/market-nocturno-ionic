import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidosEmprendimientoPage } from './pedidos-emprendimiento.page';

describe('PedidosEmprendimientoPage', () => {
  let component: PedidosEmprendimientoPage;
  let fixture: ComponentFixture<PedidosEmprendimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosEmprendimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
