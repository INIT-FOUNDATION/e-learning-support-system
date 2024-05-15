import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoCustomerSupportAvailableComponent } from './no-customer-support-available.component';

describe('NoCustomerSupportAvailableComponent', () => {
  let component: NoCustomerSupportAvailableComponent;
  let fixture: ComponentFixture<NoCustomerSupportAvailableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoCustomerSupportAvailableComponent]
    });
    fixture = TestBed.createComponent(NoCustomerSupportAvailableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
