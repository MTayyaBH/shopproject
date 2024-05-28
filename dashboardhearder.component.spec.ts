import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardhearderComponent } from './dashboardhearder.component';

describe('DashboardhearderComponent', () => {
  let component: DashboardhearderComponent;
  let fixture: ComponentFixture<DashboardhearderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardhearderComponent]
    });
    fixture = TestBed.createComponent(DashboardhearderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
