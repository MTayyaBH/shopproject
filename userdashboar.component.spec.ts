import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserdashboarComponent } from './userdashboar.component';

describe('UserdashboarComponent', () => {
  let component: UserdashboarComponent;
  let fixture: ComponentFixture<UserdashboarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserdashboarComponent]
    });
    fixture = TestBed.createComponent(UserdashboarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
