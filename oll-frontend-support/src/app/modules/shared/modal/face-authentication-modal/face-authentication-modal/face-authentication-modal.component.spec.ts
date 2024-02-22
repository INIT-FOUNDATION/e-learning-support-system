import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceAuthenticationModalComponent } from './face-authentication-modal.component';

describe('FaceAuthenticationModalComponent', () => {
  let component: FaceAuthenticationModalComponent;
  let fixture: ComponentFixture<FaceAuthenticationModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaceAuthenticationModalComponent]
    });
    fixture = TestBed.createComponent(FaceAuthenticationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
