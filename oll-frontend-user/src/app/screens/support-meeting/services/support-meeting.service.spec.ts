import { TestBed } from '@angular/core/testing';

import { SupportMeetingService } from './support-meeting.service';

describe('SupportMeetingService', () => {
  let service: SupportMeetingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupportMeetingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
