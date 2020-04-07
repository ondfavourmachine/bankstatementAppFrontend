import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementanalyseComponent } from './statementanalyse.component';

describe('StatementanalyseComponent', () => {
  let component: StatementanalyseComponent;
  let fixture: ComponentFixture<StatementanalyseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatementanalyseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementanalyseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
