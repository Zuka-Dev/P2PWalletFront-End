import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinEntryModalComponent } from './pin-entry-modal.component';

describe('PinEntryModalComponent', () => {
  let component: PinEntryModalComponent;
  let fixture: ComponentFixture<PinEntryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinEntryModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinEntryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
