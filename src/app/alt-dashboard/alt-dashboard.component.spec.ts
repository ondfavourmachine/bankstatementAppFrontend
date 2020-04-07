import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AltDashboardComponent } from './alt-dashboard.component';

describe('AltDashboardComponent', () => {
  let component: AltDashboardComponent;
  let fixture: ComponentFixture<AltDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AltDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AltDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
