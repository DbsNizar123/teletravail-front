import { TestBed } from '@angular/core/testing';

import { TeletravailRequestService } from './teletravail-request.service';

describe('TeletravailRequestService', () => {
  let service: TeletravailRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeletravailRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
