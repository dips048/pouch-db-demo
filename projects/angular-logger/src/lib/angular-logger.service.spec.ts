import { TestBed } from '@angular/core/testing';

import { AngularLoggerService } from './angular-logger.service';

describe('AngularLoggerService', () => {
  let service: AngularLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
