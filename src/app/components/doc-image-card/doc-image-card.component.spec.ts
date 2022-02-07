import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocImageCardComponent } from './doc-image-card.component';

describe('DocImageCardComponent', () => {
  let component: DocImageCardComponent;
  let fixture: ComponentFixture<DocImageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocImageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocImageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
