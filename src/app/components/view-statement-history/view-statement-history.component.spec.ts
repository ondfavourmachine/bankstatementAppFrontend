import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatementHistoryComponent } from './view-statement-history.component';

describe('ViewStatementHistoryComponent', () => {
  let component: ViewStatementHistoryComponent;
  let fixture: ComponentFixture<ViewStatementHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatementHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
