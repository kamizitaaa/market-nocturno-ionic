import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvocatoriasPage } from './convocatorias.page';

describe('ConvocatoriasPage', () => {
  let component: ConvocatoriasPage;
  let fixture: ComponentFixture<ConvocatoriasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvocatoriasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
