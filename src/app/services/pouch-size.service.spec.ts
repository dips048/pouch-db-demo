import { TestBed } from '@angular/core/testing';

import { PouchSizeService } from './pouch-size.service';

describe('PouchSizeService', () => {
  let service: PouchSizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PouchSizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
