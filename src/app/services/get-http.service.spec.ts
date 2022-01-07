import { TestBed } from '@angular/core/testing';

import { GetHttpService } from './get-http.service';

describe('GetHttpService', () => {
  let service: GetHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
