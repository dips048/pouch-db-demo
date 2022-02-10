import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexedDbTestComponent } from './indexed-db-test.component';

describe('IndexedDbTestComponent', () => {
  let component: IndexedDbTestComponent;
  let fixture: ComponentFixture<IndexedDbTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndexedDbTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexedDbTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
