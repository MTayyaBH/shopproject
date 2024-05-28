import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountdetailsComponent } from './accountdetails.component';

describe('AccountdetailsComponent', () => {
  let component: AccountdetailsComponent;
  let fixture: ComponentFixture<AccountdetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountdetailsComponent]
    });
    fixture = TestBed.createComponent(AccountdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
