import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularLoggerComponent } from './angular-logger.component';

describe('AngularLoggerComponent', () => {
  let component: AngularLoggerComponent;
  let fixture: ComponentFixture<AngularLoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AngularLoggerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
