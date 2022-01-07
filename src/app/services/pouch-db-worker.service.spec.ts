import { TestBed } from '@angular/core/testing';

import { PouchDbWorkerService } from './pouch-db-worker.service';

describe('PouchDbWorkerService', () => {
  let service: PouchDbWorkerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PouchDbWorkerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
