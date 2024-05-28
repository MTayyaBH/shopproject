import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedorderComponent } from './completedorder.component';

describe('CompletedorderComponent', () => {
  let component: CompletedorderComponent;
  let fixture: ComponentFixture<CompletedorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletedorderComponent]
    });
    fixture = TestBed.createComponent(CompletedorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
