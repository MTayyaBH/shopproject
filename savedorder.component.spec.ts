import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedorderComponent } from './savedorder.component';

describe('SavedorderComponent', () => {
  let component: SavedorderComponent;
  let fixture: ComponentFixture<SavedorderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SavedorderComponent]
    });
    fixture = TestBed.createComponent(SavedorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
