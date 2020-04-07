import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAndEmailComponent } from './profile-and-email.component';

describe('ProfileAndEmailComponent', () => {
  let component: ProfileAndEmailComponent;
  let fixture: ComponentFixture<ProfileAndEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAndEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAndEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
