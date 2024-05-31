import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertFeedbackComponent } from './expert-feedback.component';

describe('ExpertFeedbackComponent', () => {
  let component: ExpertFeedbackComponent;
  let fixture: ComponentFixture<ExpertFeedbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertFeedbackComponent]
    });
    fixture = TestBed.createComponent(ExpertFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
