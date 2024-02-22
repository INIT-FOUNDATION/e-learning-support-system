import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedirectionModalComponent } from './redirection-modal.component';

describe('RedirectionModalComponent', () => {
  let component: RedirectionModalComponent;
  let fixture: ComponentFixture<RedirectionModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectionModalComponent]
    });
    fixture = TestBed.createComponent(RedirectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
