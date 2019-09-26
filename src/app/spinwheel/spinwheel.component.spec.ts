import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinwheelComponent } from './spinwheel.component';

describe('SpinwheelComponent', () => {
  let component: SpinwheelComponent;
  let fixture: ComponentFixture<SpinwheelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinwheelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinwheelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
