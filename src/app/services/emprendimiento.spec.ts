import { TestBed } from '@angular/core/testing';

import { Emprendimiento } from './emprendimiento';

describe('Emprendimiento', () => {
  let service: Emprendimiento;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Emprendimiento);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
