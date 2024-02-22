import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMeetingComponent } from './support-meeting.component';

describe('SupportMeetingComponent', () => {
  let component: SupportMeetingComponent;
  let fixture: ComponentFixture<SupportMeetingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupportMeetingComponent]
    });
    fixture = TestBed.createComponent(SupportMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
