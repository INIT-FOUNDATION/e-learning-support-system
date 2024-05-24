import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounselorFormComponent } from './counselor-form.component';

describe('CounselorFormComponent', () => {
  let component: CounselorFormComponent;
  let fixture: ComponentFixture<CounselorFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CounselorFormComponent]
    });
    fixture = TestBed.createComponent(CounselorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
