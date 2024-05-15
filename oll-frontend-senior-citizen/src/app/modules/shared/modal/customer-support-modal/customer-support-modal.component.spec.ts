import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSupportModalComponent } from './customer-support-modal.component';

describe('CustomerSupportModalComponent', () => {
  let component: CustomerSupportModalComponent;
  let fixture: ComponentFixture<CustomerSupportModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerSupportModalComponent]
    });
    fixture = TestBed.createComponent(CustomerSupportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
