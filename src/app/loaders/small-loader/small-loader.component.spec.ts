import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallLoaderComponent } from './small-loader.component';

describe('SmallLoaderComponent', () => {
  let component: SmallLoaderComponent;
  let fixture: ComponentFixture<SmallLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
