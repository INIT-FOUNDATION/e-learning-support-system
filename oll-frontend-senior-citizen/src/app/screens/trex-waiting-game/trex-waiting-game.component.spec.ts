import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrexWaitingGameComponent } from './trex-waiting-game.component';

describe('TrexWaitingGameComponent', () => {
  let component: TrexWaitingGameComponent;
  let fixture: ComponentFixture<TrexWaitingGameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrexWaitingGameComponent]
    });
    fixture = TestBed.createComponent(TrexWaitingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
