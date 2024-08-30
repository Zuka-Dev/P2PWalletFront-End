import { TestBed } from '@angular/core/testing';

import { ForeignWalletService } from './foreign-wallet.service';

describe('ForeignWalletService', () => {
  let service: ForeignWalletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForeignWalletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
