import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceRecognizationComponent } from './face-recognization.component';

describe('FaceRecognizationComponent', () => {
  let component: FaceRecognizationComponent;
  let fixture: ComponentFixture<FaceRecognizationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaceRecognizationComponent]
    });
    fixture = TestBed.createComponent(FaceRecognizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
