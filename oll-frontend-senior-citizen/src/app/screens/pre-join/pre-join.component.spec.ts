import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreJoinComponent } from './pre-join.component';

describe('PreJoinComponent', () => {
  let component: PreJoinComponent;
  let fixture: ComponentFixture<PreJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreJoinComponent]
    });
    fixture = TestBed.createComponent(PreJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
