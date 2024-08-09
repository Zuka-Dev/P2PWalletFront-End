import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FundAccountModalComponent } from './fund-account-modal.component';

describe('FundAccountModalComponent', () => {
  let component: FundAccountModalComponent;
  let fixture: ComponentFixture<FundAccountModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundAccountModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FundAccountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
