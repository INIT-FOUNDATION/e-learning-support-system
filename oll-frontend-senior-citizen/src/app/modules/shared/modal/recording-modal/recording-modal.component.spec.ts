import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingModalComponent } from './recording-modal.component';

describe('RecordingModalComponent', () => {
  let component: RecordingModalComponent;
  let fixture: ComponentFixture<RecordingModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecordingModalComponent]
    });
    fixture = TestBed.createComponent(RecordingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
