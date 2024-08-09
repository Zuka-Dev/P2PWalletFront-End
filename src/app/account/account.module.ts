import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { FundAccountModalComponent } from './fund-account-modal/fund-account-modal.component';
import { TransferMoneyModalComponent } from './transfer-money-modal/transfer-money-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsComponent } from './account/account.component';
import { PinEntryModalComponent } from './pin-entry-modal/pin-entry-modal.component';

@NgModule({
  declarations: [
    AccountsComponent,
    FundAccountModalComponent,
    TransferMoneyModalComponent,
    PinEntryModalComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class AccountModule {}
