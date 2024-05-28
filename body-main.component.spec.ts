import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyMainComponent } from './body-main.component';


describe('BodyMainComponent', () => {
  let component: BodyMainComponent;
  let fixture: ComponentFixture<BodyMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BodyMainComponent]
    });
    fixture = TestBed.createComponent(BodyMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
export class NzDemoCarouselLoopComponent {
  array = [1, 2, 3, 4];
  effect = 'scrollx';
  current = 1;
}