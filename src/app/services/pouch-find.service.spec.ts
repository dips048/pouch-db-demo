import { TestBed } from '@angular/core/testing';

import { PouchFindService } from './pouch-find.service';

describe('PouchFindService', () => {
  let service: PouchFindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PouchFindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
