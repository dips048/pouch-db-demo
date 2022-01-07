import { TestBed } from '@angular/core/testing';

import { LocalDbFindService } from './local-db-find.service';

describe('LocalDbFindService', () => {
  let service: LocalDbFindService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalDbFindService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
