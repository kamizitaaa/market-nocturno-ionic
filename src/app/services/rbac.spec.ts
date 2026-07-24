import { TestBed } from '@angular/core/testing';

import { Rbac } from './rbac';

describe('Rbac', () => {
  let service: Rbac;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rbac);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
