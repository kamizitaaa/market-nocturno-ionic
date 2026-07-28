import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificarMfaPage } from './verificar-mfa.page';

describe('VerificarMfaPage', () => {
  let component: VerificarMfaPage;
  let fixture: ComponentFixture<VerificarMfaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarMfaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
