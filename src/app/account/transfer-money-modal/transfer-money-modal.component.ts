import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-transfer-money-modal',
  templateUrl: './transfer-money-modal.component.html',
  styleUrls: ['./transfer-money-modal.component.scss']
})
export class TransferMoneyModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() transferMoney = new EventEmitter<{ beneficiaryId: string; amount: number; pin: string }>();

  transferMoneyForm: FormGroup;
  showPinModal = false;

  constructor(private fb: FormBuilder) {
    this.transferMoneyForm = this.fb.group({
      beneficiaryId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]]
    });
  }

  onSubmit() {
    if (this.transferMoneyForm.valid) {
      this.showPinModal = true;
    }
  }

  onPinSubmit(pin: string) {
    this.showPinModal = false;
    this.transferMoney.emit({
      beneficiaryId: this.transferMoneyForm.get('beneficiaryId')?.value,
      amount: this.transferMoneyForm.get('amount')?.value,
      pin: pin
    });
  }

  onPinCancel() {
    this.showPinModal = false;
  }
}