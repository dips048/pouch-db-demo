import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PouchDbInteractionComponent } from './pouch-db-interaction.component';

describe('PouchDbInteractionComponent', () => {
  let component: PouchDbInteractionComponent;
  let fixture: ComponentFixture<PouchDbInteractionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PouchDbInteractionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PouchDbInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
