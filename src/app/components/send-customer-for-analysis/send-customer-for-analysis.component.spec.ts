import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCustomerForAnalysisComponent } from './send-customer-for-analysis.component';

describe('SendCustomerForAnalysisComponent', () => {
  let component: SendCustomerForAnalysisComponent;
  let fixture: ComponentFixture<SendCustomerForAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendCustomerForAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendCustomerForAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
