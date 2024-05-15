import { TestBed } from '@angular/core/testing';

import { TrexGameService } from './trex-game.service';

describe('TrexGameService', () => {
  let service: TrexGameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrexGameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
