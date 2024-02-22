import { TestBed } from '@angular/core/testing';

import { CustomerSupportModalService } from './customer-support-modal.service';

describe('CustomerSupportModalService', () => {
  let service: CustomerSupportModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerSupportModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
